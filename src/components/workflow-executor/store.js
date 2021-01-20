import API from "../../service/api.js";
import { REVIEW_OP_TYPE, REVIEW_OP_USER, REVIEW_STATUS, WF_IMPORTANCE, WF_SECTRE, WF_URGENT, WF_EMPTY_TYPE } from "../../const/workflow";
import { filterByDecimal, getDisplayOfCpnt } from "../../tool/form.js";

const BASEDADA = {
    instanceId: '',
    status: REVIEW_STATUS.save.value,
    fileCode: "",
    creator: "",
    ctime: "",
    step: "",
    name: '',
    urgent: WF_URGENT[0],
    import: WF_IMPORTANCE[0],
    secret: WF_SECTRE[0],
    filetype: '',
    opinion: '',
    attachIds: '',
    d_tag: '',
    msg_tag: '',
    creator_name: '',
    attach: '',
    nextUser: null,
    reviews: [],
    curUsernames: '',
    messages: []
}

export default class WfStore {
    constructor(options) {

        this.activeExtendTab = 'data';

        this.configing = true; //基本参数加载控制
        this.loading = false;  //整体页面加载控制
        this.steping = false;  //下一步控制

        this.curStep = null;
        this.appointStep = null;
        this.readLevel = 0;
        this.formStore = null;
        this.copy = false;
        this.copyInstanceId = '';
        this.executorPrintRef = null;

        this.shouldAddEmptyButNot = null;

        this.extend = {};
        this.$vue = {};

        this.userOp = {
            users: '',
            appendType: '',
            text: '',
            title: ''
        }

        this.data = _.cloneDeep(BASEDADA);

        this.log = [];

        this.cfg = {
            wf_name: "",
            wf_code: "",
            wf_map_tp: "",
            wf_body_tp: "",
            wf_status: "",
            map_data_code: "",
            empty_type: WF_EMPTY_TYPE[0].v,
            files: [],
            nextUser: null //只是第一步审核的下一步审核人，此时流程实例还未建立
        }

        this.TEXT = {
            file: { value: "文件编号", id: "file", show: false },
            import: { value: "重要等级", id: "import", show: false },
            secret: { value: "秘密等级", id: "secret", show: false },
            urgent: { value: "加急程度", id: "urgent", show: false }
        }

        this.formImage = null;
        this.showUserOp = false;
        this.showBody = true;
        this.showExtend = true;
        this.showEmptys = false;

        this.curUser = {};

        this.defForm = null;

        //在暂存和撤销的流程中是否是第二次获取流程状态
        this.instanceFlag = false;

        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option];
            }
        }
    }

    get startNode() {
        return this.cfg.wf_map_tp.node[0];
    }

    get isNextEmpty() {
        return this.data.nextUser && this.data.nextUser.auth_user === 'Empty';
    }


    get doNextUser() {
        return this.data.instanceId ? this.data.nextUser : this.cfg.nextUser;
    }

    get nextEmptyNode() {
        if (this.doNextUser) {
            const { target } = this.getFlowNode({ nid: this.doNextUser.current_step });
            return target;
        }
    }

    get isCreator() {
        return this.curUser.user_id === this.data.creator;
    }

    get hasCreatorPower() {
        return (this.isCreator || !this.data.creator) && (
            this.data.status === REVIEW_STATUS.save.value ||
            this.data.status === REVIEW_STATUS.reject.value ||
            this.data.status === REVIEW_STATUS.backout.value
        );
    }

    get notInRoadEmpty() {
        return [WF_EMPTY_TYPE[1].v, WF_EMPTY_TYPE[2].v].includes(this.cfg.empty_type);
    }

    get shouldChooseEmptys() {
        return this.hasCreatorPower && this.notInRoadEmpty && this.data.reviews.length
    }

    //是否需要两次获取流程信息
    get shouldGetInsTwice() {
        return this.notInRoadEmpty && [REVIEW_STATUS.save.value, REVIEW_STATUS.backout.value].includes(this.data.status);
    }

    get mustFillAsCreator() {
        return this.isCreator && (
            this.data.status === REVIEW_STATUS.reject.value ||
            this.data.status === REVIEW_STATUS.backout.value
        )
    }

    get statusEntity() {
        const entity = _.find(Object.values(REVIEW_STATUS), { value: this.data.status });
        if (this.cfg.wf_list_column && this.cfg.wf_list_column.length) {
            const exist = _.find(this.cfg.wf_list_column, { id: entity.id })
            if (exist && exist.value) {
                entity.stamp = exist.value
            }
        }
        return entity;
    }

    //初始化流程配置
    async init({ cfgId, instanceId }) {

        this.loading = true;
        this.configing = true;

        const ret = await API.workflowcfg({ data: { node_id: cfgId, nextUser: true } });
        if (ret.success && ret.data) {

            //设置流程图参数
            const node = JSON.parse(ret.data.wf_map_tp);
            const startChildren = node.splice(1);
            node[0].children = startChildren;

            ret.data.wf_map_tp = {
                wfName: ret.data.wf_name,
                formName: "",
                selectedNode: { nid: '' }, //当前执行人所在的流程节点
                markedNode: { nid: '' }, //当前执行人所在的流程节点
                clickedNode: { nid: '' }, //流程图操作中选择的节点
                executingNodes: [], //流程正在执行中的节点集合,仅仅为了展示
                node
            }

            this.cfg = ret.data;

            if (!this.cfg.empty_type) {
                this.cfg.empty_type = WF_EMPTY_TYPE[0].v;
            }

            try {
                //文本设置
                if (this.cfg.wf_list_column) {
                    this.cfg.wf_list_column = JSON.parse(this.cfg.wf_list_column);
                    this.cfg.wf_list_column.forEach(item => {
                        const exist = this.TEXT[item.id];
                        if (exist) {
                            exist.show = item.show;
                            exist.value = item.value;
                        }
                    })
                }
            } catch (error) {

            }

        }
        await this.setInstance(instanceId);
        this.configing = false;
    }


    // 新建流程实例
    newInstance() {
        //设置当前执行节点为开始节点
        this.setCurStep();
        this.data = _.cloneDeep(BASEDADA);
        this.userOp = {
            users: '',
            appendType: '',
            text: '',
            title: ''
        }
    }

    setCurStep(node) {
        this.cfg.wf_map_tp.selectedNode = this.curStep = (node || this.cfg.wf_map_tp.node[0]);
    }

    markNode(nid) {
        if (!nid) {
            return this.cfg.wf_map_tp.markedNode = null;
        }
        if (this.cfg.wf_map_tp.markedNode && this.cfg.wf_map_tp.markedNode.nid === nid) {
            return
        }
        const { target } = this.getFlowNode({ nid });
        if (target) {
            this.cfg.wf_map_tp.markedNode = target;
        }
    }

    getFlowNode({ nid, cb }) {
        if (!nid) return {};
        let family = {};
        (function findEle(item, parent, index) {
            cb && cb(item);
            if (item.nid === nid) return family = { target: item, parent, index };
            if (item.children && item.children.length) {
                item.children.forEach((chd, i) => findEle(chd, item, i))
            }
        })(this.startNode);
        return family;
    }

    async setInstance(instanceId = '') {
        if (instanceId) {
            await this.getInstance(instanceId);
            //如果是复制流程
            if (this.copy) {
                this.setCopyMode();
                this.instanceFlag = true;
            }
        } else {
            this.newInstance();
            this.instanceFlag = true;
        }
    }

    setForm({ formImage, formStore }) {
        this.formImage = formImage;
        this.formStore = formStore;
        this.loading = false;
    }

    setCopyMode() {
        this.copyInstanceId = this.data.instanceId;
        this.data.instanceId = "";
        this.setCurStep();
        this.data.fileCode = "";
        this.data.creator = "";
        this.data.creator_name = "";
        this.data.ctime = "";

        //状
        this.data.status = REVIEW_STATUS.save.value;
        this.data.reviews = [];
        this.data.curUsernames = '';
        this.data.messages = [];
        this.log = [];

        this.setTableLogVal(this.log);
        this.setLogsFlow(this.log);
        try {
            this.prepareMainTableVal(this.data);
        } catch (error) {
            console.log('渲染主体错误：' + error);
        }
    }

    setInstanceData(instanceData) {
        //设置基本实例参数
        const { instance, steps, file, log, nextUser, nodes, reviews } = instanceData;
        Object.keys(instance).forEach(key => (this.data.hasOwnProperty(key) && (this.data[key] = instance[key])));
        this.data.filetype = this.data.filetype || instance.fileType;
        this.data.name = this.data.name || instance.instanceName;
        this.data.status = instance.instance_status;

        //这里先这样做，最好是在获取已存在的流程时直接不返回这些值
        if (!this.shouldGetInsTwice || (this.shouldGetInsTwice && this.instanceFlag)) {
            if (reviews) {
                reviews.forEach(r => r.empties = '');
                this.data.reviews = reviews;
            }
            this.data.nextUser = nextUser;
        }
        this.instanceFlag = true;

        //根据实例状态设置当前步骤
        if (this.hasCreatorPower) {
            this.setCurStep();
        } else {
            if (steps && steps.length) {
                this.cfg.wf_map_tp.executingNodes = steps;
                this.data.curUsernames = _.map(steps, 'user_name').join(',')
            }

            const ret = this.getFlowNode({ nid: this.data.step, cb: item => item.done = true });
            if (ret && ret.target) {
                this.setCurStep(ret.target);
            }
        }

        //设置附件
        if (file && file.length) {
            this.data.attach = _.map(file, 'res_id').join(',');
        }

        //设置日志
        if (log) {
            log.forEach(l => {
                l.op_note = l.op_note || this.getLogOpText(l.op_result);
            })
            this.log = log;
            this.setTableLogVal(log);
            this.setLogsFlow(log);
        }

        //设置审核人
        if (nodes) {
            for (let nid in nodes) {
                const { target } = this.getFlowNode({ nid });
                if (target) {
                    target.opaitems = nodes[nid].map(n => ({ name: n.user_name }))
                }
            }
        }

        try {
            this.prepareMainTableVal(this.data);
        } catch (error) {
            console.log('渲染主体错误：' + error);
        }
    }

    //获取流程实例
    async getInstance(instanceId) {
        //获取实例的其他参数
        this.loading = true;
        const instanceRet = await API.workflow({ data: { instanceId, wf_code: this.cfg.wf_code }, method: "get" });
        if (!instanceRet.success) return;
        this.setInstanceData(instanceRet.data);
    }

    getLogOpText(op_result) {
        let text = '';
        switch (op_result) {
            case 'pass':
                text = '通过'
                break;
            case 'distribute':
                text = '分发'
                break;
            case 'transmit':
                text = '转交'
                break;
            case 'back':
                text = '退回'
                break;
            case 'callback':
                text = '退回'
                break;
            case 'copy':
                text = '抄送'
                break;
            case 'field':
                text = '失败'
                break;
            case 'sign':
                text = '加签'
                break;
        }
        return text;
    }

    setLogsFlow(logs) {
        //主体审核流
        const $el = $(this.executorPrintRef).find(`[field=wf_logs]`);
        if (!$el.get(0)) return;
        const $wrapper = $('<div class="pso-wf-logs"></div>');
        for (let i = 0; i < logs.length; i++) {
            const log = logs[i];
            let section = `审核人<span>${log.user_name}执行操作： </span><span>${this.getLogOpText(log.op_result)}</span>`;
            if (log.step_code === 'start') {
                section = `创建人<span>${log.user_name}执行操作： ${i === 0 ? '发起新的' : '重新提交'}</span>`;
            }
            const opNote = log.inst_note ? `（${log.inst_note}）` : ''
            const note = log.op_note ? `；发布评论：${log.op_note}` : '';
            $wrapper.append(`<div class="pso-wf-logs__item">
                    <div>${log.op_time}；在步骤<span>${log.step_name || '开始'}</span>；${section}${opNote}${note}</div>
                    </div>`);
        }
        $el.empty().append($wrapper);
    }

    setTableLogVal(data) {
        //替换主体审核日志部分
        const group = _.groupBy(data, "step_code");
        for (let key in group) {
            const $el = $(this.executorPrintRef).find(`[field=${key}]`);
            if (!$el.get(0)) continue;
            const $wrapper = $('<div class="pso-wf-logs"></div>');
            let format = $el.attr('format');
            if (format) {
                const data = group[key][group[key].length - 1];
                format = format.replace(new RegExp(`#man#`, "g"), data.user_name);
                format = format.replace(new RegExp(`#time#`, "g"), data.op_time);
                format = format.replace(new RegExp(`#content#`, "g"), data.op_note);
                $wrapper.html(format);
            } else {
                group[key].forEach(log => {
                    $wrapper.append(`<div class="pso-wf-logs__item">
                    <div>${log.op_time}；在步骤${log.step_name || '开始'}；审核人${log.user_name}  发布评论：${log.op_note}</div>
                    </div>`);
                });
            }
            $el.empty().append($wrapper);
        }
    }

    prepareMainTableVal(data) {
        for (let key in data) {
            if (typeof data[key] === "string") {
                let field = key;
                if (key === 'creator') field = 'creator_name';
                this.setTableVal({ cpnt: { data: { _fieldValue: `wf_${key}` } }, value: data[field] });
            }
        }
    }

    //设置主体部分的值
    setTableVal({ cpnt, value, proxy, fields, store }) {
        const { data } = cpnt;
        if (!data._fieldValue) return;
        const $el = $(this.executorPrintRef).find(`[field=${data._fieldValue}]`);
        if (!$el.get(0)) return;

        //人员和部门
        if (["user", "department", "tag", "select", "checkbox"].includes(cpnt.componentid)) {
            value = getDisplayOfCpnt(cpnt);
        }

        value = data.__showVal__ || filterByDecimal(cpnt.data, value);
        if (this.$vue.__xssFilter__) {
            value = this.$vue.PSODOMPurify.sanitize(value);
        }

        const _unit = data._unit || '';
        $el.html((!_.isNaN(value) && !_.isNull(value) && value !== 'null' && typeof value !== 'undefined') ? `${value} ${_unit}` : '');

        //关联表
        if (cpnt.componentid === "asstable" && proxy && fields) {
            const display = $el.attr('display');
            $el.empty();
            if (display === 'script') {
                const format = $el.attr('format');
                if (format) {
                    const fieldObj = {};
                    const $wrapper = $('<div class="pso-script"></div>');
                    try {
                        proxy.valList.forEach(d => {
                            let datasource = format;
                            for (let k in d) {
                                if (!fieldObj[k]) {
                                    const f = _.find(fields, { field_name: k });
                                    if (f) fieldObj[k] = f.fid;
                                }
                                datasource = datasource.replace(new RegExp(`@${fieldObj[k]}@`, "g"), d[k]);
                            }
                            $wrapper.append(`<div>${datasource}</div>`)
                        })
                        $el.append($wrapper)
                    } catch (error) {
                        console.log('解析主体关联表错误', error)
                    }
                }
            } else {
                const sequence = $el.attr('sequence');
                if (cpnt.data._type == 1 && display !== 'table') {
                    if (proxy.valList.length) {
                        $el.html(proxy.valList[0][cpnt.data._radioField || 'leaf_id']);
                    }
                } else {
                    if (proxy.valList.length) {
                        $el.css({ display: 'block', overflow: 'auto' });
                        $el.append(this.makeStaticTable(fields, proxy.valList, sequence === '1', store));
                        const parentTd = $('.pso-static-table').parentsUntil('td');
                        if (parentTd.get(0)) {
                            $('.pso-static-table').addClass('outer-border-none');
                            parentTd.parent().css('padding', 0);
                        }
                    }
                }
            }
        }
    }

    makeStaticTable(allFields, data, showIndex = false, store) {
        const fields = allFields.filter((f) => f.show === "1" && f.using === '1');
        const $wrapper = $(`<table class="pso-static-table"><colgroup></colgroup><thead><tr></tr></thead><tbody></tbody></table>`);
        const $colgroup = $wrapper.find('colgroup');
        const $ftr = $wrapper.find('thead>tr');
        const $tbody = $wrapper.find('tbody');
        if (showIndex) {
            $colgroup.append(`<col width="40">`);
            $ftr.append(`<th>项次</th>`);
        }
        for (let f of fields) {
            $colgroup.append(`<col width="${f.docWidth || f.width || 120}">`);
            $ftr.append(`<th>${f.display}</th>`);
        }
        for (let i = 0; i < data.length; i++) {
            const $tr = $('<tr></tr>');
            if (showIndex) {
                $tr.append(`<td>${i + 1}</td>`)
            }
            for (let f of fields) {
                let unit = '';
                if (store) {
                    const cpnt = store.searchByField(f.field_name, true);
                    if (cpnt && cpnt._unit) {
                        unit = cpnt._unit;
                    }
                }
                $tr.append(`<td>${data[i][f.field_name]}${unit}</td>`)
            }
            $tbody.append($tr);
        }
        return $wrapper;
    }

    cancelPickreject(cancel) {
        if (!cancel) this.showBody = true;
        this.appointStep = this.cfg.wf_map_tp.clickedNode = null;
    }

    clearEmptyReviewers() {
        this.data.reviews = [];
        this.data.nextUser = null;
    }

    //创建流程实例数据
    async newInstanceData({ nextStep = false, formData }) {
        let filetype;
        try {
            filetype = this.data.filetype || this.cfg.files[0].wf_filetype;
            if (!filetype) throw new Error('请选择文号');
        } catch (error) {
            throw new Error('请配置流程文号');
        }

        const data = {
            filetype,
            wf_code: this.cfg.wf_code,
            wfid: this.cfg.wf_code,
            empty_type: this.cfg.empty_type,
            name: this.data.name,
            urgent: this.data.urgent,
            import: this.data.import,
            secret: this.data.secret,
            data: formData,
            stepid: this.curStep.nid,
            d_tag: this.data.d_tag,
            attids: this.data.attach,
            nextStep,
            ...this.extend,
        };
        return await API.workflow({ data, method: "post" });
    }

    async getFormData(required = true) {
        try {
            const formData = await this.formImage.makeData(required);
            if (this.copy && formData) {
                formData.dataArr[0].leaf_id = '';
                formData.dataArr[0].optype = 0;
            }
            return formData;
        } catch (error) {
            return null;
        }
    }

    //暂存
    async hold(formData) {
        if (this.steping) {
            throw new Error('正在执行');
        }
        this.steping = true;

        if (!formData) formData = this.getFormData();
        if (!formData) return;

        formData.is_matter = 0;
        //添加扩展参数
        Object.assign(formData, this.extend);

        if (this.data.instanceId) {
            //只保存表单
            return await API.form({ data: { leaf_id: this.data.instanceId, formData }, method: "put" });
        } else {
            //生成流程并执行下一步
            return await this.newInstanceData({ nextStep: false, formData });
        }
    }

    //执行下一步
    async doNextStep({ optype, formData, isAppendForm, shouldCheckEmpty }) {
        if (this.steping) {
            throw new Error('正在执行');
        }

        this.steping = true;
        if (!optype || !this.curStep.nid) {
            throw new Error('参数错误');
        }

        const data = {
            ...this.extend,
            wf_code: this.cfg.wf_code,
            empty_type: this.cfg.empty_type,
            instanceId: this.data.instanceId,
            status: this.data.status,
            note: this.data.opinion,
            stepid: this.curStep.nid,
            attids: this.data.attach,
            att_id: this.data.attachIds,
            isAppendForm,
            shouldCheckEmpty,
            optype,
        }

        if (this.shouldChooseEmptys) {
            const reviews = [];
            for (let r of this.data.reviews) {
                if (r.empties) {
                    reviews.push(r);
                }
                if (r.is_need === '1' && !r.empties) {
                    throw new Error(`请设置${r.step_name}`);
                }
            }
            data.empties = reviews;
        } else if (this.isNextEmpty && optype === REVIEW_OP_TYPE.confirm.type) {
            if (!this.userOp.users) {
                throw new Error('请选择下一步审核人');
            }
            const { step_code, current_step } = this.doNextUser;
            data.empties = [{ empties: this.userOp.users, step_code: step_code || current_step }];
        }

        if (this.data.instanceId) {

            //指定操作
            if (optype === REVIEW_OP_TYPE.pickreject.type) {
                if (!this.appointStep || !this.appointStep.nid) {
                    this.steping = false;
                    throw new Error('请选择指定节点');
                }
                data.newstepid = this.appointStep.nid;
            }

            //用户添加操作
            if (REVIEW_OP_USER.includes(optype)) {
                if (!this.userOp.appendType || !this.userOp.users) {
                    this.steping = false;
                    throw new Error('请先选择用户');
                }

                data.appendType = this.userOp.appendType;
                data.users = this.userOp.users;
            }

            if (formData) {
                data.formData = formData;
            }

            this.shouldAddEmptyButNot = null;
            return await API.workflow({ data, method: "put" });
        } else {
            return await this.newInstanceData({ nextStep: true, formData })
        }
    }
}
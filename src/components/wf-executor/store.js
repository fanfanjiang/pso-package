import API from "../../service/api.js";
import shortid from "shortid";

const BASEDADA = {
    instanceId: '',
    fileCode: "",
    creator: "",
    ctime: "",
    step: "",
    name: '',
    urgent: '',
    import: '',
    secret: '',
    filetype: '',
    opinion: '',
    d_tag: '',
    msg_tag: '',
    creator_name: '',
    attach: {
        _fieldName: "附件",
        _val: ''
    }
}

export default class WfStore {
    constructor(options) {

        this.activeExtendTab = 'data';
        this.loading = false;
        this.steping = false;

        this.curStep = null;
        this.appointStep = null;
        this.readLevel = 0;
        this.formStore = null;
        this.copy = false;
        this.copyInstanceId = '';

        this.extend = {};

        this.userOp = {
            users: '',
            appendType: '',
            text: ''
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
            selectedFileTypes: []
        }

        this.show = {
            showImport: true,
            showSecret: true,
            showUrgent: true
        }

        this.formImage = null;
        this.showUserOp = false;
        this.showBody = true;

        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option];
            }
        }
    }

    //初始化流程配置
    async init({ cfgId, instanceId }) {

        this.loading = true;
        const ret = await API.workflowcfg({ data: { node_id: cfgId } });
        if (ret.success && ret.data) {

            //设置流程图参数
            const node = JSON.parse(ret.data.wf_map_tp);
            const startChildren = node.splice(1);
            node[0].children = startChildren;

            ret.data.wf_map_tp = {
                wfName: ret.data.wf_name,
                formName: "",
                selectedNode: { nid: '' }, //当前执行人所在的流程节点
                clickedNode: { nid: '' }, //流程图操作中选择的节点
                executingNodes: [], //流程正在执行中的节点集合,仅仅为了展示
                node
            }

            this.cfg = ret.data;
        }
        this.setInstance(instanceId);
    }

    get startNode() {
        return this.cfg.wf_map_tp.node[0];
    }

    // 新建流程实例
    newInstance() {
        //设置当前执行节点为开始节点
        this.setCurStep();
        this.data = _.cloneDeep(BASEDADA);
        this.userOp = {
            users: '',
            appendType: '',
            text: ''
        }
    }

    setCurStep(node) {
        this.cfg.wf_map_tp.selectedNode = this.curStep = node || this.cfg.wf_map_tp.node[0];
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

    setInstance(instanceId = '') {
        if (instanceId) {
            this.getInstance(instanceId);

            //如果是复制流程
            if (this.copy) {
                this.setCopyMode();
            }

        } else {
            this.newInstance();
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
        this.log = [];
    }

    //获取流程实例
    async getInstance(instanceId) {
        //获取实例的其他参数
        this.loading = true;

        const instanceRet = await API.workflow({ data: { instanceId }, method: "get" });
        if (!instanceRet.success) return;

        this.data.instanceId = instanceId;

        //设置基本实例参数
        const { instance, steps, file, log } = instanceRet.data;
        Object.keys(instance).forEach(key => (this.data.hasOwnProperty(key) && (this.data[key] = instance[key])))
        this.data.filetype = this.data.filetype || instance.fileType;
        this.data.name = this.data.name || instance.instanceName;

        //根据实例状态设置当前步骤
        if (instance.instance_status === 0 || instance.instance_status === 2) {
            this.setCurStep();
        } else {
            if (steps && steps.length) {
                this.cfg.wf_map_tp.executingNodes = steps;
            }

            const ret = this.getFlowNode({ nid: state.data.step, cb: tiem => tiem.done = true })
            if (ret && ret.target) {
                this.setCurStep(ret.target);
            }
        }

        //设置附件
        if (file.length) {
            this.data.attach._val = _.map(file, 'res_id').join(',');
        }

        //设置日志
        if (log) {
            this.log = log;
            setTableLogVal(log);
        }
    }

    setTableLogVal(data) {
        //替换主体审核日志部分
        const groupData = _.groupBy(data, "step_code");
        for (let key in groupData) {
            const logWrapper = $('<div class="pso-wf-logs"></div>');

            groupData[key].forEach(item => {
                logWrapper.append(`<div class="pso-wf-logs__item">
                                          <div>步骤：${item.step_name}</div>
                                          <div>审核人：${item.op_user}</div>
                                          <div>审核时间：${item.op_time}</div>
                                          <div>审核结果：${item.op_result}</div>
                                          <div>审核意见：${item.op_note}</div>
                                       </div>`);
            });

            $("#executorMain").find(`[field=${key}]`).empty().append(logWrapper);
        }
    }

    prepareMainTableVal() {
        for (let key in data) {
            if (typeof data[key] === "string") {
                this.setTableVal({ cpnt: { data: { _fieldValue: `wf_${key}` } }, value: data[key] });
            }
        }
    }

    //设置主体部分的值
    setTableVal({ cpnt, value, proxy }) {
        const { data } = cpnt;
        if (!data._fieldValue) return;

        //人员和部门
        if (cpnt.componentid === "user" || cpnt.componentid === "department") {
            const name = cpnt.componentid === "user" ? "user_name" : "node_name";
            if (proxy && proxy.list.length) {
                value = _.map(proxy.list, name).join(",");
            } else {
                value = "";
            }
        }

        $("#executorMain").find(`[field=${data._fieldValue}]`).html(value);
    }

    cancelPickreject(cancel) {
        if (!cancel) this.showBody = true;
        this.appointStep = this.cfg.wf_map_tp.clickedNode = null;
    }

    //创建流程实例数据
    async newInstanceData({ nextStep = false, formData }) {
        if (!this.data.filetype) throw new Error('请选择文号');
        if (this.show.showUrgent && !this.data.urgent) throw new Error('请选择紧急程度');
        if (this.show.showImport && !this.data.import) throw new Error('请选择重要等级');
        if (this.show.showSecret && !this.data.secret) throw new Error('请选择秘密等级');
        const data = {
            filetype: this.data.filetype,
            wf_code: this.cfg.wf_code,
            wfid: this.cfg.wf_code,
            name: this.data.name,
            urgent: this.data.urgent,
            import: this.data.import,
            secret: this.data.secret,
            data: formData,
            stepid: this.curStep.nid,
            d_tag: this.data.d_tag,
            attids: this.data.attach._val,
            nextStep,
            ...this.extend,
        };
        return await API.workflow({ data, method: "post" });
    }

    async getFormData() {
        try {
            const formData = await this.formImage.makeData();
            if (this.copy && formData) {
                formData.dataArr[0].leaf_id = shortid.generate();
            }
            return formData;
        } catch (error) {
            return null;
        }
    }

    //暂存
    async hold(formData) {
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
    async doNextStep({ optype, formData }) {
        if (this.steping) {
            throw new Error('正在执行');
        }

        this.steping = true;
        if (!optype || !this.curStep.nid) {
            throw new Error('参数错误');
        }

        if (!formData) formData = this.getFormData();
        if (!formData) return;

        const data = {
            ...this.extend,
            wf_code: this.cfg.wf_code,
            instanceId: this.data.instanceId,
            note: this.data.opinion,
            stepid: this.curStep.nid,
            optype
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
            if (optype === REVIEW_OP_APPEND) {
                if (!this.userOp.appendType || !this.userOp.users) {
                    this.steping = false;
                    throw new Error('请先选择用户');
                }

                data.appendType = this.userOp.appendType;
                data.users = this.userOp.users;
            }

            //下一步时有修改表单的需求
            if (this.curStep.update && this.curStep.update.length) {
                const updates = this.curStep.update;
                const upData = formData.dataArr[0];

                for (let update of updates) {
                    if (!update.fid) continue;
                    const cpnt = this.formStore.search({ options: { fid: update.fid } });
                    if (cpnt && cpnt.fid) {

                        if (update.type === 1) {
                            upData[cpnt.data._fieldValue] = update.value;
                        } else {
                            const targetCpnt = this.formStore.search({ options: { fid: update.value } });
                            if (targetCpnt && targetCpnt.fid) {
                                upData[cpnt.data._fieldValue] = upData[targetCpnt.data._fieldValue];
                            }
                        }
                    }
                }
            }
            data.formData = formData;
            return await API.workflow({ data, method: "put" });
        } else {
            this.newInstanceData({ nextStep: true, formData })
        }
    }
}
import API from '../../service/api'
import { MENU_LEAF_AUTH } from "../../const/menu";
import FormStore from "../form-designer/model/store.js";
import shortid from "shortid";
import debounce from "throttle-debounce/debounce";
import CPNT from "../../../share/const/form";
import Vue from "vue";
import XLSX from "xlsx";
import { desensitize } from "../../utils/util";
import Qs from 'qs';

export default class FormViewStore {

    constructor(options) {

        //表单配置
        this.$vue = null;

        //数据状态
        this.initializing = true;
        this.starting = false;
        this.fetching = false;
        this.operating = false;

        this.showExecutor = false;
        this.showFilter = false;
        this.showKeywords = false;

        //配置参数
        this.store = null;
        this.formCfg = null;
        this.instances = [];
        this.curInstance = null;//当前实例
        this.dataId = '';
        this.summary = null;
        this.instance = null;//并不是当前实例，是专门用于表单复制功能

        //过滤器
        this.conditionOptions = [];
        this.condition = "";
        this.lastCondition = undefined;

        //列表参数
        this.limit = 20;
        this.page = 1;
        this.defaultKeys = {};
        this.keys = {};
        this.keywords = "";
        this.dataTotal = 0;

        //其它参数
        this.sorts = [];
        this.curStatus = undefined;
        this.activeView = '';
        this.opAuth = '';
        this.curStage = undefined;
        this.defSearchType = '';
        this.viewCfg = [];
        this.defCondition = [];
        this.downloadFiles = [];
        this.fields = [];
        this.clickedRow = null;
        this.selectedList = [];
        this.statuses = [];
        this.stages = [];
        this.uploadAttach = { data: {} };
        this.statusesObj = {};
        this.stagesObj = {};
        this.tableHeight = 0; //table高度
        this.attachments = {};
        this.defComplexity = '';

        //权限视图
        this.authViews = [];
        this.activeView = 0;
        this.where = {};

        //页面的文字
        this.cpntText = {
            add: "新增",
            change: "更改",
            copy: "复制",
            stage: "更改阶段",
        };

        //动作
        this.addAction = null;
        this.actions = [];
        this.usedActionIds = [];
        this.actioning = null;
        this.fieldsRule = [];
        this.switchable = true;
        this.autoSubmit = true;
        this.keepable = true;
        this.actionEditable = false; //在执行动作的时候强制表单可编辑

        //列表原始配置
        this.usedFormCol = '';
        this.oriColData = null;

        //加载后立即打开的实例
        this.insttogo = '';

        //操作控制
        this.autoChange = true; //是否自动修改数据状态

        //清除数据
        this.wipeallable = false;
        this.wipeProxy = {
            visible: false,
            check: '',
            tip: '',
            doing: false
        };

        this.fetchMode = '1';//加载模式 1为分页加载，2为滚动加载

        for (let op in options) {
            if (options.hasOwnProperty(op) && typeof options[op] !== 'undefined') {
                this[op] = options[op];
            }
        }

        this.fetchFinished = this.fetchMode === '1';

        this.deFetch = debounce(300, (params) => {
            this.fetch(params);
        });

        this.deFixLayout = debounce(1000, (params) => {
            this.fixLayout(params);
        });
    }

    get __FIELDID__() {
        return 'field_name';
    }

    get __FIELDNAME__() {
        return 'display';
    }

    get opAddable() {
        return (this.opAuth & 1) === 1;
    }

    get opChangable() {
        return this.statuses.length && (this.opAuth & 2) === 2;
    }

    get opStageable() {
        return this.stages.length && (this.opAuth & 8) === 8;
    }

    get opExportable() {
        return (this.opAuth & 4) === 4;
    }

    get operableSotrs() {
        return this.sorts.filter(s => s.operable);
    }

    get instanceEditable() {
        return this.opAddable && (this.dataId ? (this.getEditableByStatus(this.curInstance) || this.actionEditable) : true);
    }

    getStatusEntity(d_status) {
        return this.statusesObj[d_status + ''] || {};
    }

    getStageEntity(d_stage) {
        return this.stagesObj[d_stage + ''] || {};
    }

    getEditableByStatus(instance) {
        const { d_stage, d_status } = instance;
        return !this.getStatusEntity(d_status).uneditable && !this.getStageEntity(d_stage).uneditable;
    }

    //初始化
    async initialize(id, usedColumn) {
        this.initializing = true;

        const ret = await API.formsCfg({ data: { id, auth: 1 }, method: "get" });
        if (!ret.success) return this.$vue.ResultNotify(ret);

        this.analyzeFormCfg(ret.data, usedColumn);

        this.initializing = false;
    }

    async fetchStatus() {
        this.starting = true;
        const params = {
            leaf_auth: this.activeView, data_code: this.formCfg.data_code,
            keys: JSON.stringify({ ...this.defaultKeys }), dict_type: this.usedFormCol,
        };

        this.appendSearchType(params);
        console.log(params);

        const ret = await API.getFormStatus(params);

        //状态设置
        if (ret.success && ret.data) {
            this.statuses.forEach((s) => {
                const exist = _.find(ret.data, { value: s.value + "" });
                if (exist) {
                    Vue.set(s, 'total', exist.total);
                }
            });
            await this.fetchCuzFastSwtich('curStatus', 'd_status');
        }
        this.starting = false;
    }

    async changeStatus(data) {
        await this.makeChange({ data, api: 'updateFormStatus', type: 'status', field: 'd_status', extend: { data_code: this.formCfg.data_code } });
    }

    async changeStage(data) {
        await this.makeChange({ data, api: 'updateFormStage', type: 'stage', field: 'd_stage', extend: { data_code: this.formCfg.data_code } });
    }

    async makeChange({ data, api, type, field, extend = {}, ids = 'leafids' }) {
        if (!this.selectedList.length) return this.$vue.$message("请先选择数据");

        const { value } = data;

        const handler = async () => {
            const ret = await API[api]({
                ...extend,
                [field]: value,
                [ids]: _.map(this.selectedList, 'leaf_id').join(','),
                data: { dataArr: this.selectedList }
            });

            this.$vue.ResultNotify(ret);
            this.$vue.$emit(`${type}-changed`);

            this.fetchStatus();
        };

        this.$vue.$emit(`${type}-change`, { handler, data: this.selectedList, value });

        if (this.autoChange) {
            await handler();
        }
    }

    //复制数据
    copyInstance() {
        if (this.selectedList.length !== 1) {
            return this.$vue.$message("请先选择一条要复制的数据");
        }
        this.dataId = "";
        this.instance = { ...this.selectedList[0], leaf_id: "" };

        for (let k in this.instance) {
            const cpnt = this.store.searchByField(k);
            if (cpnt && cpnt.componentid === 'asstable' && cpnt.data._new) {
                this.instance[k] = '';
            }
        }
        this.showExecutor = true;
    }

    removeInstance(leaf_id) {
        const dataIndex = _.findIndex(this.instances, { leaf_id });
        if (dataIndex !== -1) {
            this.instances.splice(dataIndex, 1)
        }
        if (this.curInstance && leaf_id === this.curInstance.leaf_id) {
            this.curInstance = null;
        }
    }

    showInstance(row) {
        this.curInstance = row;
        this.dataId = row.leaf_id;
        this.instance = null;
        this.showExecutor = true;
        this.setActionEmpty();
    }

    setActionEmpty() {
        this.fieldsRule = [];
        this.actioning = null;
        this.switchable = true;
        this.autoSubmit = true;
        this.keepable = true;
        this.actionEditable = false;
    }

    showPrev(id) {
        const leaf_id = id || this.dataId;
        if (leaf_id) {
            const index = _.findIndex(this.instances, { leaf_id });
            if (index > 0) {
                this.showInstance(this.instances[index - 1])
            }
        }
    }

    showNext(id) {
        const leaf_id = id || this.dataId;
        if (leaf_id) {
            const index = _.findIndex(this.instances, { leaf_id });
            if (index !== -1 && index < this.instances.length - 1) {
                this.showInstance(this.instances[index + 1]);
            }
        }
    }

    getField(field_name) {
        return _.find(this.fields, { field_name });
    }

    async newInstance(checkScript) {
        if (this.addAction && this.addAction.beforeScriptable && checkScript) {
            const ret = await API.doActionScript({ btn_id: 'add', btn_type: '0', data_code: this.store.data_code, data: [] });
            if (!ret.success) {
                return;
            }
        }

        this.dataId = "";
        this.instance = null;
        this.curInstance = null;
        this.showExecutor = true;
        this.setActionEmpty();
    }

    async fetchCuzFastSwtich(source, key, data, vField = 'value') {
        this[source] = data;
        if (this[source]) {
            this.$vue.$set(this.keys, key, { value: this[source][vField], type: 1 });
        } else {
            this.$vue.$delete(this.keys, key);
            delete this.keys[key];
        }
        this.page = 1;
        await this.fetch();
    }

    get instanceids() {
        return this.instances.map(d => d.leaf_id);
    }

    setClickRow(row) {
        this.clickedRow = row;
    }

    getFetchParams() {
        const order = this.sorts.map((item) => `${item.prop} ${item.order}`).join(",");

        const params = {
            limit: this.limit,
            page: this.page - 1,
            leaf_auth: this.insttogo ? '4' : this.activeView,
            orderby: order ? `order by ${order}` : "",
            keys: { ...this.keys, ...this.defaultKeys },
            dict_type: this.usedFormCol,
        };

        this.lastCondition = this.condition;
        if (this.condition && this.condition !== "【】") {
            params.condition = this.condition;
        }

        if (this.defComplexity) {
            params.where = this.defComplexity;
        }

        if (this.keywords !== "" && !params.keys.d_name) {
            params.keys.d_name = { value: this.keywords, type: 2 };
        }

        if (this.insttogo) {
            params.keys.leaf_id = { value: this.insttogo, type: 1 };
        }

        console.log(params.keys);

        params.keys = JSON.stringify(params.keys);

        this.appendSearchType(params);

        return params;
    }

    async refetch() {
        this.page = 1;
        this.deFetch();
    }

    async fetch() {
        this.fetching = true;

        const data = this.getFetchParams();
        data.data_code = this.formCfg.data_code;

        const ret = await API.form({ data, method: "get" });

        if (this.dataPovider) {
            await this.dataPovider(ret.data);
        }

        if (ret.success) {
            if (this.fetchMode === '1') {
                this.instances = ret.data;
            } else {
                this.instances = this.instances.concat(ret.data);
                if (!ret.data.length) {
                    this.fetchFinished = true;
                }
            }
            this.dataTotal = ret.total;
            this.summary = ret.sum || null;

            this.checkInstToGO();
        }

        this.$vue.$emit("data-loaded", this.instances);


        this.fetching = false;
        this.attachments = {};

        this.fixLayout();
    }

    checkInstToGO() {
        if (this.insttogo) {
            if (this.instances.length && this.insttogo === this.instances[0].leaf_id) {
                this.showInstance(this.instances[0]);
            } else {
                this.$vue.$message.warning("未找到数据");
            }
        }
        this.insttogo = '';
    }

    fixLayout() {
        if (this.$table) {
            Vue.nextTick(() => { this.$table.doLayout() });
        }
    }

    appendSearchType(data) {
        if (this.defSearchType) {
            const viewTarget = _.find(this.authViews, { v: parseInt(this.activeView) });
            if (viewTarget && viewTarget.field) {
                data.search_type = this.defSearchType;
                data.field_name = viewTarget.field;
            }
        }
    }

    makeDefkeys({ where, defKeys, defForm, defComplexity }) {
        //外部传入的请求参数
        try {
            if (where) {
                for (let key in where) {
                    this.defaultKeys[key] = { value: this.where[key], type: 1 };
                }
            }

            if (defComplexity) {
                this.defComplexity = defComplexity;
            }

            if (defKeys) {
                let keyList = defKeys.split(";");
                keyList.forEach((item) => {
                    const key = item.split("#");
                    let value = key[1];
                    if (value === '$user_id') {
                        value = this.$vue.$store.state.base.user.user_id;
                    }
                    this.defaultKeys[key[0]] = { value, type: key[2] };
                });
            }

            //默认参数
            if (defForm) {
                for (let key in defForm) {
                    //20201205 为了查leaf_id
                    let type = 1;
                    if (defForm[key] && typeof defForm[key] === 'string') {
                        if (defForm[key].split(',').length > 1) {
                            type = 4;
                        }
                    }
                    //20201205 为了查leaf_id
                    this.defaultKeys[key] = { value: defForm[key], type };
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    analyzeAuthView(curAuth, cfg) {
        MENU_LEAF_AUTH.forEach((a) => {
            if ((a.v & curAuth) === a.v) {
                const viewCfg = _.find(cfg, { v: a.v });
                const viewItem = { ...a };
                if (viewCfg) {
                    if (viewCfg.text) viewItem.n = viewCfg.text;
                    viewItem.field = viewCfg.field;
                }
                this.authViews.push(viewItem);
            }
        });
        this.authViews = _.orderBy(this.authViews, ["v"], ["desc"]);
        this.activeView = this.authViews[0].v + "";
    }

    analyzeFormCfg(data, usedColumn) {
        this.formCfg = data;

        const { opAuth, display_columns, stage_config, status_config, data_button } = this.formCfg;

        this.store = new FormStore({ ...data, designMode: false, withSys: true });

        if (opAuth) {
            this.opAuth = opAuth.leaf_auth;
        }

        if (stage_config) {
            this.stages = JSON.parse(stage_config);
            this.stages.forEach(s => {
                this.stagesObj[s.value + ''] = s;
            })
        }

        if (status_config) {
            this.statuses = JSON.parse(status_config);
            this.statuses.forEach(s => {
                this.statusesObj[s.value + ''] = s;
            })
        }

        //首先确定列表
        if (display_columns) {
            this.analyzeColumn(display_columns, usedColumn);
        }

        if (data_button && this.usedActionIds && this.usedActionIds.length) {
            const actions = JSON.parse(data_button);
            const index = _.findIndex(actions, { id: 'add' });
            if (index !== -1) {
                this.addAction = actions[index];
                actions.splice(index, 1);
            }
            this.actions = actions.filter(act => {
                this.$vue.$set(act, 'doing', false);
                return this.usedActionIds.indexOf(act.id) !== -1;
            })
        }

        const fields = this.store.search({
            options: { db: true }, onlyMain: true, onlyData: true,
            beforePush: (item) => {
                item.data.displayName = `[${item.CPNT.name}]${item.data._fieldName}`;
                Vue.set(item.data, "display", item.data._fieldName);
                Vue.set(item.data, "field_name", item.data._fieldValue);
                Vue.set(item.data, "show", "1");
                return true;
            },
        });

        this.conditionOptions = _.cloneDeep(fields);

        if (this.fields.length) {

            //刷选条件配置
            const conditions = [];

            //默认排序配置
            const defSorts = [];

            this.fields.forEach((f) => {

                const exist = _.find(fields, { field_name: f.field_name.replace("_x", "") });
                if (exist) {
                    Object.assign(f, exist, { display: f.display, field_name: f.field_name, show: f.show });
                    if (f.searchable && CPNT[exist.componentid].op) {
                        conditions.push({ cpnt: exist, field: exist.fid, op: "", data: "", match: "" });
                    }
                } else {
                    f.fid = f.fid || f.field_name;
                }

                if (f.defSort) {
                    defSorts.push(f)
                }
            });
            if (conditions.length) {
                this.defCondition.push(conditions);
            }

            if (defSorts.length) {
                _.orderBy(defSorts, ["defSortOrder"], ["asc"]).forEach(f => {
                    this.makeSort({ prop: f.field_name, order: f.defSort, display: f.display, operable: f.sortable === '1', fetch: false });
                })
            }
        } else {
            this.fields = fields;
        }
        this.fields = _.orderBy(this.fields, ["show", "number"], ["asc", "asc"]);
    }

    analyzeColumn(cfg, defKey) {
        this.oriColData = this.getFormColumn(cfg, defKey);
        if (this.oriColData) {
            this.fields = _.cloneDeep(this.oriColData);
        } else {
            this.fields = [];
        }
    }

    getFormColumn(cfg, defKey) {
        if (typeof cfg === 'string') {
            cfg = JSON.parse(cfg);
        }
        if (Array.isArray(cfg)) {
            return this.$vue.$message.error("表单列表配置错误，请重新配置列表参数")
        }
        if (cfg.column && cfg.column.length) {
            if (defKey) {
                const exist = _.find(cfg.column, { name: defKey });
                if (exist) {
                    this.usedFormCol = defKey;
                    this.usedActionIds = exist.actions;
                    return exist.data;
                }
            }

            this.usedFormCol = cfg.column[0].name;
            this.usedActionIds = cfg.column[0].actions;
            return cfg.column[0].data;
        } else {
            return null
        }
    }

    async analyzeViewText(id, code) {
        if (!id || !code) return;
        const tpRet = await API.getTreeNode({ code });
        if (tpRet.success) {
            const tpCfg = tpRet.data.data;
            if (tpCfg.tp_text) {
                const selectedText = _.find(JSON.parse(tpCfg.tp_text), { id });
                if (selectedText) {
                    selectedText.list.forEach((item) => {
                        this.cpntText[item.id] = item.value || item.name;
                    });
                }
            }
        }
    }

    downloadFormTp() {
        let uploadCfg = this.formCfg.export_config;
        if (uploadCfg) {
            if (typeof uploadCfg === 'string') {
                uploadCfg = JSON.parse(uploadCfg)
            }
            const cfg = uploadCfg.filter(f => f.enable);
            const data = {};
            cfg.forEach(c => {
                data[c.field] = c.name;
            })
            const sheet = XLSX.utils.json_to_sheet([data], { header: _.map(cfg, 'field'), skipHeader: true });
            const book = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(book, sheet, '模板');
            XLSX.writeFile(book, '模板.xlsx');
        }
    }

    exportCurPage(title) {
        if (this.$tableWrapper) {
            const et = XLSX.utils.table_to_book($(this.$tableWrapper)[0]);
            XLSX.writeFile(et, `${title ? title : this.formCfg.data_name}.xlsx`);
        }
    }

    async saveColumn() {
        const { display_columns, data_code } = this.formCfg;

        if (display_columns && this.usedFormCol && this.oriColData) {
            const config = JSON.parse(display_columns);
            const index = _.findIndex(config.column, { name: this.usedFormCol });

            config.column.splice(index, 1, { data: this.oriColData, actions: this.usedActionIds, name: this.usedFormCol })
            const ret = await API.updateFormTree({ data_code, display_columns: JSON.stringify(config) });
            this.$vue.ResultNotify(ret);
        }
    }

    getColumnByName(name, withIndex = false) {
        const { display_columns } = this.formCfg;
        const config = JSON.parse(display_columns);
        const index = _.findIndex(config.column, { name });
        const column = index !== -1 ? config.column[index].data : null;
        return withIndex ? { column, index } : column;
    }

    analyzeRowClass() {

    }

    getFieldStyleCfg(value, styleObj, filters) {
        const style = this[styleObj][value + ''];
        if (style && style.display && style.color) {
            if (filters) {
                if (filters.includes(style.display)) {
                    return style;
                }
            } else {
                return style;
            }
        }
    }

    getStyle(data) {
        if (data) {
            const { color, display } = data;
            if (display === '1' || display === '2') {
                return { color }
            } else {
                return { 'background-color': color }
            }
        }
        return {};
    }

    analyzeRowStyle({ row, rowIndex }) {
        const statusStyle = this.getStyle(this.getFieldStyleCfg(row.d_status, 'statusesObj', ['2', '3']));
        const stageStyle = this.getStyle(this.getFieldStyleCfg(row.d_stage, 'stagesObj', ['2', '3']));
        let clickStyle = {};
        if (this.clickedRow && this.clickedRow.leaf_id === row.leaf_id) {
            clickStyle = { 'background-color': '#DCF1FF' };
        }
        return { ...stageStyle, ...statusStyle, ...clickStyle }
    }

    analyzeCellStyle({ row, column, rowIndex, columnIndex }) {
        if (column.property && column.property.replace('_x', '') === 'd_status') {
            return this.getStyle(this.getFieldStyleCfg(row.d_status, 'statusesObj', ['1']));
        }
        if (column.property && column.property.replace('_x', '') === 'd_stage') {
            return this.getStyle(this.getFieldStyleCfg(row.d_stage, 'stagesObj', ['1']));
        }
    }

    getSummary({ columns }) {
        const indexs = new Array(columns.length).fill("");
        if (this.summary) {
            for (let key in this.summary) {
                const index = _.findIndex(columns, { property: key });
                if (index !== -1) {
                    // indexs[index] = parseFloat(this.summary[key]).toFixed(2);
                    indexs[index] = this.summary[key];
                }
            }
        }
        return indexs;
    }

    removeSort(index) {
        this.sorts.splice(index, 1);
        this.deFetch();
    }

    makeSort({ column, prop, order, display, operable = true, fetch = true }) {
        if (order === "descending" || order === "desc") {
            order = "desc";
        } else if (order === "ascending" || order === "asc") {
            order = "asc";
        }
        const sortIndex = _.findIndex(this.sorts, { prop });
        if (!order && sortIndex === -1) {
            return;
        }
        if (!order && sortIndex !== -1) {
            return this.removeSort(sortIndex);
        }
        if (sortIndex !== -1) {
            this.sorts[sortIndex].order = order;
        } else {
            this.sorts.push({ prop, order, name: display || _.find(this.fields, { [this.__FIELDID__]: prop })[this.__FIELDNAME__], operable });
        }

        if (fetch) {
            this.deFetch();
        }
    }

    dragHandler(newWidth, oldWidth, column, event, tfield = 'field_name') {
        if (this.oriColData) {
            const exist = _.find(this.oriColData, { [tfield]: column.property });
            if (exist) {
                exist.width = parseInt(newWidth);
            }
        }
    }

    checkFlag(field, data) {
        return data[`${field}_s`] || (/\S+_s$/.test(field) && data[field]);
    }

    checkFile(fid) {
        const field = this.store.searchByField(fid);
        if (field && field.CPNT.componentid === 'attachment') return true
    }

    formatListVal(d, f) {
        let _val = d[f.field_name];
        if ((f.componentid === "select" || f.componentid === "checkbox") && f._option) {
            const opt = _.find(f._option, { _optionValue: _val });
            if (opt) {
                return opt._optionName;
            }
        }

        //旗帜标签
        const flagColor = this.checkFlag(f.field_name, d);
        if (flagColor) {
            return this.getColorTagEl(flagColor);
        }

        try {
            if (_val && f.clearZero) {
                _val = _val.replace(/(?:\.0*|(\.\d+?)0+)$/, '$1');
            }
            if (_val && f._encry === '1') {
                _val = desensitize(_val);

            }
        } catch (error) {

        }
        return this.filterBadVal(_val) + (f._unit ? f._unit : '');
    }

    getColorTagEl(flagColor) {
        return flagColor.split(',').map(color => {
            return `<span class="tag-flag-box" style="background-color: ${color};"></span>`
        }).join('');
    }

    filterBadVal(val) {
        return (_.isNull(val) || val === 'null' || val === 'undefined' || typeof val === 'undefined') ? "" : val;
    }

    changeSelectedList(data) {
        this.selectedList = data;
        this.analyzeAvaiableChange(this.statuses, 'd_status');
        this.analyzeAvaiableChange(this.stages, 'd_stage');
    }

    analyzeAvaiableChange(entity, field) {
        const checked = Object.keys(_.groupBy(this.selectedList, field)).map(d => parseInt(d));
        entity.forEach(obj => {
            let available = true;
            for (let item of checked) {
                const source = _.find(entity, { value: item });
                if (item === obj.value) {
                    available = false;
                    break;
                }
                if (source.target && source.target.indexOf(parseInt(obj.value)) === -1) {
                    available = false;
                    break;
                }
            }
            Vue.set(obj, 'available', available)
        })
    }

    async checkDataChange({ op, formData }) {
        if (this.actioning) {
            if (op === 2 || op === 1) {
                let data = formData.dataArr;
                if (this.actioning.batchable === '2') {
                    delete data[0]['optype'];
                    this.fieldsRule.forEach(f => {
                        if ((2 & f.value) !== 2) {
                            delete data[0][f.id];
                        }
                    });
                    await this.batchAddOrUpdate(data[0], _.map(this.selectedList, 'leaf_id'), false);
                    data = this.selectedList.map((d) => ({ ...d, ...data[0], leaf_id: d.leaf_id }));

                }
                const scriptRet = await this.checkActionScript(this.actioning, data);
                this.checkActionLink(this.actioning, this.selectedList);
                this.setActionEmpty();
                this.showExecutor = false;
            }
        }
    }

    checkActionalbe(action) {
        const { method, batchable, rule } = action;
        const data = this.selectedList;
        if (method !== '3') {
            if (batchable === '1' && data.length !== 1) {
                return false;
            }
            if (batchable === '2' && !data.length) {
                return false;
            }
        }
        if (method === '2' && rule.length) {
            return this.checkActionalbeByRule(action);
        }
        return true;
    }

    checkActionalbeByRule(action) {
        const { rule, ruleType } = action;

        for (let data of this.selectedList) {
            const result = [];
            for (let r of rule) {
                const cpnt = this.store.search({ options: { fid: r.field } });
                let condition = false;
                if (cpnt) {
                    let tv = r.data;
                    let sv = data[cpnt.data._fieldValue];
                    if (r.type === '2') {
                        tv = data[r.data];
                    }

                    try {
                        if (['op1', 'op2', 'op3', 'op4', 'op5', 'op6'].includes(r.op)) {
                            if (cpnt.CPNT.figure || ['d_status', 'd_audit', 'd_stage'].includes(cpnt.data._fieldValue)) {
                                sv = parseFloat(sv)
                                tv = parseFloat(tv)
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }

                    if (r.op === 'op1') {
                        condition = sv == tv;
                    } else if (r.op === 'op2') {
                        condition = sv != tv;
                    } else if (r.op === 'op3') {
                        condition = sv > tv;
                    } else if (r.op === 'op4') {
                        condition = sv >= tv;
                    } else if (r.op === 'op5') {
                        condition = sv < tv;
                    } else if (r.op === 'op6') {
                        condition = sv <= tv;
                    } else if (r.op === 'op7') {
                        if (sv && tv && typeof tv === 'string') {
                            const tList = tv.split(',');
                            sv = sv + '';
                            let tempRet = true;
                            for (let v in sv.split(',')) {
                                if (tList.indexOf(v) == -1) {
                                    tempRet = false;
                                    break;
                                }
                            }
                            condition = tempRet;
                        }
                    } else if (r.op === 'op8') {
                        condition = true;
                        if (tv && typeof tv === 'string') {
                            const tList = tv.split(',');
                            sv = sv + '';
                            let tempRet = true;
                            for (let v in sv.split(',')) {
                                if (tList.indexOf(v) == -1) {
                                    tempRet = false;
                                    break;
                                }
                            }
                            condition = tempRet;
                        }
                    } else if (r.op === 'op9') {
                        if (sv && tv && typeof sv === 'string' && typeof tv === 'string') {
                            condition = sv.search(tv) !== -1;
                        }
                    } else if (r.op === 'op90') {
                        condition = (sv === '' || _.isNull(sv));
                    } else if (r.op === 'op91') {
                        condition = !(sv === '' || _.isNull(sv));
                    }
                }
                result.push(condition)
            }
            console.log(result, ruleType);
            if (!result[ruleType === '1' ? 'every' : "some"](i => i)) {
                return false;
            };
        }
        return true;
    }

    async checkActionScript(action, data) {
        const { scriptable } = action;
        if (!scriptable) return true;
        const ret = await API.doActionScript({ btn_id: action.id, btn_type: '1', data_code: this.store.data_code, data });
        this.$vue.ResultNotify(ret);
        this.$vue.$emit('actioned', ret)
    }

    checkActionLink(action, data) {
        const { linkable, openLink, bindPlugin, linkParams } = action;
        if (linkable && openLink) {
            let link = openLink;
            if (bindPlugin) {
                link = link.replace(':plug_code', bindPlugin);
            }
            if (linkParams && linkParams.length) {
                for (let d of data) {
                    let itemLink = link;
                    const params = {};
                    for (let field of linkParams) {
                        itemLink = itemLink.replace(`:${field}`, d[field]);
                        params[field] = d[field];
                    }
                    window.open(`${itemLink}?${Qs.stringify(params)}`);
                }
            } else {
                window.open(link);
            }
        }
    }

    async checkAction(action) {
        const { mode, method, fields = {}, beforeScriptable, batchable } = action;
        const data = this.selectedList;
        action.doing = true;
        this.setActionEmpty();

        //查看是否满足使用条件
        if (!this.checkActionalbeByRule(action)) {
            return this.$vue.$message({ message: '不满足执行条件', type: 'warning' });
        }

        //查看脚本
        if (beforeScriptable) {
            const ret = await API.doActionScript({ btn_id: action.id, btn_type: '0', data_code: this.store.data_code, data });
            if (ret.success) {
                return this.$vue.$message({ message: ret.message || '不能执行', type: 'warning' });
            }
        }

        if (mode === '3' && method !== '3') {
            if (batchable === '1') {
                this.showInstance(data[0]);
                this.actionEditable = true;
            } else {
                this.newInstance();
                this.autoSubmit = false;
                this.keepable = false;
            }
            this.store._forEach(cpnt => {
                if (cpnt.data._fieldValue) {
                    this.fieldsRule.push({ id: cpnt.data._fieldValue, value: fields[cpnt.data._fieldValue] || 0.1 });
                }
            });
            this.actioning = action;
            this.switchable = false;
        } else {
            const scriptRet = await this.checkActionScript(action, data);
            this.checkActionLink(action, data);
            await this.fetchStatus();
        }
        action.doing = false;
    }

    async addOrUpdate({ leaf_id = "", formData }, refresh = true, emit = true) {
        if (formData) {
            const dataId = leaf_id || shortid.generate();
            const ret = await API.form({ data: { leaf_id: dataId, formData }, method: "put" });
            this.$vue.ResultNotify(ret);
            if (ret.success) {
                if (emit) {
                    this.$vue.$emit("data-changed", { leaf_id: leaf_id || ret.data.data, formData, op: leaf_id ? 2 : 1 });
                }
                if (refresh) {
                    this.fetchStatus();
                }
            }
        }
    }

    async batchAddOrUpdate(data, idList, refresh = true) {
        const list = idList || this.selectedList.map(d => d.leaf_id);
        if (!list.length) return;
        const { data_name, node_id, data_code } = this.store;
        for (let leaf_id of list) {
            await this.addOrUpdate({ leaf_id, formData: { data_name, node_id, data_code, dataArr: [{ leaf_id, optype: 1, ...data }] } }, false);
        }
        if (refresh) {
            this.fetchStatus();
        }
    }

    async showWiper() {
        if (!this.selectedList.length && !this.wipeallable) return this.$vue.$message({ message: '请选择要删除的数据', type: 'warning' });
        this.wipeProxy.tip = this.selectedList.length ? "所选" : '全部'
        this.wipeProxy.check = '';
        this.wipeProxy.visible = true;
    }

    async wipe(idList, refresh = true) {
        if (this.wipeProxy.doing || this.wipeProxy.check !== 'DELETE') return;
        const list = idList || this.selectedList.map(d => d.leaf_id);
        if (!list.length && !this.wipeallable) return this.$vue.$message({ message: '请选择要删除的数据', type: 'warning' });
        const params = { data_code: this.store.data_code };
        if (list.length) {
            params.leaf_id = list.join(',')
        }
        this.wipeProxy.doing = true;
        const ret = await API.wipeData(params);
        this.$vue.ResultNotify(ret);
        this.wipeProxy.doing = false;
        this.wipeProxy.visible = false;
        if (refresh) {
            this.fetchStatus();
        }
    }

    async saveFiles() {
        if (!this.selectedList.length) {
            return this.$message({ message: '请选择数据', type: 'warning' });
        }
        const files = [];
        const fileCpnts = this.store.search({ options: { componentid: 'attachment' }, onlyData: true });
        fileCpnts.forEach(cpnt => {
            for (let d of this.selectedList) {
                if (d[cpnt._fieldValue]) {
                    files.push(...d[cpnt._fieldValue].split(','))
                }
            }
        })
        if (files.length) {
            const ret = await API.downloadZipFiles({ res_id: files.join(',') });
            if (ret.success) {
                const { zip = '', remark = '' } = ret.data;
                if (zip) {
                    window.open(zip);
                }
                if (remark) {
                    setTimeout(() => {
                        window.open(remark);
                    }, 1000)
                }
            }
        }
    }
}
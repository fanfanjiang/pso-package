import API from '../../service/api'
import { MENU_LEAF_AUTH } from "../../const/menu";
import FormStore from "../form-designer/model/store.js";
import shortid from "shortid";
import debounce from "throttle-debounce/debounce";
import CPNT from "../../../share/const/form";
import Vue from "vue";
import XLSX from "xlsx";

export default class FormViewStore {

    constructor(options) {

        //表单配置
        this.$vue = null;

        //数据状态
        this.initializing = false;
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
        this.limit = 15;
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

        //权限视图
        this.authViews = [];
        this.activeView = 0;

        //页面的文字
        this.cpntText = {
            add: "新增",
            change: "更改",
            copy: "复制",
            stage: "更改阶段",
        };

        //列表原始配置
        this.usedFormCol = '';
        this.oriColData = null;

        //操作控制
        this.autoChange = true; //是否自动修改数据状态

        for (let op in options) {
            if (options.hasOwnProperty(op) && typeof options[op] !== 'undefined') {
                this[op] = options[op];
            }
        }

        this.deFetch = debounce(500, (params) => {
            this.fetch(params);
        });
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
            await this.fetchCuzFastSwtich('curStatus', 'd_status')
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
        this.showExecutor = true;
    }

    showInstance(row) {
        this.curInstance = row;
        this.dataId = row.leaf_id;
        this.instance = null;
        this.showExecutor = true;
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
                this.showInstance(this.instances[index + 1])
            }
        }
    }

    newInstance() {
        this.dataId = "";
        this.instance = null;
        this.showExecutor = true;
    }

    async fetchCuzFastSwtich(source, key, data, vField = 'value') {
        this[source] = data;
        if (this[source]) {
            this.$vue.$set(this.keys, key, { value: this[source][vField], type: 1 });
        } else {
            this.$vue.$delete(this.keys, key);
            delete this.keys[key];
        }
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
            leaf_auth: this.activeView,
            orderby: order ? `order by ${order}` : "",
            keys: { ...this.keys, ...this.defaultKeys },
            dict_type: this.usedFormCol,
        };

        this.lastCondition = this.condition;
        if (this.condition && this.condition !== "【】") {
            params.condition = this.condition;
        }

        if (this.keywords !== "" && !params.keys.d_name) {
            params.keys.d_name = { value: this.keywords, type: 2 };
        }

        console.log(params.keys);

        params.keys = JSON.stringify(params.keys);

        this.appendSearchType(params);

        return params;
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
            this.instances = ret.data;
            this.dataTotal = ret.total;
            this.summary = ret.sum || null;
        }

        this.$vue.$emit("data-loaded", this.instances);

        this.fetching = false;
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

    makeDefkeys({ where, defKeys, defForm }) {
        //外部传入的请求参数
        try {
            if (where) {
                for (let key in where) {
                    this.defaultKeys[key] = { value: this.where[key], type: 1 };
                }
            }

            if (defKeys) {
                let keyList = defKeys.split(";");
                keyList.forEach((item) => {
                    const key = item.split("#");
                    this.defaultKeys[key[0]] = { value: key[1], type: key[2] };
                });
            }

            //默认参数
            if (defForm) {
                for (let key in defForm) {
                    this.defaultKeys[key] = { value: defForm[key], type: 1 };
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

        const { opAuth, display_columns, stage_config, status_config } = this.formCfg;

        this.store = new FormStore({ data_code: data.data_code, data_design: data.data_design, designMode: false });

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
            const conditions = [];
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
            });
            if (conditions.length) {
                this.defCondition.push(conditions);
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
                    return exist.data;
                }
            }

            this.usedFormCol = cfg.column[0].name;
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

    exportCurPage() {
        if (this.$table) {
            const et = XLSX.utils.table_to_book($(this.$table)[0]);
            XLSX.writeFile(et, '模板.xlsx');
        }
    }

    async saveColumn() {
        const { display_columns, data_code } = this.formCfg;

        if (display_columns && this.usedFormCol && this.oriColData) {
            const config = JSON.parse(display_columns);
            const index = _.findIndex(config.column, { name: this.usedFormCol });
            config.column.splice(index, 1, { data: this.oriColData, name: this.usedFormCol })
            const ret = await API.updateFormTree({ data_code, display_columns: JSON.stringify(config) });
            this.$vue.ResultNotify(ret);
        }
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
                    indexs[index] = parseFloat(this.summary[key]).toFixed(2);
                }
            }
        }
        return indexs;
    }

    removeSort(index) {
        this.sorts.splice(index, 1);
        this.deFetch();
    }

    makeSort({ column, prop, order }) {
        if (order === "descending") {
            order = "desc";
        } else if (order === "ascending") {
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
            this.sorts.push({ prop, order, name: _.find(this.fields, { field_name: prop }).display });
        }
        this.deFetch();
    }

    dragHandler(newWidth, oldWidth, column, event) {
        if (this.oriColData) {
            const exist = _.find(this.oriColData, { field_name: column.property });
            console.log(exist)
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
            return flagColor.split(',').map(color => {
                return `<span class="tag-flag-box" style="background-color: ${color};"></span>`
            }).join('');
        }

        try {
            if (_val) {
                _val = _val.replace(/(?:\.0*|(\.\d+?)0+)$/, '$1');
            }
        } catch (error) {

        }

        return this.filterBadVal(_val);
    }

    filterBadVal(val) {
        return _.isNull(val) ? "" : val;
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

    async addOrUpdate({ leaf_id = "", formData }, refresh = true) {
        if (formData) {
            const dataId = leaf_id || shortid.generate();
            const ret = await API.form({ data: { leaf_id: dataId, formData }, method: "put" });
            this.$vue.ResultNotify(ret);
            if (ret.success) {
                this.$vue.$emit("data-changed", { leaf_id: leaf_id || ret.data.data, formData, op: leaf_id ? 2 : 1 });
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
}
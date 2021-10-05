import FVStore from '../form-view/store'
import API from '../../service/api'
import { genComponentData } from '../form-designer/helper'
const { FILTER_TYPE } = require('../../../share/const/filter');
import Vue from "vue";

export default class STAVStore extends FVStore {
    constructor(options) {
        super(options);
        const { outerParams, params = {} } = options;
        this.staCfg = null;
        this.showBack = false;
        this.header = null;
        this.paging = false;
        this.menus = [];
        this.outerParams = outerParams;
        this.params = params;
        this.extendData = {};
    }

    get __FIELDID__() {
        return 'field';
    }

    get __FIELDNAME__() {
        return 'name';
    }

    get opExportable() {
        return true;
    }

    get pageSize() {
        return this.paging ? [this.limit, 30, 50, 300, 500, 1000, 99999] : [this.dataTotal];
    }

    async analyzeConditions(fields, callback) {
        const conditionItems = [];

        for (let f of fields) {

            if (callback) {
                callback(f);
            }

            if (f.searchable === "1" && f.formulable !== "1" && f.searchType) {
                let data = "";
                const fType = FILTER_TYPE[f.searchType];
                const sItem = { componentid: fType.cid, fid: f.field, _fieldValue: f.field, _fieldName: f.name, displayName: f.name, _val: "" };
                if (f.defaultVal) {
                    data = f.defaultVal;
                }

                if (f.dyncoptions && f.dynccode && f.dyncname) {

                    const ret = await API.getStatisticData({ tp_code: f.dynccode, leaf_auth: 4, search_type: "select" });
                    if (ret.data && ret.data.DATA) {
                        sItem._option = ret.data.DATA.map(d => ({ _optionName: d[f.dyncname], _optionValue: d[f.dyncvalue || f.dyncname] }))
                    }

                } else {
                    if (f.searchList && f.searchList.length) {
                        data = [];
                        sItem._option = f.searchList.map((i) => {
                            if (i.d) {
                                data.push(i.v);
                            }
                            return { _optionName: i.n, _optionValue: i.v };
                        });
                    }
                }

                this.conditionOptions.push(genComponentData(sItem));
                conditionItems.push({ cpnt: sItem, field: sItem.fid, op: f.searchOp, data, match: "" });
            }
        }
        return conditionItems;
    }

    async initialize(id, query) {
        this.initializing = true;

        this.menus = (await API.getAllMenu()).data.nav;

        const ret = await API.getTreeNode({ code: id });

        if (ret.success) {

            this.staCfg = ret.data.data;

            const { tp_content, tp_config } = this.staCfg;

            let extendConditions = [];

            //动作配置
            if (tp_config) {
                const { actions, conditions } = JSON.parse(tp_config);
                if (actions) {
                    for (let act of actions) {
                        const { code, actionIds, trans } = act;
                        await this.actionMGR.addActions({ code, actionIds, trans });
                    }
                }

                if (conditions) {
                    extendConditions = await this.analyzeConditions(conditions);
                    console.log(extendConditions);
                }
            }

            this.oriColData = JSON.parse(tp_content);
            this.fields = _.orderBy(JSON.parse(tp_content), ["number"], ["asc"]);

            //默认排序配置
            const defSorts = [];

            const conditionItems = await this.analyzeConditions(this.fields, (field) => {
                Vue.set(field, 'display', field.name);

                if (field.defSort) {
                    defSorts.push(field)
                }
            });

            if (conditionItems.length || extendConditions.length) {
                this.defCondition.push(conditionItems.concat(extendConditions));
                this.showFilter = true;
            }

            if (defSorts.length) {
                _.orderBy(defSorts, ["defSortOrder"], ["asc"]).forEach(f => {
                    this.makeSort({ prop: f.field, order: f.defSort, display: f.name, operable: f.sortable === '1', fetch: false });
                })
            }

            //解析默认keys
            if (query) {
                this.showBack = query.__source__;
                if (query.keys) {
                    try {
                        const params = JSON.parse(query.keys);
                        for (let p of params) {
                            const exist = _.find(this.fields, { field: p.t });
                            if (exist) {
                                this.defaultKeys[p.t] = { value: p.v, type: 1, name: exist.name, display: p.n };
                            }
                        }
                    } catch (error) { }
                }
            }


            try {
                if (this.staCfg.tp_head) {
                    const column = this.analyzeHeader(JSON.parse(this.staCfg.tp_head)[0].children);
                    if (column.length) {
                        this.header = column;
                        this.$vue.$emit('header-inited', { header: this.header })
                    }
                }
            } catch (error) {
                this.header = null;
            }
        }

        this.initializing = false;
    }

    analyzeHeader(data) {
        const _self = this;
        (function ayalyze(children) {
            for (let i of children) {
                if (i.children) {
                    ayalyze(i.children);
                } else {
                    const f = _.find(_self.fields, { field: i.field });
                    if (f) {
                        Object.assign(i, f);
                    }
                }
            }
        })(data);
        return data;
    }

    async fetchStatus() {
        this.starting = true;

        const params = {
            ...this.params,
            limit: this.limit,
            start: 0,
            tp_code: this.staCfg.tp_code,
            leaf_auth: this.activeView,
            paramvalue: this.extendData,
            search_type: "init"
        };

        if (this.condition && this.condition !== "【】") {
            params.condition = this.condition;
        }
        
        const ret = await API.getStatisticData(params);

        if (ret.success) {
            if (ret.data.NAV) {
                this.statuses = ret.data.NAV.map(s => {
                    s.name = s.status_name;
                });
            }

            if (typeof ret.data.PAGE !== 'undefined') {
                this.paging = true;
            }
            await this.fetchCuzFastSwtich('curStatus', 'd_status');
        }
        this.starting = false;
    }

    async fetch() {

        this.fetching = true;

        const order = this.sorts.map((item) => `${item.prop} ${item.order}`).join(",");

        const params = {
            ...this.params,
            limit: this.limit,
            start: this.page - 1,
            tp_code: this.staCfg.tp_code,
            leaf_auth: this.activeView,
            paramvalue: this.extendData,
            orderby: order ? `order by ${order}` : "",
            keys: JSON.stringify({ ...this.defaultKeys })
        };

        if (this.curStatus) {
            params.search_type = "select";
            params.d_status = this.curStatus.d_status;
        }

        if (this.outerParams) {
            Object.assign(params, this.outerParams);
        }

        if (this.condition && this.condition !== "【】") {
            params.condition = this.condition;
        }

        const ret = await API.getStatisticData(params);

        if (ret.success) {
            if (ret.data.GATHER && ret.data.GATHER.length) {
                this.summary = ret.data.GATHER[0];
            }

            //公式字段
            try {
                this.fields.forEach((f) => {
                    if (f.formulable === "1" && f.formula) {
                        let summary = 0;
                        ret.data.DATA.forEach((d) => {
                            let formula = f.formula;
                            this.fields.forEach((item) => {
                                formula = formula.replace(new RegExp(`@${item.field}@`, "g"), d[item.field]);
                            });
                            d[f.field] = eval(formula);
                            summary += d[f.field];
                        });
                        if (f.cal === "1") {
                            this.summary[f.field] = summary;
                        }
                    }
                });
            } catch (error) {
                console.log(error);
            }

            this.instances = ret.data.DATA;
            if (ret.data.PAGE) {
                this.dataTotal = Object.values(ret.data.PAGE[0])[0];
            } else {
                this.dataTotal = ret.data.DATA.length;
            }
            this.$vue.$emit("data-loaded", { data: this.instances, store: this });
        }

        this.fetching = false;

        this.fixLayout();
    }

    async saveColumn() {
        const { tp_code } = this.staCfg;
        if (this.oriColData) {
            const ret = await API.templates({ data: { tp_code, tp_content: JSON.stringify(this.oriColData) }, method: "put" });
            this.$vue.ResultNotify(ret);
        }
    }

    analyzeCellStyle({ row, column, rowIndex, columnIndex }) {
        if (column.property) {
            const field = _.find(this.fields, { field: column.property });
            if (field && field.drillTarget) {
                return { color: "#F67E19", cursor: "pointer" };
            }
        }
    }

    makeDefkeys(options) {
        super.makeDefkeys(options);
        const { extendData } = options;
        if (extendData) {
            this.extendData = extendData
        } else {
            this.extendData = {};
        }
    }

    exportCurPage() {
        if (this.$tableWrapper) {
            super.exportCurPage('数据')
        }
    }

    showActInst(data) {
        this.dataDefault = null;
        if (data.leaf_id) {
            this.showInstance(data);
            this.switchable = false;
        } else {
            for (let key in data) {
                this.setDefaultData(key, data[key]);
            }
            this.newActInst();
        }
    }
}
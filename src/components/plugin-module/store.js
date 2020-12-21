
import Vue from 'vue';
import API from "../../service/api.js";

import shortid from "shortid";

export default class Module {

    static CPNT = {};

    static DEFAULT = {};

    constructor(options) {

        this.code = '';
        this.initializing = true;
        this.creating = false;
        this.saving = false;
        this.data = [];
        this.$vue = {};
        this.cpntsMap = {};
        this.curCpnt = null;

        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option];
            }
        }
    }

    async initialize() {
        this.initializing = true;
        const ret = await API.getPluginModules({ keys: JSON.stringify({ tp_code: { type: 1, value: this.code } }) });
        if (ret.success) {
            ret.data.forEach(d => {
                const data = d.child_design;
                delete d.child_design;
                this.addCpnt(data ? JSON.parse(data) : {}, d);
            })
        }
        this.initializing = false;
    }

    async delCpnt(i) {
        const { child_id } = this.cpntsMap[i].urine;
        const ret = await API.addOrUpdatePluginModule({ optype: 2, child_id });
        this.$vue.ResultNotify(ret);
        if (ret.success) {
            if (this.curCpnt && this.curCpnt.i === i) {
                this.setCurCpnt(null);
            }
            this.deregister(i);
        }
    }

    async saveCpnt(cpnt) {
        this.saving = true;
        const { child_data } = cpnt.urine;
        const ret = await API.addOrUpdatePluginModule({
            optype: 1, ...cpnt.urine, child_data: JSON.stringify(child_data), child_design: JSON.stringify(cpnt.data)
        });
        this.$vue.ResultNotify(ret);
        this.saving = false;
    }

    async createCpnt(cpnt) {
        this.creating = true;
        const { id } = cpnt;
        const __cpnt__ = this.constructor.CPNT[id];
        if (!__cpnt__) {
            return;
        }
        const urine = { ...this.constructor.DEFAULT, tp_code: this.code, child_name: __cpnt__.name, child_design: JSON.stringify({ id }) }
        const ret = await API.addOrUpdatePluginModule({ optype: 0, ...urine });
        if (ret.success && ret.message) {
            urine.child_id = ret.message;
            this.addCpnt(cpnt, urine);
        }
        this.creating = false;
    }

    addCpnt(cpnt = {}, urine = {}) {
        let { id = 'chart', i } = cpnt;

        const __cpnt__ = this.constructor.CPNT[id];
        if (!__cpnt__) {
            return;
        }

        if (!i) {
            i = shortid.generate();
        }

        if (!urine.child_data) {
            Vue.set(urine, 'child_data', [])
        } else {
            urine.child_data = JSON.parse(urine.child_data);
        }

        if (!urine.child_content) {
            Vue.set(urine, 'child_content', [])
        } else {
            urine.child_content = JSON.parse(urine.child_content);
        }

        const entity = { store: this, __cpnt__, i, data: { ..._.cloneDeep(__cpnt__.data), i, n: __cpnt__.name, ...cpnt, id }, urine };

        this.register(entity);
        this.setCurCpnt(entity);
        return entity;
    }

    setCurCpnt(data) {
        this.curCpnt = data;
    }

    register(cpnt) {
        Vue.set(this.cpntsMap, cpnt.i, cpnt);
        this.data.push(cpnt);
    }

    deregister(i) {
        Vue.delete(this.cpntsMap, i);
        const index = _.findIndex(this.data, { i });
        if (index !== -1) {
            this.data.splice(index, 1);
            return index;
        }
    }
}
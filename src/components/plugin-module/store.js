
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
        this.pluginCfg = {};

        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option];
            }
        }
    }

    async initialize() {
        this.initializing = true;

        if (this.beforeInitialize) {
            const stopInit = await this.beforeInitialize();
            if (stopInit) return;
        }

        const cfgRet = await API.getTreeNode({ code: this.code });
        this.pluginCfg = cfgRet.data.data;

        const ret = await API.getPluginModules({ keys: JSON.stringify({ tp_code: { type: 1, value: this.code } }) });
        if (ret.success) {
            ret.data.forEach((d, i) => {
                const data = d.child_design;
                delete d.child_design;
                const entity = this.addCpnt(data ? JSON.parse(data) : {}, d);
                if (entity && i === 0) {
                    this.setCurCpnt(entity);
                }
            })
        }

        if (this.onInitialized) {
            const stopInit = await this.onInitialized();
            if (stopInit) return;
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
        const ret = await API.addOrUpdatePluginModule({ optype: 0, ...urine }, false);
        this.creating = false;
        if (ret.success && ret.message) {
            urine.child_id = ret.message;
            const entity = this.addCpnt(cpnt, urine);
            return entity
        }
    }

    addCpnt(cpnt = {}, urine = {}, beforeAdd) {
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

        beforeAdd && beforeAdd(entity);
        this.register(entity);
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

    async fetchScriptData(cpnt, params) {
        const { child_id } = cpnt.urine;
        const ret = await API.getPluginModuleData({ child_id, limit: 9999, start: 0, ...params });
        if (ret.success && ret.data.DATA) {
            return ret.data.DATA;
        } else {
            return [];
        }
    }
}
import API from "../../service/api.js";
export default class FTRStore {
    constructor(options) {
        this.$vue = null;

        this.fetching = false;
        this.fetchingModule = false;
        this.saving = false;
        this.savingSub = false;

        this.instances = [];
        this.dataTotal = 0;

        this.modules = [];
        this.moduleTotal = 0;

        this.curInstance = null

        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option];
            }
        }
    }

    setInstance(data) {
        this.curInstance = data;
    }

    async fetch(params) {
        this.fetching = true;
        this.keysToString(params);
        const ret = await API.ftrcfg({ data: params, method: 'get' });
        if (ret.success) {
            this.instances = ret.data;
        }
        this.fetching = false;
    }

    async fetchModules(params = {}) {
        if (!params.keys) params.keys = {};
        if (this.curInstance) {
            params.keys['solr_id'] = { type: '1', value: this.curInstance.solr_id }
        }
        this.keysToString(params);
        this.fetchingModule = true; 
        const ret = await API.getFTRModulesCfg(params);
        if (ret.success) {
            this.modules = ret.data;
        }
        this.fetchingModule = false;
    }

    keysToString(params) {
        if (params.keys) {
            params.keys = JSON.stringify(params.keys)
        }
    }

    async modify(data) {
        const { optype, solr_name } = data;
        if (typeof optype === 'undefined' || (optype != 2 && !solr_name)) return this.$vue.$message.warning("请完善信息");
        this.saving = true;
        const ret = await API.ftrcfg({ data, method: 'post' });
        this.$vue.ResultNotify(ret);
        this.saving = false;
    }

    async publish(data) {
        const ret = await API.publishFTRCfg(data);
        this.$vue.ResultNotify(ret);
    }

    async modifySub(data) {
        const { optype, child_name } = data;
        if (typeof optype === 'undefined' || (optype != 2 && !child_name)) return this.$vue.$message.warning("请完善信息");
        this.savingSub = true;
        const ret = await API.addOrUpdateFTRModule(data);
        this.$vue.ResultNotify(ret);
        this.savingSub = false;
    }
}
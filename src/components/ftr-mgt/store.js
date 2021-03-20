import API from "../../service/api.js";
export default class FTRStore {
    constructor(options) {
        this.$vue = null;

        this.fetching = false;
        this.fetchingModule = false;
        this.saving = false;
        this.pubing = false;
        this.indexing = false;
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
        this.keysToObj(params);
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
        if (params.keys && typeof params.keys !== 'string') {
            params.keys = JSON.stringify(params.keys)
        }
    }

    keysToObj(params) {
        if (!params.keys) params.keys = {};
        if (typeof params.keys === 'string') {
            params.keys = JSON.parse(params.keys)
        }
    }

    async modify(data, publish = false) {
        const { optype, solr_name, solr_field, solr_link, solr_id } = data;
        if (typeof optype === 'undefined' || (optype != 2 && !solr_name)) return this.$vue.$message.warning("请完善信息");
        this.saving = true;
        const ret = await API.ftrcfg({ data: { ...data, solr_field: JSON.stringify(solr_field), solr_link: JSON.stringify(solr_link) }, method: 'post' });
        if (publish && solr_id) {
            await this.publish({ solr_id });
        }
        this.$vue.ResultNotify(ret);
        this.saving = false;
    }

    async publish(data) {
        this.pubing = true;
        const ret = await API.publishFTRCfg(data);
        this.$vue.ResultNotify(ret);
        this.pubing = false;
    }

    async makeIndexes(data) {
        this.indexing = true;
        const ret = await API.request('/api/ftrcfg/cfg/indexes', { data, method: 'post' });
        this.$vue.ResultNotify(ret);
        this.indexing = false;
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
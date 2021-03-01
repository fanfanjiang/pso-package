import API from "../../service/api.js";
export default class FTRStore {
    constructor(options) {
        this.$vue = null;

        this.initializing = false;
        this.fetching = false;
        this.fetchingModule = false;

        this.instances = [];
        this.dataTotal = 0;

        this.keywords = '';
        this.activeView = '4';

        this.categories = [];
        this.activeCate = null;
        this.moduleData = [];
        this.modules = [];

        this.config = {};

        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option];
            }
        }
    }

    get curCateFields() {
        return this.getCateFields(this.activeCate);
    }

    setActiveView(value) {
        this.activeView = value;
    }

    async setActiveCate(value) {
        this.activeCate = value;
        await this.fetchModules();
        await this.fetchModuleData();
    }

    getCategory(solr_id) {
        solr_id = solr_id || this.activeCate;
        return _.find(this.categories, { solr_id });
    }

    getCateFields(solr_id) {
        const cate = this.getCategory(solr_id);
        if (cate && cate.solr_field) {
            return JSON.parse(cate.solr_field);
        }
        return []
    }

    async initialize() {
        this.initializing = true;

        const ret = await API.ftrcfg({ data: {}, method: 'get' });
        if (ret.success) {
            this.categories = ret.data;
            if (this.categories.length) {
                await this.setActiveCate(this.categories[0].solr_id);
            } else {
                return this.$vue.$message.warning("请先完善检索配置");
            }
        }

        this.initializing = false;
    }

    async fetch(params) {
        this.fetching = true;
        this.keywords = params.keywords;
        if (this.keywords) {
            const ret = await API.getFTR({ ...params, solr_id: this.activeCate, dq: this.keywords, leaf_auth: this.activeView || 4 });
            this.instances = ret.data.data;
            this.dataTotal = ret.data.total;
        } else {
            this.instances = [];
            this.dataTotal = 0;
        }
        this.fetching = false;
    }

    getModule({ child_id }) {
        return _.find(this.modules, { child_id })
    }

    getModuleData(mod, mainData) {
        if (this.moduleData[mod.child_id] && mainData['id']) {
            return this.moduleData[mod.child_id][mainData['id']] || [];
        }
        return [];
    }

    async fetchModules() {
        const ret = await API.getFTRModulesCfg({ keys: JSON.stringify({ solr_id: { type: '1', value: this.activeCate } }) });
        if (ret.success) {
            this.modules = ret.data.filter(d => d.child_content);
        }
    }

    async fetchModuleData() {
        this.fetchingModule = true;
        const ret = await API.getFTRModulesData({ solr_id: this.activeCate });
        this.moduleData = ret.data;
        this.fetchingModule = false;
    }

    getFiltered(text) {
        if (text) {
            return text.replace(this.keywords, `<span style="color:red">${this.keywords}</span>`);
        }
        return "";
    }
}
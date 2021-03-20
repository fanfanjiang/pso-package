import API from "../../service/api.js";
import FormStore from "../form-designer/model/store.js";
import { genComponentData } from "../form-designer/helper";

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
        return this.getCategory(this.activeCate).solr_field;
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

    async initialize() {
        this.initializing = true;

        const ret = await API.ftrcfg({ data: {}, method: 'get' });
        if (ret.success) {
            this.categories = ret.data;

            if (this.categories.length) {
                for (let cate of this.categories) {
                    cate.solr_link = cate.solr_link ? JSON.parse(cate.solr_link) : [];
                    cate.solr_field = cate.solr_field ? JSON.parse(cate.solr_field) : [];
                }
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
            const ret = await API.getFTR({ ...params, solr_id: this.activeCate, dq: this.keywords, leaf_auth: this.activeView || 4, start: params.start - 1 });
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
            for (let item of this.modules) {
                    item.child_url = item.child_url ? JSON.parse(item.child_url) : [];
                    item.child_content = item.child_content ? JSON.parse(item.child_content) : [];
            }
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

    makeMockStore(proxy, fields) {
        if (proxy.mockStore) return;
        const data_config = [];
        for (let f of fields) {
            data_config.push(genComponentData({ componentid: "text", _fieldValue: f.field, _fieldName: f.name }));
        }
        proxy.mockStore = new FormStore({ data_config });
    }
}
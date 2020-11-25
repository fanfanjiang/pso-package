import { closest } from "../components/form-designer/drag-drop/utils";
import addEventListener from "../utils/dom/addEventListener";

//表单列表字段修改,需要相应的页面组件支持
export const FormModifierMixin = {
    data() {
        this.modCfg = null;
        this.bodyListener = null;
        this.modStore = null;
        this.handleSaved = null;
        this.modifiedField = '';
        return {
            showModifier: false,
            modInstance: null,
            modifierStyle: {
                top: "0px",
                left: "0px",
            }
        }
    },
    watch: {
        showModifier: {
            handler(val) {
                if (!val) {
                    this.saveModified();
                }
            }
        }
    },
    destroyed() {
        if (this.bodyListener) {
            this.bodyListener.remove();
        }
    },
    mounted() {
        this.bodyListener = addEventListener($("body").get(0), "click", (e) => {
            const isInModifier = closest(e.target, ".modifier");
            if (!isInModifier && this.showModifier) {
                this.showModifier = false;
            }
        });
    },
    methods: {
        initializeModifier(cfg, store, fun) {
            this.modCfg = _.cloneDeep(cfg);
            this.modStore = store;
            this.handleSaved = fun;
        },
        async saveModified() {
            if (this.modInstance) {
                try {
                    const formData = await this.$refs.modifier.makeData();
                    const data = formData.dataArr[0];
                    if (this.modInstance) {
                        data.__temporary__ = this.modInstance.__temporary__;
                        data.__dump__ = this.modInstance.__dump__;
                    }
                    if (data.leaf_id === this.modInstance.leaf_id && data[this.modifiedField] != this.modInstance[this.modifiedField]) {
                        this.handleSaved && this.handleSaved({ leaf_id: this.dataId, formData });
                    }
                } catch (error) {
                    return null;
                }
            }
        },
        modLoadHandler(store) {
            if (!this.modifiedField) return;
            const cpnt = store.searchByField(this.modifiedField);
            if (cpnt) {
                store._forEach((item) => {
                    if (!item.CPNT.layout && item.data._fieldValue !== this.modifiedField) {
                        item.data._hideForever = true;
                        item.data._autofocus = false;
                    }
                });
                cpnt.data._fieldName = "";
                cpnt.data._autofocus = true;
                cpnt.data._hideForever = false;
                cpnt.data._read = false;
            }
        },
        openModifier(row, field, index) {
            const placeholder = this.$refs[`${index}${field.field_name}`];
            const td = closest(placeholder[0], "td");
            if (!td) return;

            const { top, left, width } = td.getBoundingClientRect();
            this.modifierStyle = {
                top: `${top - 1}px`,
                left: `${left - 1}px`,
                width: `${width}px`,
            };

            this.showModifier = false;
            this.$nextTick(() => {
                let exist = this.modStore.searchByField(field.field_name.replace("_x", ""), true);
                if (!exist) {
                    exist = this.modStore.searchByField(field.field_name.replace("_s", ""), true);
                }
                if (exist) {
                    this.modifiedField = exist._fieldValue;
                    this.modInstance = row;
                    this.showModifier = true;
                }
            });
        }
    }
}

export const PagingMixin = {
    data() {
        return {
            fetchParams: {
                start: 1,
                limit: 20,
                keywords: '',
            },
            watchFun: []
        }
    },
    methods: {
        getFetchParams(field) {
            const { start, limit, keywords } = this.fetchParams
            const params = { limit, start: start - 1 };
            if (keywords) {
                params.keys = JSON.stringify({ [field]: { value: keywords, type: 2 } });
            }
            return params;
        },
        startWatch() {
            this.watchFun.push(
                this.$watch("fetchParams.limit", () => {
                    this.$emit('load');
                }),
                this.$watch("fetchParams.page", () => {
                    this.$emit('load');
                }),
                this.$watch("fetchParams.keywords", () => {
                    this.$emit('load');
                }),
            );
        },
        sizeChangeHandler(size) {
            this.fetchParams.limit = size;
        },
        currentChangeHandler(page) {
            this.fetchParams.start = page;
        },
        prevClickHandler() {
            this.fetchParams.start -= 1;
        },
        nextClickHandler() {
            this.fetchParams.start += 1;
        }
    }
}

export const MgtMixin = {
    data() {
        return {
            showFilter: true,
        }
    },
    computed: {
        viewClass() {
            return {
                "pso-view__expand": this.showFilter,
                "pso-view__expand-wider": true,
                "pso-view-mgt": true,
                "pso-view": true,
            };
        },
    },
    methods: {
    }
}
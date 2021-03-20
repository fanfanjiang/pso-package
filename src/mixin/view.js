import { closest } from "../components/form-designer/drag-drop/utils";
import addEventListener from "../utils/dom/addEventListener";
import { MENU_LEAF_AUTH } from "../const/menu";

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
        confirmModify() {
            this.showModifier = false;
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
                    const sv = this.modInstance[this.modifiedField];
                    const tv = data[this.modifiedField];

                    if (data.leaf_id === this.modInstance.leaf_id && tv != sv && !(tv === '' && typeof sv === 'undefined')) {
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

export const FetchMixin = {
    created() {
        this.$watch("fetchParams", {
            deep: true,
            handler() {
                this.$refs.view.fetch();
            }
        })
    },
    data() {
        return {
            showEditor: false,
            editing: false,
            deleting: false,
            fetchParams: {},
            selected: [],
            curInstance: null,
            ID: ''
        }
    },
    methods: {
        getFetchParams(params) {
            if (params.keys) {
                if (typeof params.keys === 'string') {
                    params.keys = JSON.parse(params.keys)
                }
            } else {
                params.keys = {}
            }
            for (let k in this.fetchParams) {
                const isValueAry = Array.isArray(this.fetchParams[k]);
                const value = isValueAry ? `${this.fetchParams[k].join(",")}` : this.fetchParams[k];
                if (value) {
                    params.keys[k] = { value, type: (this.timeParams && this.timeParams.indexOf(k) !== -1) ? 3 : isValueAry ? 4 : 2 };
                }
            }
            params.keys = JSON.stringify(params.keys)
            return params;
        },
        selectHandler(data) {
            this.selected = data;
        },
        addHandler() {
            this.curInstance = { ...this.DATA };
            this.showEditor = true;
        },
        dbClickHandler(row) {
            this.curInstance = row;
            this.showEditor = true;
        },
        async delHandler() {
            if (!this.selected.length) return;
            this.deleting = true;
            await this.saveHandler({ [this.ID]: this.selected[0][this.ID] });
            this.deleting = false;
        },
        async saveHandler(params) {
            if (this.editing) return;
            this.editing = true;
            let data = {};
            if (params) {
                data = { ...params, optype: 2 };
            } else {
                const IDNotEmpty = this.curInstance[this.ID];
                data = { ...this.curInstance, optype: IDNotEmpty ? 1 : 0 };
            }
            const ret = await this.addOrUpdate(data);
            this.ResultNotify(ret);
            this.showEditor = false;
            this.editing = false;
            this.$refs.view.fetch();
        },
        refresh() {
            this.$refs.view.fetch();
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
            pagingWatchFun: []
        }
    },
    methods: {
        getFetchParams(field, extend = {}) {
            const { start, limit, keywords } = this.fetchParams
            const params = { limit, start: start - 1, keys: extend };
            if (keywords && field) {
                params.keys[field] = { value: keywords, type: 2 };
            }
            params.keys = JSON.stringify(params.keys);
            return params;
        },
        startWatch() {
            this.pagingWatchFun.forEach((f) => f());
            this.pagingWatchFun = [];
            this.pagingWatchFun.push(
                this.$watch("fetchParams.limit", () => {
                    this.$emit('load');
                }),
                this.$watch("fetchParams.start", () => {
                    this.$emit('load');
                }),
                this.$watch("fetchParams.keywords", () => {
                    if (this.fetchParams.start === 1) {
                        this.$emit('load'); 
                    } else {
                        this.fetchParams.start = 1;
                    }
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
        },
        refreshPaging() {
            this.fetchParams.start = 1;
        }
    }
}

export const MgtMixin = {
    data() {
        return {
            showFilter: true,
            expandWider: true
        }
    },
    computed: {
        viewClass() {
            return {
                "pso-view__expand": this.showFilter,
                "pso-view__expand-wider": this.expandWider,
                "pso-view-mgt": true,
                "pso-view": true,
            };
        },
    },
    methods: {
    }
}

export const AuthViewMixin = {
    data() {
        return {
            authViews: [],
            activeView: ''
        }
    },
    methods: {
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
    }
}

export default {
    AuthViewMixin
}
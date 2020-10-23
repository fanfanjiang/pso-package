import STAVStore from "./store";
import Icon from "./icon";
import CustomColumn from "./column";
import FastSwitch from "../form-view/fast-switch";
import TableFun from "../form-view/table-fun";
import DataFun from "../form-view/data-fun";

export const StaMixin = {
    components: { CustomColumn, Icon, FastSwitch, TableFun, DataFun },
    props: {
        params: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            store: null,
            watchFun: [],
        };
    },
    computed: {
        pageTitle() {
            return this.store && this.store.staCfg.tp_name;
        },
        viewClass() {
            return {
                "pso-view__expend": this.store && this.store.showFilter,
            };
        },
    },
    watch: {
        "params.plug_code": {
            immediate: true,
            handler() {
                this.initialize();
            },
        }
    },
    methods: {
        async initialize() {
            if (this.params.plug_code) {
                if (this.watchFun.length) {
                    this.watchFun.forEach((f) => f());
                    this.watchFun = [];
                }

                this.store = new STAVStore({ $vue: this, outerParams: this.params.outerParams, params: this.params.pluginParams });

                if (this.params.viewAuth) {
                    this.store.analyzeAuthView(this.params.viewAuth, this.params.auth_config);
                }

                await this.store.initialize(this.params.plug_code, this.$router.currentRoute.query);
                this.$emit("initialized", { store: this.store });
                await this.store.fetchStatus();

                this.watchFun.push(
                    this.$watch("store.limit", () => {
                        this.store.deFetch();
                    }),

                    this.$watch("store.page", () => {
                        this.store.deFetch();
                    }),

                    this.$watch("store.condition", () => {
                        this.store.deFetch();
                    }),

                    this.$watch("store.activeView", () => {
                        this.store.fetchStatus();
                    })
                );
            } else {
                this.store = null;
            }
        },
    },
};
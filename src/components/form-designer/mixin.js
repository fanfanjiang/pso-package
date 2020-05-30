import emitter from "../../mixin/emitter";
import FormStore from "./model/store.js";

export const common = {
    mixins: [emitter],
    componentName: "PsoformItem",
    props: {
        cpnt: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            initialized: false
        }
    },
    watch: {
        "cpnt.store.fid"(val) {
            if (val === this.cpnt.fid && !this.initialized) {

                if (this.$refs.codemirror) {
                    this.$nextTick(() => {
                        this.$refs.codemirror.codemirror.refresh();
                        this.initialized = true;
                    });
                }
            }
        }
    }
};

export const formOp = {
    data() {
        return {
            formStore: null
        }
    },
    methods: {
        async makeFormStore(id) {
            const ret = await this.API.formsCfg({ data: { id }, method: "get" });
            if (!ret.success) return;
            this.formStore = new FormStore(ret.data);
            return this.formStore;
        }
    }
};
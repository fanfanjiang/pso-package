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

export const FormulaMixin = {
    computed: {
        numOptions() {
            const mainCpnts = this.cpnt.store.search({
                options: { db: true },
                onlyData: true,
                beforePush: (item) => {
                    if (item.fid === this.cpnt.fid) return false;
                    if (item.parent.CPNT.host_db) return false;
                    if (item.CPNT.componentid === this.cpnt.CPNT.componentid) return false;
                    return true;
                },
            });
            const asstables = this.cpnt.store.search({
                options: { componentid: "asstable" },
                beforePush: (item) => {
                    if (!item.data._option) return false;
                    return true;
                },
            });
            let astFields = [];
            asstables.forEach((ast) => {
                if (ast.cache.fieldOptions) {
                    const fields = _.cloneDeep(ast.cache.fieldOptions);
                    fields.forEach(f => {
                        f.fid = `${ast.data._option}_${f.fid}`
                    })
                    astFields = astFields.concat(fields);
                }
            });
            return mainCpnts.concat(astFields);
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
        async makeFormStore(id, options = { designMode: false }) {
            const ret = await this.API.formsCfg({ data: { id }, method: "get" });
            if (!ret.success) return;
            this.formStore = new FormStore({ ...ret.data, options });
            return this.formStore;
        }
    }
};
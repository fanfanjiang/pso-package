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

export const FieldsMixin = {
    computed: {
        fieldsCollection() {
            const mainCpnts = this.cpnt.store.search({ options: { db: true }, onlyData: true, beforePush: (item) => item.fid !== this.cpnt.fid });
            const asstables = this.cpnt.store.search({ options: { componentid: "asstable" }, beforePush: (item) => item.data._option });
            const astFields = [];
            asstables.forEach((ast) => {
                if (ast.cache.fieldOptions) {
                    const fields = _.cloneDeep(ast.cache.fieldOptions);
                    fields.forEach(f => { f.fid = `${ast.data._option}_${f.fid}` });
                    astFields.push({ n: `关联表${ast.data._fieldName}`, v: fields })
                }
            });
            return [{ n: '当前表', v: mainCpnts }].concat(astFields);
        }
    }
};

export const FormulaMixin = {
    mixins: [FieldsMixin],
    computed: {
        numOptions() {
            return _.flatten(_.map(this.fieldsCollection, 'v'));
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
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
            formStore: null,
            formConfig: null,
        }
    },
    methods: {
        async makeFormStore(id, options = { designMode: false }) {
            const data = { id };
            if (options && options.requiredappid) {
                data.requiredappid = options.requiredappid;
            }
            const ret = await this.API.formsCfg({ data, method: "get" });
            if (!ret.success) return;
            this.formConfig = ret.data;
            this.formStore = new FormStore({ ...ret.data, options });
            return this.formStore;
        },
        async makeFormFields({ store, source, code, requiredappid = '' }) {
            store = store || this.formStore;
            let fields = [];

            fields = store.search({
                options: { db: true },
                onlyData: true,
                beforePush: (item) => {
                    item.data.fieldDisplay = `[${item.CPNT.name}]${item.data._fieldName}`;
                    return !item.parent.CPNT.host_db;
                },
            });

            if (source === "2" || source === "3") {
                fields = [];
                const ret = await this.API.getFormDict({ data_code: code, requiredappid });
                ret.data.forEach((d) => {
                    const f = store.searchByField(d.field_name);

                    if (f) {
                        Object.assign(d, f.data);
                    }

                    const mixedBlood = d.field_name === "d_tag" || d.field_name === "d_name";
                    const noSys = f && !mixedBlood;

                    d.is_sys = noSys ? "0" : "1";
                    d._fieldValue = d.field_name;
                    d.fieldDisplay = noSys
                        ? `${f.data._fieldName}@${d.field_name}@${f.CPNT.name}`
                        : `系统@${d.field_name}@${mixedBlood ? f.data._fieldName : ""}`;

                    if (source === "3") {
                        if (!/\S+_s$/.test(d.field_name) && !/\S+_x$/.test(d.field_name)) {
                            fields.push(d);
                        }
                    } else {
                        fields.push(d);
                    }
                });
            }

            fields = _.orderBy(fields, ["is_sys"], ["asc"]);

            return fields;
        }
    }
};
import emitter from "../../mixin/emitter";

export default {
    mixins: [emitter],
    componentName: "PsoformItem",
    props: {
        cpnt: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        storeEditable() {
            if (this.cpnt.store) {
                return this.cpnt.store.editable
            } else {
                return true
            }
        },
        cpntEditable() {
            return this.storeEditable && !this.cpnt.data._read;
        }
    },
    created() {
        const parent = this.$parent;
        if (parent.isInterpreter) {
            this.interpreter = parent;
        } else {
            this.interpreter = parent.interpreter;
        }
        if (!this.emitSilent) {
            this.watchCpntVal();
        }
    },
    methods: {
        watchCpntVal() {
            this.$watch('cpnt.data._val', (value) => {
                this.dispatch("PsoformInterpreter", "cpnt-value-changed", { cpnt: this.cpnt, value, proxy: this.proxy, fields: this.fields });
                this.$emit('value-change', { cpnt: this.cpnt, value, proxy: this.proxy, fields: this.fields });
                if (this.cpnt.store) this.cpnt.store.setShowByRules(this.cpnt);
            })
        }
    }
};
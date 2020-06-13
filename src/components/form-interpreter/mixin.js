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
        }
    },
    watch: {
        'cpnt.data._val': {
            handler(value) {
                if (!this.emitSilent) {
                    this.dispatch("PsoformInterpreter", "cpnt-value-changed", { cpnt: this.cpnt, value, proxy: this.proxy });
                    this.$emit('value-change', { cpnt: this.cpnt, value, proxy: this.proxy });
                    this.cpnt.store.setShowByRules(this.cpnt);
                }
            }
        }
    },
    created() {
        const parent = this.$parent;

        if (parent.isInterpreter) {
            this.interpreter = parent;
        } else {
            this.interpreter = parent.interpreter;
        }
    }
};
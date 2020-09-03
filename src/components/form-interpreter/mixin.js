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

        if (this.proxy) {
            this.cpnt.data._proxy = this.proxy;
        }

        if (this.cpnt.data._association) {
            this.$on('cpnt-value-changed', ({ cpnt, value, store, proxy }) => {
                let targetVal;
                if (cpnt.data.fid === this.cpnt.data._association) {
                    targetVal = value;
                } else if (cpnt.CPNT.componentid === 'asstable' && proxy.valList.length) {
                    const isSubList = this.cpnt.data._association.split('_');
                    if (isSubList.length > 1) {
                        isSubList.splice(0, 1);
                        const target = store.search({ options: { fid: isSubList.join('_') }, onlyData: true });
                        if (target && target._fieldValue) {
                            targetVal = proxy.valList[proxy.valList.length - 1][target._fieldValue];
                        }
                    }

                }
                if (targetVal) {
                    if (this.setDataByIds) {
                        try {
                            if (this.proxy) {
                                const list = this.proxy.list || this.proxy.valList;
                                if (list) list.splice(0);
                            }
                        } catch (error) {

                        }
                        this.setDataByIds(targetVal.split(','));
                    } else {
                        this.cpnt.data._val = targetVal
                    }
                }
            })
        }
    },
    methods: {
        watchCpntVal() {
            this.$watch('cpnt.data._val', (value) => {
                this.dispatch("PsoformInterpreter", "cpnt-value-changed", { cpnt: this.cpnt, value, proxy: this.proxy, fields: this.fields, store: this.store });
                this.$emit('value-change', { cpnt: this.cpnt, value, proxy: this.proxy, fields: this.fields, store: this.store });
                if (this.cpnt.store) this.cpnt.store.setShowByRules(this.cpnt);
            })
        }
    }
};
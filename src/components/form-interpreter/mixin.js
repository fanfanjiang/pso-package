import emitter from "../../mixin/emitter";
import PsoLabel from "./label";
import { desensitize } from "../../utils/util";

export default {
    mixins: [emitter],
    componentName: "PsoformItem",
    components: { PsoLabel },
    props: {
        cpnt: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            showValue: ''
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
            if (this.cpnt.data.__forceEdit__) return true;
            return this.storeEditable && !this.cpnt.data._read;
        },
        shouldDesen() {
            return this.cpnt.data._encry === '1' && !this.cpntEditable;
        },
        desensitized() {
            if (this.shouldDesen) {
                return desensitize(this.cpnt.data._val);
            }
        },
        size() {
            return this.cpnt.store ? this.cpnt.store.size : 'small'
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

        if (this.setDataByIds) {
            this.cpnt.__setDataByIds = this.setDataByIds;
        }

        if (this.deleteCpntValue) {
            this.cpnt.__deleteCpntValue = this.deleteCpntValue;
        }

        this.cpnt.$state = this.$data;

        if (this.cpnt.data._association) {
            if (!this.cpnt.data._val) {
                this.$on('cpnt-initialized', (params) => {
                    this.changedynamically(params);
                })
            }
            if (this.cpnt.data._astchangeType !== '2') {
                this.$on('cpnt-value-changed', (params) => {
                    this.changedynamically(params);
                })
            }
        }
    },
    methods: {
        watchCpntVal() {
            this.$watch('cpnt.data._val', (value) => {
                if (this.__xssFilter__ && typeof value === 'string') {
                    const purified = this.PSODOMPurify.sanitize(value);
                    if (purified !== value) {
                        this.cpnt.data._val = purified;
                        return;
                    }
                }
                if (this.makeShowValue) {
                    this.makeShowValue();
                }
                this.dispatch("PsoformInterpreter", "cpnt-value-changed", { cpnt: this.cpnt, value, proxy: this.proxy, fields: this.fields, store: this.store });
                this.$emit('value-change', { cpnt: this.cpnt, value, proxy: this.proxy, fields: this.fields, store: this.store });
                if (this.cpnt.store) this.cpnt.store.setShowByRules(this.cpnt);
            })
        },
        changedynamically({ cpnt, value, store, proxy }) {
            let targetVal;
            if (cpnt.data.fid === this.cpnt.data._association) {
                targetVal = value;
            } else if (cpnt.CPNT.componentid === 'asstable' && proxy.valList.length) {
                const isSubList = this.cpnt.data._association.split('_');
                if (isSubList.length > 1) {

                    //目标表单的code
                    const targetCode = isSubList.splice(0, 1);
                    if (targetCode[0] === store.data_code) {
                        const target = store.search({ options: { fid: isSubList.join('_') }, onlyData: true });
                        if (target && target._fieldValue) {
                            targetVal = proxy.valList[proxy.valList.length - 1][target._fieldValue];
                        }
                    }
                }
            }
            if (targetVal) {
                if (this.setDataByIds) {
                    try {
                        if (this.proxy) {
                            const list = this.proxy.list || this.proxy.valList;
                            if (list && list.length) list.splice(0);
                        }
                    } catch (error) {

                    }
                    this.setDataByIds(targetVal.split(','));
                } else if (this.cpnt.componentid === 'checkbox') {
                    this.cpnt.data._proxy.splice(0, this.cpnt.data._proxy.length);
                    this.cpnt.data._proxy.push(...targetVal.split(','))
                } else {
                    this.cpnt.data._val = targetVal
                }
            }
        },
        analyzeDyncKeys(params = []) {
            if (this.cpnt.data._filter && this.cpnt.store) {
                this.cpnt.data._filter.forEach((f) => {
                    if (f.value !== "" || f.sid) {
                        let value = f.value;
                        if (f.sid) {
                            const source = this.cpnt.store.searchByField(f.sid);
                            if (source && source.data._val) {
                                value = source.data._val;
                            } else {
                                value = this.cpnt.store.instance[f.sid];
                            }
                        }
                        if (typeof value !== "undefined") {
                            params.push(`${f.tid}#${value}#${f.op}`);
                        }
                    }
                });
            }
            return params.length ? params.join(";") : '';
        }
    }
};
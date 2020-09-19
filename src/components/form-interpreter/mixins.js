const formulajs = require("@handsontable/formulajs");

export const formulaMixin = {
    computed: {
        numProxy() {
            return this.cpnt.store.search({
                options: { db: true },
                onlyData: true,
                beforePush: item => {
                    if (item.fid === this.cpnt.fid) return false;
                    if (item.parent.CPNT.host_db) return false;
                    return true;
                }
            });
        }
    },
    created() {
        Object.keys(formulajs).forEach(key => {
            window[key] = formulajs[key];
        });
    },
    methods: {
        figure(data) {
            let datasource = this.cpnt.data[this.sourceField || '_datasource'];
            data.forEach(item => {
                let val = item._val;
                //如果是人员或者部门，做特殊处理
                if ((item.componentid === 'user' || item.componentid === 'department')) {
                    if (item._proxy && item._proxy.list.length) {
                        val = item._proxy.list[0][item.componentid === 'user' ? 'user_name' : 'node_display'];
                    }
                }
                datasource = datasource.replace(new RegExp(`@${item.fid}@`, "g"), val);
            });
            try {
                console.log(datasource);
                return eval(datasource);
            } catch (error) {
                console.log(error);
            }
        }
    }
};

export const cpntFix = {
    mixins: [formulaMixin],
    data() {
        return {
            fixValue: '',
            mainCpnts: [],
            asstables: {}
        }
    },
    computed: {
        allFields() {
            let list = []
            for (let key in this.asstables) {
                list = list.concat(this.asstables[key])
            }
            return this.mainCpnts.concat(list);
        }
    },
    methods: {
        startWatch() {
            console.log(123);
            this.$watch("numProxy", {
                deep: true, 
                immediate: true,
                handler() {
                    this.mainCpnts = this.numProxy;
                    this.setFixValue(this.figure(this.allFields))
                }
            });
            this.$on("asstable-selected", ({ cpnt, data, store }) => {
                const astData = data[0] || {};
                this.$set(this.asstables, store.data_code, store
                    .search({ options: { db: true }, onlyData: true })
                    .map((c) => ({ _val: typeof astData[c._fieldValue] !== "undefined" ? astData[c._fieldValue] : "", fid: `${store.data_code}_${c.fid}` })))
                this.setFixValue(this.figure(this.allFields))
            });
        },
        setFixValue(fix) {
            if (typeof fix === 'undefined') return;
            this.fixValue = fix;
        }
    },
};

export const optionFix = {
    mixins: [cpntFix],
    data() {
        return {
            reloading: false,
            fixedOptions: []
        }
    },
    computed: {
        fixable() {
            return this.cpnt.data._prefix && this.cpnt.data._datasource && this.cpnt.data._prefixType;
        }
    },
    created() {
        this.fixedOptions = _.cloneDeep(this.cpnt.data._option);
        if (this.fixable) {
            this.startWatch();
        }
    },
    watch: {
        fixValue() {
            this.fixedOptions.forEach(o => {
                let valChanged = false;
                if (this.cpnt.data._prefixList.indexOf('1') !== -1) {
                    o._fixedName = this.fixable === '1' ? `${this.fixValue}${o._optionName}` : `${o._optionName}${this.fixValue}`;
                }
                if (this.cpnt.data._prefixList.indexOf('2') !== -1) {
                    o._fixedVal = this.fixable === '1' ? `${this.fixValue}${o._optionValue}` : `${o._optionValue}${this.fixValue}`;
                    valChanged = true;
                }
                if (valChanged) {
                    this.proxy = [];
                }
            })
            this.reloading = true;
            this.$nextTick(() => {
                this.reloading = false;
            })
        }
    }
};
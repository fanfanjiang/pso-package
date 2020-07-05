export function pickerMixin({
    baseObjName,
    dataListName = 'list',
    typeName = "type",
    defalutType = "radio",
    idName = 'user_id',
    showName,
    radioVal = 'radio'
}) {
    return {
        data() {
            const data = {
                idName
            };
            if (!baseObjName) {
                baseObjName = "selectionObj";
                data[baseObjName] = {
                    [dataListName]: [],
                    [typeName]: defalutType,
                }
            }
            if (!showName) {
                showName = 'show';
                data[showName] = false;
            }
            return data;
        },
        computed: {
            baseObj() {
                return _.get(this, baseObjName);
            }
        },
        created() {
            this.$watch(`${baseObjName}.${typeName}`, (val) => {
                if (val === radioVal) {
                    this.checkRadio();
                }
            })
        },
        methods: {
            handleAddSelection(data) {
                if (data.length) {
                    this.baseObj[dataListName] = _.uniqBy(this.baseObj[dataListName].concat(data), this.idName);
                    console.log(this.idName);
                    if (this.baseObj[typeName] === radioVal) {
                        this.checkRadio(data[0]);
                    }
                }
                this[showName] = false;
            },
            handleDelSelection(data) {
                this.baseObj[dataListName].splice(_.findIndex(this.baseObj[dataListName], { [this.idName]: data[this.idName] }), 1);
            },
            handleDelList(list) {
                list.forEach(item => this.handleDelSelection(item))
            },
            checkRadio(data) {
                const dataFix = data ? 0 : 1;
                const params = [dataFix, this.baseObj[dataListName].length - dataFix];
                if (data) params.push(data);
                this.baseObj[dataListName].splice(...params);
            },
            resetPicker({ idName, reset = true }) {
                if (reset) this.baseObj[dataListName] = [];
                if (idName) this.idName = idName;
            }
        }
    }
}
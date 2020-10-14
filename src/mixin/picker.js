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
                idName,
                pickerListName: dataListName
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
                    this.baseObj[this.pickerListName] = _.uniqBy(this.baseObj[this.pickerListName].concat(data), this.idName);
                    if (this.baseObj[typeName] === radioVal) {
                        this.checkRadio(data[0]);
                    }
                }
                this[showName] = false;
            },
            handleDelSelection(data) {
                this.baseObj[this.pickerListName].splice(_.findIndex(this.baseObj[this.pickerListName], { [this.idName]: data[this.idName] }), 1);
            },
            handleDelList(list) {
                list.forEach(item => this.handleDelSelection(item))
            },
            checkRadio(data) {
                const dataFix = data ? 0 : 1;
                const params = [dataFix, this.baseObj[this.pickerListName].length - dataFix];
                if (data) params.push(data);
                this.baseObj[this.pickerListName].splice(...params);
            },
            resetPicker({ idName, reset = true, dataListName }) {
                if (dataListName) {
                    this.$set(this.baseObj, dataListName, this.baseObj[dataListName] || []);
                    this.pickerListName = dataListName;
                }
                if (reset) this.baseObj[this.pickerListName] = [];
                if (idName) this.idName = idName;
            }
        }
    }
}
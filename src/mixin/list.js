import { MENU_LEAF_AUTH } from "../const/menu";
import { closest } from "../components/form-designer/drag-drop/utils";
import addEventListener from "../utils/dom/addEventListener";
import { makeFiles } from "../tool/file";
import { genComponentData } from "../components/form-designer/helper";
import PsoFormAttach from "../components/form-interpreter/components/attachment";

//权限视图
export const AuthViewMixin = {
    data() {
        return {
            viewCfg: [],
            authViews: [],
            activeView: 0
        }
    },
    created() {
        //加载菜单配置的权限
        if (this.params.auth_config && this.params.auth_config.length) {
            this.viewCfg = this.params.auth_config;
        }
    },
    methods: {
        loadAuthView(curAuth) {
            //生成权限视图数据
            MENU_LEAF_AUTH.forEach((a) => {
                if ((a.v & curAuth) === a.v) {
                    const viewCfg = _.find(this.viewCfg, { v: a.v });
                    const viewItem = { ...a };
                    if (viewCfg) {
                        if (viewCfg.text) viewItem.n = viewCfg.text;
                        viewItem.field = viewCfg.field;
                    }
                    this.authViews.push(viewItem);
                }
            });
            this.authViews = _.orderBy(this.authViews, ["v"], ["desc"]);
            this.activeView = this.authViews[0].v + "";
        }
    },
}

//表单列表相关通用功能
export const FormListMixin = {
    components: { PsoFormAttach },
    data() {
        this.uploadAPI = '/api/upload/data';
        return {
            cfg: {
                data_code: "",
                data_design: [],
            },
            usedFormCol: '',
            oriColCfg: null,
            oriColData: null,
            fields: [],
            formCode: '',
            clickedRow: null,
            selectedList: [],
            statuses: [],
            stages: [],
            uploadAttach: { data: {} }
        }
    },
    created() {
        this.genUploadCpnt();
    },
    methods: {
        analyzeAvaiableChange(entity, field) {
            const checked = Object.keys(_.groupBy(this.selectedList, field)).map(d => parseInt(d));
            entity.forEach(obj => {
                let available = true;
                for (let item of checked) {
                    console.log(item, entity);
                    const source = _.find(entity, { value: item });
                    if (item === obj.value) {
                        available = false;
                        break;
                    }
                    if (source.target && source.target.indexOf(parseInt(obj.value)) === -1) {
                        available = false;
                        break;
                    }
                }
                this.$set(obj, 'available', available)
            })
        },
        makeRowClass({ row, column, rowIndex, columnIndex }) {
            if (this.clickedRow === row) {
                return 'pso-table-currow'
            }
        },
        analyzeColumn(cfg, defKey) {
            this.oriColCfg = JSON.parse(cfg);
            this.oriColData = this.getFormColumn(cfg, defKey);
            this.fields = _.cloneDeep(this.oriColData).filter((f) => f.using === "1");
        },
        getFormColumn(cfg, defKey) {
            if (typeof cfg === 'string') {
                cfg = JSON.parse(cfg);
            }
            if (Array.isArray(cfg)) {
                return this.$message.error("表单列表配置错误，请重新配置列表参数")
            }
            if (cfg.column.length) {
                if (defKey) {
                    const exist = _.find(cfg.column, { name: defKey });
                    if (exist) {
                        this.usedFormCol = defKey;
                        return exist.data;
                    }
                }
                this.usedFormCol = cfg.column[0].name;
                return cfg.column[0].data;
            } else {
                return []
            }

        },
        handleHeaderDrag(newWidth, oldWidth, column, event) {
            if (this.oriColData) {
                const exist = _.find(this.oriColData, { field_name: column.property });
                if (exist) {
                    exist.width = newWidth;
                }
            }
        },
        async saveColCfg(data_code) {
            if (this.oriColCfg) {
                const index = _.findIndex(this.oriColCfg.column, { name: this.usedFormCol });
                this.oriColCfg.column.splice(index, 1, { data: this.oriColData, name: this.usedFormCol })
                const ret = await this.API.updateFormTree({ data_code: data_code || this.formCode, display_columns: JSON.stringify(this.oriColCfg) });
                this.ResultNotify(ret);
            }
        },
        formatListVal(d, f) {
            let _val = d[f.field_name];
            if ((f.componentid === "select" || f.componentid === "checkbox") && f._option) {
                const opt = _.find(f._option, { _optionValue: _val });
                if (opt) {
                    return opt._optionName;
                }
            }
            //旗帜标签
            if (this.isFlagField(f.field_name) && _val) {
                return _val.split(',').map(color => {
                    return `<span class="tag-flag-box" style="background-color: ${color};"></span>`
                }).join('');

            }

            try {
                if (_val) {
                    _val = _val.replace(/(?:\.0*|(\.\d+?)0+)$/, '$1');
                }
            } catch (error) {

            }

            return this.filterBadVal(_val);
        },
        filterBadVal(val) {
            return _.isNull(val) ? "" : val;
        },
        isFlagField(field) {
            return /\S+_s$/.test(field);
        },
        async getImages(ids) {
            const ret = await this.API.file({ data: { ids }, method: "get" });
            makeFiles({ files: ret.data, urlField: "res_path", nameField: "res_name" });
            return ret.data;
        },
        downloadFormTp() {
            let uploadCfg = this.cfg.export_config;
            if (uploadCfg) {
                if (typeof uploadCfg === 'string') {
                    uploadCfg = JSON.parse(uploadCfg)
                }
                const cfg = uploadCfg.filter(f => f.enable);
                const data = {};
                cfg.forEach(c => {
                    data[c.field] = c.name;
                })
                const sheet = XLSX.utils.json_to_sheet([data], { header: _.map(cfg, 'field'), skipHeader: true });
                const book = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(book, sheet, '模板');
                XLSX.writeFile(book, '模板.xlsx');
            }
        },
        genUploadCpnt() {
            this.uploadAttach.data = genComponentData({ componentid: "attachment", _fieldName: "", _val: "" });
            this.uploadAttach.data._fieldName = "";
        }
    },
}

//表单列表字段修改,需要相应的页面组件支持
export const FormModifierMixin = {
    data() {
        this.modCfg = null;
        this.bodyListener = null;
        this.modStore = null;
        this.handleSaved = null;
        this.modifiedField = '';
        return {
            showModifier: false,
            modInstance: null,
            modifierStyle: {
                top: "0px",
                left: "0px",
            }
        }
    },
    watch: {
        showModifier: {
            handler(val) {
                if (!val) {
                    this.saveModified();
                }
            }
        }
    },
    destroyed() {
        if (this.bodyListener) {
            this.bodyListener.remove();
        }
    },
    mounted() {
        this.bodyListener = addEventListener($("body").get(0), "click", (e) => {
            const isInModifier = closest(e.target, ".modifier");
            if (!isInModifier && this.showModifier) {
                this.showModifier = false;
            }
        });
    },
    methods: {
        initializeModifier(cfg, store, fun) {
            this.modCfg = _.cloneDeep(cfg);
            this.modStore = store;
            this.handleSaved = fun;
        },
        async saveModified() {
            if (this.modInstance) {
                try {
                    const formData = await this.$refs.modifier.makeData();
                    const data = formData.dataArr[0];
                    if (data.leaf_id === this.modInstance.leaf_id && data[this.modifiedField] != this.modInstance[this.modifiedField]) {
                        this.handleSaved && this.handleSaved({ leaf_id: this.dataId, formData });
                    }
                } catch (error) {
                    return null;
                }
            }
        },
        modLoadHandler(store) {
            if (!this.modifiedField) return;
            const cpnt = store.searchByField(this.modifiedField);
            if (cpnt) {
                store._forEach((item) => {
                    if (!item.CPNT.layout && item.data._fieldValue !== this.modifiedField) {
                        item.data._hideForever = true;
                        item.data._autofocus = false;
                    }
                });
                cpnt.data._fieldName = "";
                cpnt.data._autofocus = true;
                cpnt.data._hideForever = false;
                cpnt.data._read = false;
            }
        },
        openModifier(row, field, index) {
            const placeholder = this.$refs[`${index}${field.field_name}`];
            const td = closest(placeholder[0], "td");
            if (!td) return;

            const { top, left, width } = td.getBoundingClientRect();
            this.modifierStyle = {
                top: `${top - 1}px`,
                left: `${left - 1}px`,
                width: `${width}px`,
            };

            this.showModifier = false;
            this.$nextTick(() => {
                let exist = this.modStore.searchByField(field.field_name.replace("_x", ""), true);
                if (!exist) {
                    exist = this.modStore.searchByField(field.field_name.replace("_s", ""), true);
                }
                if (exist) {
                    this.modifiedField = exist._fieldValue;
                    this.modInstance = row;
                    this.showModifier = true;
                }
            });
        }
    }
}
import { MENU_LEAF_AUTH } from "../const/menu";

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
                console.log(a.v, curAuth);
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

//表单列表
export const FormListMixin = {
    data() {
        return {
            usedFormCol: '',
            oriColCfg: null,
            oriColData: null,
            fields: [],
            formCode: ''
        }
    },
    created() {

    },
    methods: {
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
            if (defKey) {
                const exist = _.find(cfg.column, { name: defKey });
                if (exist) {
                    this.usedFormCol = defKey;
                    return exist.data;
                }
            }
            this.usedFormCol = cfg.column[0].name;
            return cfg.column[0].data;
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
        }
    },
}
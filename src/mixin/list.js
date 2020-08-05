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
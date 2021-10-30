import shortid from "shortid";
import { makeDimension } from "../utils/util";
import Auth from "../tool/auth";

export const CaptchaMixin = {
    data() {
        return {
            captchaId: shortid.generate(),
            rules: {
                captcha: [
                    { required: true, message: "请输入图片验证码", trigger: "blur" }
                ]
            }
        }
    },
    computed: {
        captchaUrl() {
            return `${this.APIURL}/captcha?id=${this.captchaId}`;
        }
    },
    methods: {
        reloadCaptcha() {
            this.captchaId = shortid.generate();
        }
    }
}

export const SignInMixin = {
    methods: {
        signIn({ token, user, refresh_token, redirect }, needRedirect = true) {
            this.$store.commit('APP_SIGNIN', { token, user, refresh_token });
            if (needRedirect) {
                redirect = redirect || Auth.getRedirect();
                if (redirect) {
                    this.$router.replace(redirect);
                    Auth.removeRedirect();
                } else {
                    this.$router.push({ name: "desk" });
                }
            }
        }
    }
}

const CONFIG = {
    logo: "/static/app/img/logo.png",
    base: {},
    name: "",
    link: [],
    sites: [],
    sitesTree: [],
    users: [],
    orgs: []
}

export const ConfigMixin = {
    data() {
        return {
            curApp: null,
            appConfig: _.cloneDeep(CONFIG)
        }
    },
    computed: {
        appid() {
            return this.curApp ? this.curApp.site_app : "";
        },
        appName() {
            return this.curApp ? this.curApp.site_name : "";
        }
    },
    methods: {
        reset() {
            this.appConfig = _.cloneDeep(CONFIG);
        },
        async initializeCfg(reset = true) {
            try {
                const ret = await this.API.getSignConfig({ appid: this.appid || this.defAppid });

                reset && this.reset();

                let { data, base, link, users, orgs } = ret.data;

                data = _.orderBy(data, ['cate_order'], ['asc']);

                if (users) {
                    this.appConfig.users = users;
                }
                if (orgs) {
                    this.appConfig.orgs = orgs;
                }

                //处理站点数据，设置默认站点数据
                if (data && data.length) {

                    this.appConfig.sites = data;

                    let group = {};
                    ["cate_name", "sec_name"].forEach((dim) => {
                        group = makeDimension(group, data, dim);
                    });

                    let defTargt;
                    let curTargt;
                    let lockedTarget;

                    for (let key in group) {
                        const first = { site_name: key, site_app: 1, children: [] };
                        for (let subKey in group[key]) {
                            first.children.push({ site_name: subKey, site_app: 1, children: _.orderBy(group[key][subKey], ['site_order'], ['asc']) });

                            for (let subSite of group[key][subKey]) {
                                first.site_type = subSite.site_type;
                                if (this.defAppid && this.defAppid === subSite.site_app) {
                                    lockedTarget = subSite;
                                } else if (this.appid && this.appid === subSite.site_app) {
                                    curTargt = subSite;
                                } else if (subSite.is_default === "1") {
                                    defTargt = subSite;
                                }
                            }
                        }
                        this.appConfig.sitesTree.push(first);
                    }

                    let __target__ = lockedTarget || curTargt || defTargt;
                    if (__target__) {
                        this.selectSite(__target__);
                    }
                }

                //基本配置数据
                if (base) {
                    this.appConfig.base = base;
                    this.appConfig.name = base.map_key0 || "";
                    if (this.appid && base.map_key1) {
                        const logoRet = await this.API.getFielsNoauth({ ids: base.map_key1, appid: this.appid });
                        if (logoRet.data && logoRet.data.length) {
                            this.appConfig.logo = logoRet.data[0].res_path;
                        }
                    }
                    if (base.map_key7 && base.map_key7 !== 'null') {
                        this.$store.state.base.appConfig.theme = base.map_key7;
                    } else {
                        this.$store.state.base.appConfig.theme = this.$store.state.base.appConfig.defTheme;
                    }
                }

                if (link && link.length) {
                    this.appConfig.link = link;
                }

                this.$emit('initialized', this.appConfig);
            } catch (error) {
                console.log(error);
            }
        },
        selectSite(site) {
            this.curApp = site;
            this.$store.commit('APP_SET_APPCONFIG', { appid: this.appid, appName: this.appName, platform: this.appConfig.name })
        }
    }
}

import shortid from "shortid";
import { makeDimension } from "../utils/util";

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
        signIn({ token, user, redirect }, needRedirect = true) {
            this.$store.commit('APP_SIGNIN', { token, user });
            if (needRedirect) {
                if (redirect) {
                    this.$router.replace(redirect);
                } else {
                    this.$router.push({ name: "desk" });
                }
            }
        }
    }
}

export const ConfigMixin = {
    data() {
        return {
            curApp: null,
            appConfig: {
                logo: "/static/app/img/logo.png",
                name: "",
                links: [],
                sites: [],
                sitesTree: [],
                regByPhone: false,
                regByEmail: false
            }
        }
    },
    computed: {
        appid() {
            return this.curApp ? this.curApp.site_app : "";
        },
        appName() {
            return this.curApp ? this.curApp.site_name : "";
        },
        appisproject() {
            return window.__APPCONFIG__ && window.__APPCONFIG__.appisproject;
        }
    },
    methods: {
        async initializeCfg() {
            try {
                const ret = await this.API.getSignConfig();
                const { data, logo, link } = ret.data;

                if (data && data.length) {
                    this.appConfig.sites = data;

                    let group = {};
                    ["cate_name", "sec_name"].forEach((dim) => {
                        group = makeDimension(group, data, dim);
                    });


                    for (let key in group) {
                        const first = { site_name: key, site_app: 1, children: [] };
                        for (let subKey in group[key]) {
                            group[key][subKey].forEach((d) => {
                                if (d.is_default === "1" && this.defAppid ? this.defAppid === d.site_app : true) {
                                    this.selectSite(d);
                                }
                            });
                            first.children.push({ site_name: subKey, site_app: 1, children: group[key][subKey] });
                        }
                        this.appConfig.sitesTree.push(first);
                    }
                }

                if (logo && logo.length) {
                    this.appConfig.name = logo[0].map_key0 || "";
                    this.appConfig.logo = logo[0].map_key1 || "";
                    this.appConfig.regByPhone = logo[0].map_key6 === '1';
                    this.appConfig.regByEmail = logo[0].map_key7 === '1';
                }

                if (link && link.length) {
                    this.appConfig.links = link;
                }

                this.$emit('initialized', { ...ret.data, ...this.appConfig });
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

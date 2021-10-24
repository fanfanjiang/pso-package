import {
    APP_SET_USER,
    APP_GET_USER,
    APP_SIGNOUT,
    APP_SIGNIN,
    APP_MOCKSIGNIN
} from '../mutation-types';

import Storge from '../../utils/storage';
import Auth from "../../tool/auth";
import API from "../../service/api.js";
import { md5 } from "../../utils/md5";
import { listToTree } from "../../utils/util";

export default {
    state: {
        user: null,
        showedWFChartTip: false,
        appConfig: {
            appid: '',
            appName: '',
            platform: '',
            theme: '1B9AEE',
            defTheme: '1B9AEE',
        },
        notify: {
            initialized: false,
            show: false,
            unread: 0
        },
        unapproved: false,
        quickInput: {
            stores: [],
            curStore: null,
        },
        appAuth: { unapproved: false },
        designedForm: '',
        designedWF: '',
        userGenFun: '0',
        menus: []
    },
    mutations: {
        [APP_SET_USER](state, user) {
            state.user = user;
            Storge.set('user', user);
        },
        ['APP_UPDATE_USER'](state, user) {
            if (state.user) {
                Object.assign(state.user, user);
                Storge.set('user', state.user);
            }
        },
        [APP_GET_USER](state) {
            const user = Storge.get('user');
            state.user = user ? JSON.parse(user) : null;
        },
        [APP_SIGNOUT]: (state) => {
            state.user = null;
            Storge.remove('user');
            Auth.removeToken();
        },
        [APP_SIGNIN](state, { token, refresh_token, user }) {
            Auth.setToken(token, refresh_token);
            this.commit(APP_SET_USER, user)
        },
        ['APP_SET_APPCONFIG'](state, data = {}) {
            Storge.set('appconfig', data);
            state.appConfig = { ...state.appConfig, ...data };
        },
        ['APP_GET_APPCONFIG'](state) {
            const data = Storge.get('appconfig');
            if (data) {
                try { state.appConfig = { ...state.appConfig, ...JSON.parse(data) }; } catch (error) { }
            }
        },
        ['APP_APPROVED'](state) {
            state.user.unapproved = false;
            this.commit(APP_SET_USER, state.user)
        },
        ['APP_CHECKUSER'](state, { appid = '' } = {}) {
            this.commit('APP_GET_USER');
            if (state.user && appid && state.user.appid !== appid) {
                this.commit('APP_SIGNOUT');
            }
        },
        ['APP_PUSHSTORE'](state, { store }) {
            state.quickInput.stores.push(store);
            state.quickInput.curStore = store;
        },
        ['APP_POPSTORE'](state) {
            state.quickInput.stores.pop();
            if (state.quickInput.stores.length) {
                state.quickInput.curStore = state.quickInput.stores[state.quickInput.stores.length - 1];
            }
        },
        ['APP_AUTH'](state, data) {
            state.appAuth = data;
        },
    },
    actions: {
        async [APP_MOCKSIGNIN]({ state, getters, commit }, params = {}) {
            const ret = await API.login({ user_pwd: md5("1q2w3e"), username: "tempuser", ...params }, false);
            if (ret.success) {
                commit('APP_SIGNIN', ret.data);
                return true;
            } else {
                return false;
            }
        },
        async ['APP_FORCESIGN']({ state, getters, commit, dispatch }, params = {}) {
            commit('APP_CHECKUSER', params);
            if (!state.user || params.force) {
                return await dispatch("APP_MOCKSIGNIN", { appid: params.appid || "" });
            }
            return true;
        },

        ['APP_MAKEMENU']({ state, getters, commit, dispatch }, { menus, callback, auth }) {
            menus.forEach((item) => {
                const { menu_type, tp_route, menu_code, menu_link } = item;
                if (menu_type === 1 && tp_route) {
                    item.menu_path = tp_route.replace(/:menu_code/g, menu_code);
                } else if (menu_type === 2) {
                    item.menu_path = menu_link;
                }
                if (item.menu_path && state.user) {
                    item.menu_path = item.menu_path.replace(/@uid@/g, state.user.user_id);
                }
                if (callback) {
                    callback(item);
                }
            });
            const menuTree = listToTree({
                list: menus,
                pid: "node_pid",
                id: "node_id",
                afterPush: (node, pnode) => {
                    pnode.children = _.orderBy(pnode.children, ["node_serial", "create_time"], ["asc", "asc"]);
                },
            }).filter((item) => auth ? item.node_auth !== "0" : true);
            state.menus = menus;
            return { menus, menuTree };
        },
        async ['APP_ANALYZEMENU']({ dispatch }, params = {}) {
            const { auth = true, callback } = params;
            const ret = await API.getAllMenu({});
            if (ret.success) {
                const { nav: menus, message: notice } = ret.data;
                const data = dispatch('APP_MAKEMENU', { menus, auth, callback });
                data.notice = notice;
                return data
            }
        }
    }
}

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

export default {
    state: {
        user: null,
        showedWFChartTip: false,
        appConfig: {
            appid: '',
            appName: '',
            platform: '',
            theme: '1B9AEE'
        },
        notify: {
            initialized: false,
            show: false
        }
    },
    mutations: {
        [APP_SET_USER](state, user) {
            state.user = user;
            Storge.set('user', user);
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
        [APP_SIGNIN](state, { token, user }) {
            Auth.setToken(token);
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
        }
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
        }
    }
}

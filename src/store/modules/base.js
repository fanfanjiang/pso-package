import {
    APP_SET_USER,
    APP_GET_USER,
    APP_SIGNOUT,
} from '../mutation-types';

import Storge from '../../utils/storage';
import Auth from "../../tool/auth";

export default {
    state: {
        user: null,
        showedWFChartTip: false
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
        }
    }
}

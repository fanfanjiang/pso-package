import Storge from '../utils/storage';

export default class Auth {

    static isLoggedin() {
        return this.getToken();
    }

    static getToken() {
        return Storge.get('token');
    }

    static getRefreshToken() {
        return Storge.get('refresh_token');
    }

    static setToken(token, refresh_token) {
        Storge.set('token', token);
        if (refresh_token) {
            Storge.set('refresh_token', refresh_token);
        }
    }

    static removeToken() {
        Storge.remove('token');
        Storge.remove('refresh_token');
    }

    static getId() {
        let user = Storge.get('user');
        user = user ? JSON.parse(user) : null;
        return user && user._q_ || '';
    }

    static setRedirect(data) {
        return Storge.set('redirect', data);
    }

    static getRedirect() {
        return Storge.get('redirect');
    }

    static removeRedirect() {
        return Storge.remove('redirect');
    }
}
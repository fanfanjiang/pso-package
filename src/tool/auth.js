import Storge from '../utils/storage';

export default class Auth {
    static isLoggedin() {
        return this.getToken();
    }
    static getToken() {
        return Storge.get('token');
    }
    static setToken(token) {
        Storge.set('token', token);
    }
    static removeToken(){
        Storge.remove('token');
    }
}
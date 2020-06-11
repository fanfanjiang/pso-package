import { Message } from 'element-ui';
import Qs from 'qs';
import axios from 'axios';
import Auth from '../tool/auth';

export default class API {

    URL_PREFIX = ''

    static async  request(url, { method = 'post', data = {} }) {
        url = `${this.URL_PREFIX}${url}`;
        data.appid = 'Main';
        if (method === 'get') {
            url += `?${Qs.stringify(data)}`;
        }
        try {
            if (method === 'delete') data = { data: data };
            const ret = await axios({ method, url, data });
            const message = ret.msg || ret.message;
            if (!ret.success && message) {
                Message({ showClose: true, message, type: 'warning' });
            }
            return ret;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                Message({ showClose: true, message: '登录过期，请重新登录', type: 'warning' });
            } else {
                // Message({ showClose: true, message: '数据请求失败，请稍后再试', type: 'error' })
            }
        }
    }

    static async RESTful(url, { method = 'get', data, idField = 'id' }) {
        let id = data[idField];
        if ((method === 'get' && id) || method === 'put' || method === 'delete') {
            url += `/${id}`
        }
        return await this.request(url, { method, data });
    }

    static async login(data) {
        try {
            return await this.request('/login', { data });
        } catch (error) {
            throw error;
        }
    }

    static async reg(data) {
        try {
            return await this.request('/reg', { data });
        } catch (error) {
            throw error;
        }
    }

    static async sendCode(data) {
        try {
            return await this.request('/code', { data });
        } catch (error) {
            throw error;
        }
    }

    static async checkExist(data) {
        try {
            return await this.request('/checkExist', { data });
        } catch (error) {
            throw error;
        }
    }

    static async regThird(data) {
        try {
            return await this.request('/reg/third', { data });
        } catch (error) {
            throw error;
        }
    }

    static async accessLogin(data) {
        try {
            return await this.request('/access_code', { data });
        } catch (error) {
            throw error;
        }
    }

    static async templates(params) {
        try {
            return await this.RESTful('/api/templates', Object.assign({ idField: 'tp_code' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async trees(params) {
        try {
            return await this.RESTful('/api/tree', Object.assign({ idField: 'node_id' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async formsCfg(params) {
        try {
            return await this.RESTful('/api/formcfg', Object.assign({ idField: 'id' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async form(params) {
        try {
            return await this.RESTful('/api/form', Object.assign({ idField: 'leaf_id' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async formSearch(data) {
        try {
            return await this.request('/api/form-search', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async dict(params) {
        try {
            return await this.RESTful('/api/dict', Object.assign({ idField: 'field_name' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async workflow(params) {
        try {
            return await this.RESTful('/api/workflow', Object.assign({ idField: 'instanceId' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async workflowcfg(params) {
        try {
            return await this.RESTful('/api/workflowcfg', Object.assign({ idField: 'node_id' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async permissionEntries(params) {
        try {
            return await this.RESTful('/api/permissionEntries', Object.assign({ idField: 'body_id' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async file(params) {
        try {
            return await this.RESTful('/api/file', Object.assign({ idField: 'att_id' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async user(params) {
        try {
            return await this.RESTful('/api/user', Object.assign({ idField: 'user_id' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async tag(params) {
        try {
            return await this.RESTful('/api/tag', Object.assign({ idField: 'tag_no' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async resource(params) {
        try {
            return await this.RESTful('/api/resource', Object.assign({ idField: 'leaf_id' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async searchUsers(data) {
        try {
            return await this.request('/api/users/search', { data });
        } catch (error) {
            throw error;
        }
    }

    static async wfFileType(data, method = 'get') {
        try {
            return await this.request('/api/workflowcfg/filetypes', { data, method });
        } catch (error) {
            throw error;
        }
    }

    static async asyncBDA(data) {
        try {
            return await this.request('/api/asyncBDA', { data });
        } catch (error) {
            throw error;
        }
    }

    static async getDsMap(data) {
        try {
            return await this.request('/getDsMap', { data });
        } catch (error) {
            throw error;
        }
    }

    static async getCommonData(data) {
        try {
            return await this.request('/getCommonData', { data });
        } catch (error) {
            throw error;
        }
    }

    static async getCommonType(data) {
        try {
            return await this.request('/api/common-type', { data });
        } catch (error) {
            throw error;
        }
    }

    static async getTreeNode(data) {
        try {
            return await this.request('/api/tree/node', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async getOrgs(type, data) {
        try {
            return await this.request(`/api/organization/${type}`, { data });
        } catch (error) {
            throw error;
        }
    }

    static async updateWfTable(data) {
        try {
            return await this.request('/api/workflowcfg/table', { data, method: 'put' });
        } catch (error) {
            throw error;
        }
    }

    static async getArea(data) {
        try {
            return await this.request('/api/common/area', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async getFormNumber(data) {
        try {
            return await this.request('/api/form/number', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async getTagAttribute(data) {
        try {
            return await this.request('/api/tag/attribute', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async updateTag(data) {
        try {
            return await this.request('/api/tag/attribute', { data, method: 'put' });
        } catch (error) {
            throw error;
        }
    }

    static async getTagLeafData(data) {
        try {
            return await this.request('/api/tag/leaf', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async getFormTree() {
        try {
            const ret = await this.trees({ data: { appid: 'Main', dimen: "3" } });
            return ret.data.tagtree.filter(node => node.is_leaf);
        } catch (error) {
            throw error;
        }
    }

    static async getTempleteTree() {
        try {
            const ret = await this.trees({ data: { appid: 'Main', dimen: "4" } });
            return ret.data.tagtree.filter(node => [0, 1, 2].includes(node.tp_type) && node.is_leaf);
        } catch (error) {
            throw error;
        }
    }

    static async getWfTree() {
        try {
            const ret = await this.trees({ data: { appid: 'Main', dimen: 7 } });
            return ret.data.tagtree.filter(node => node.is_leaf);
        } catch (error) {
            throw error;
        }
    }

    static async getOrgTree() {
        try {
            const ret = await this.trees({ data: { appid: 'Main', dimen: 2 } });
            return ret.data.tagtree.filter(node => node.is_leaf);
        } catch (error) {
            throw error;
        }
    }

    static async getFlowTrash(data = {}) {
        try {
            return await this.request('/api/workflow/trash', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async getFormDict(data = {}) {
        try {
            return await this.request('/api/form/dict', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async updateNodeAuth(data = {}) {
        try {
            return await this.request('/api/tree/auth', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async getNodeAuth(data = {}) {
        try {
            return await this.request('/api/tree/auth', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async getBar(data = {}) {
        try {
            return await this.request('/api/common/bar', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async getMenuInfo(data = {}) {
        try {
            return await this.request('/api/tree/menu', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async updateMenu(data = {}) {
        try {
            return await this.request('/api/tree/menu', { data, method: 'put' });
        } catch (error) {
            throw error;
        }
    }

    static async updateFormTree(data = {}) {
        try {
            return await this.request('/api/tree/form', { data, method: 'put' });
        } catch (error) {
            throw error;
        }
    }

    static async getFormInfo(data = {}) {
        try {
            return await this.request('/api/tree/form', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async getTreeDimen(data = {}) {
        try {
            return await this.request('/api/tree/dimen', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async updateTreeDimen(data = {}) {
        try {
            return await this.request('/api/tree/dimen', { data, method: 'put' });
        } catch (error) {
            throw error;
        }
    }

    static async getTreeTrash(data = {}) {
        try {
            return await this.request('/api/tree/trash', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async updateTreeTrash(data = {}) {
        try {
            return await this.request('/api/tree/trash', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async getTreeWf(data = {}) {
        try {
            return await this.request('/api/tree/wf', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async updateWfAgent(data = {}) {
        try {
            return await this.request('/api/workflowcfg/agent', { data, method: 'put' });
        } catch (error) {
            throw error;
        }
    }

    static async updateUnit(data = {}) {
        try {
            return await this.request('/api/tag/unit', { data, method: 'put' });
        } catch (error) {
            throw error;
        }
    }
}

//请求拦截器
axios.interceptors.request.use((config) => {
    //添加token
    var token = Auth.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
    if (response.status === 200) {
        return Promise.resolve(response.data);
    } else {
        return Promise.reject(response);
    }
}, (error) => {
    if (error.response && error.response.status === 401) {
        API.handleAuthError && API.handleAuthError();
    }
    return Promise.reject(error);
});
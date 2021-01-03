import { Message } from 'element-ui';
import Qs from 'qs';
import axios from 'axios';
import Auth from '../tool/auth';

export default class API {

    static URL_PREFIX = ''

    static xssFilter = false

    static PSODOMPurify = false

    static async request(url, { method = 'post', data = {}, headers = {}, showMsg = true }) {
        url = `${this.URL_PREFIX}${url}`;
        if (this.xssFilter) {
            for (let key in data) {
                if (data[key] && typeof data[key] === 'string') {
                    data[key] = this.PSODOMPurify.sanitize(data[key]);
                }
            }
        }
        if (method === 'get') {
            url += `?${Qs.stringify(data)}`;
        }
        try {
            if (method === 'delete') data = { data: data };
            const ret = await axios({ method, url, data, headers });
            const message = ret.msg || ret.message;
            if (showMsg && !ret.success && message && ret.tag !== 99) {
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

    static async login(data, showMsg = true) {
        try {
            return await this.request('/login', { data, showMsg });
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

    static async getAllMenu(data) {
        try {
            return await this.request('/api/tree/menu-all', { data, method: 'get' });
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

    static async apicfg(params) {
        try {
            return await this.RESTful('/api/apicfg', Object.assign({ idField: 'api_id' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async apiauth(params) {
        try {
            return await this.RESTful('/api/apiauth', Object.assign({ idField: 'auth_id' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async updateWfStatus(data) {
        try {
            return await this.request('/api/workflow/status', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async getWfStatus(data) {
        try {
            return await this.request('/api/workflow/status', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async updateWfAttach(data) {
        try {
            return await this.request('/api/workflow/attach', { data, method: 'put' });
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

    static async message(params) {
        try {
            return await this.RESTful('/api/message', Object.assign({ idField: 'leaf_id' }, params));
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

    static async resetUser(data) {
        try {
            return await this.request('/api/user/reset', { data, method: 'put' });
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

    static async getTagAttribute(data, options = {}) {
        try {
            return await this.request('/api/tag/attribute', { data, method: 'get', ...options });
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
            const ret = await this.trees({ data: { dimen: "3" } });
            return ret.data.tagtree.filter(node => node.is_leaf);
        } catch (error) {
            throw error;
        }
    }

    static async getTempleteTree(type = [0, 1, 2, 3, 4, 5]) {
        try {
            const ret = await this.trees({ data: { dimen: "4" } });
            return ret.data.tagtree.filter(node => type.includes(node.tp_type) && node.is_leaf);
        } catch (error) {
            throw error;
        }
    }

    static async getWfTree() {
        try {
            const ret = await this.trees({ data: { dimen: 7 } });
            return ret.data.tagtree.filter(node => node.is_leaf);
        } catch (error) {
            throw error;
        }
    }

    static async getOrgTree() {
        try {
            const ret = await this.trees({ data: { dimen: 2 } });
            return ret.data.tagtree.filter(node => node.is_leaf);
        } catch (error) {
            throw error;
        }
    }

    static async getMenuTree(cb) {
        try {
            const ret = await this.trees({ data: { dimen: 1 } });
            return ret.data.tagtree.filter(node => node.is_leaf && (cb ? cb(node) : 1));
        } catch (error) {
            throw error;
        }
    }

    static async getWfTimeline(data) {
        try {
            return await this.request('/api/workflow/timeline', { data, method: 'get' });
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

    static async updateCommonAuth(data = {}) {
        try {
            return await this.request('/api/tree/common-auth', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async getCommonAuth(data = {}) {
        try {
            return await this.request('/api/tree/common-auth', { data, method: 'get' });
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

    static async getFormStatus(data = {}) {
        try {
            return await this.request('/api/form/status', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }


    static async updateFormStatus(data = {}) {
        try {
            return await this.request('/api/form/status', { data, method: 'put' });
        } catch (error) {
            throw error;
        }
    }

    //获取字段权限
    static async getFieldAuth(data = {}) {
        try {
            return await this.request('/api/form/auth', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    //设置字段权限
    static async updateFieldAuth(data = {}) {
        try {
            return await this.request('/api/form/auth', { data, method: 'put' });
        } catch (error) {
            throw error;
        }
    }

    //设置字段权限
    static async updateFormStage(data = {}) {
        try {
            return await this.request('/api/form/stage', { data, method: 'put' });
        } catch (error) {
            throw error;
        }
    }

    static async getPscriptData(data = {}) {
        try {
            return await this.request('/api/form/script', { data, method: 'post', showMsg: false });
        } catch (error) {
            throw error;
        }
    }

    static async getWechatConfig(data = {}) {
        try {
            return await this.request('/api/common/wechat', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async uploadTempPdf(file) {
        try {
            const data = new FormData();
            data.append("file", file);
            return await this.request('/api/upload/temppdf', { data, method: 'post', headers: { 'Content-Type': 'multipart/form-data' } });
        } catch (error) {
            throw error;
        }
    }

    static async getStatisticData(data) {
        try {
            return await this.request('/api/templates/statistics', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async debugSQLScript(data) {
        try {
            return await this.request('/api/sql/debug', { data, method: 'post', showMsg: false });
        } catch (error) {
            throw error;
        }
    }

    static async getPluginGroup(data) {
        try {
            return await this.request('/api/templates/group', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async getPluginColumn(data) {
        try {
            return await this.request('/api/templates/column', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async asyncIApiDataManually(data) {
        try {
            return await this.request('/api/form/api-data', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async getSignConfig(data) {
        try {
            return await this.request('/sign/config', { data, method: 'get', showMsg: false });
        } catch (error) {
            throw error;
        }
    }

    static async getSites(data) {
        try {
            return await this.request('/api/sys/site', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async updateSite(data) {
        try {
            return await this.request('/api/sys/site', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async getPluginModules(data) {
        try {
            return await this.request('/api/templates/module', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async addOrUpdatePluginModule(data, showMsg = true) {
        try {
            return await this.request('/api/templates/module', { data, method: 'post', showMsg });
        } catch (error) {
            throw error;
        }
    }

    static async getPluginModuleColumn(data) {
        try {
            return await this.request('/api/templates/module/column', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async getPluginModuleData(data) {
        try {
            return await this.request('/api/templates/module/data', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async addOrUpdatePaper(data) {
        try {
            return await this.request('/api/paper', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async addOrUpdatePaper(data) {
        try {
            return await this.request('/api/paper', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async doActionScript(data) {
        try {
            return await this.request('/api/form/action/script', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async downloadZipFiles(data) {
        try {
            return await this.request('/api/file/zip-files', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async getSysConfigNoauth(data) {
        try {
            return await this.request('/sys/config', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async getFielsNoauth(data) {
        try {
            return await this.request('/files', { data, method: 'get' });
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
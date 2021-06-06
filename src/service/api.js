import { Message } from 'element-ui';
import Qs from 'qs';
import axios from 'axios';
import Auth from '../tool/auth';
import { sm2 } from '../../lib/sm';

const excluded = [];
const publicKey = '04c20130e6b102e5f61c7a95236e1be87df7352d7994448211572c6124577d124d11fefb311a990586fdece1b9ceb76621f4cee23cf933ec8a88a63ab0e784e7f9';
const privateKey = 'c915c4e26ccbb156271b2f56cfd3e589b7fd388253033380b0027f5f39cc4cdf';

export default class API {

    static encryptRequired = false

    static URL_PREFIX = ''

    static xssFilter = false

    static PSODOMPurify = false

    static refreshing = false

    static cachedFun = [];

    static doAuthError() {
        this.handleAuthError && this.handleAuthError();
        Message({ showClose: true, message: '登录过期，请重新登录', type: 'warning' });
    }

    static doEncrypt(data) {
        try {
            if (typeof data !== 'string') {
                data = JSON.stringify(data);
            }
            return sm2.doEncrypt(data, publicKey, 1);
        } catch (error) { }
        return data;
    }

    static async request(url, { method = 'post', data = {}, headers = {}, showMsg = false }) {
        const _arguments = arguments;
        url = `${this.URL_PREFIX}${url}`;

        if (this.xssFilter) {
            for (let key in data) {
                if (data[key] && typeof data[key] === 'string') {
                    data[key] = this.PSODOMPurify.sanitize(data[key]);
                }
            }
        }

        if (method === 'get') {
            data = Qs.stringify(data);
        }

        if (window.__APPCONFIG__ && window.__APPCONFIG__.encryptRequired) {
            headers['encrypt-required'] = true;
            data = { data: this.doEncrypt(data) };
        }

        if (method === 'get') {
            if (typeof data !== 'string') {
                data = Qs.stringify(data);
            }
            url += `?${data}`;
        }

        try {
            const ret = await axios({ method, url, data, headers });

            const message = ret.msg || ret.message;
            if (showMsg && !ret.success && message && ret.tag !== 99) {
                Message({ showClose: true, message, type: 'warning' });
            }

            return ret;

        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    const rft = Auth.getRefreshToken();
                    if (rft) {

                        const oriRequest = new Promise((resolve) => {
                            this.cachedFun.push(async () => {
                                resolve(this.request(..._arguments));
                            });
                        })

                        if (!this.refreshing) {
                            this.refreshing = true;
                            const refreshRet = await this.request('/refresh', { data: { rft } });
                            if (refreshRet && refreshRet.success) {
                                Auth.setToken(refreshRet.data.token);
                                this.refreshing = false;
                                while (this.cachedFun.length) {
                                    const fun = this.cachedFun.shift();
                                    fun();
                                }
                            } else {
                                this.doAuthError();
                            }
                        }

                        return oriRequest;
                    }
                    this.doAuthError();
                }

                if (error.response.status === 404) {
                    Message({ showClose: true, message: "网络繁忙，请稍后再试", type: 'warning' });
                }
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

    static async searchForm(data) {
        try {
            return await this.request('/api/form/data/data', { data, method: 'post' });
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

    static async notification(params) {
        try {
            return await this.RESTful('/api/notification', Object.assign({ idField: 'msg_id' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async ftrcfg(params) {
        try {
            return await this.RESTful('/api/ftrcfg', Object.assign({ idField: 'solr_id' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async tagtree(params) {
        try {
            return await this.RESTful('/api/tagtree', Object.assign({ idField: 'tag_no' }, params));
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

    static async dbtable(params) {
        try {
            return await this.RESTful('/api/dbtable', Object.assign({ idField: 'auto_no' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async schedule(params) {
        try {
            return await this.RESTful('/api/schedule', Object.assign({ idField: 'job_id' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async dbmodel(params) {
        try {
            return await this.RESTful('/api/dbmodel', Object.assign({ idField: 'struct_id' }, params));
        } catch (error) {
            throw error;
        }
    }

    static async approval(params) {
        try {
            return await this.RESTful('/api/approval', Object.assign({ idField: 'auto_no' }, params));
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

    static async getFormTree(params) {
        try {
            const data = { dimen: "3" };
            if (params) {
                Object.assign(data, params)
            }
            const ret = await this.trees({ data });
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
            return await this.request('/api/form/data/dict', { data, method: 'get' });
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
            return await this.request('/api/form/data/status', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }


    static async updateFormStatus(data = {}) {
        try {
            return await this.request('/api/form/data/status', { data, method: 'put' });
        } catch (error) {
            throw error;
        }
    }

    //获取字段权限
    static async getFieldAuth(data = {}) {
        try {
            return await this.request('/api/form/field/auth', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    //设置字段权限
    static async updateFieldAuth(data = {}) {
        try {
            return await this.request('/api/form/field/auth', { data, method: 'put' });
        } catch (error) {
            throw error;
        }
    }

    //设置字段权限
    static async updateFormStage(data = {}) {
        try {
            return await this.request('/api/form/data/stage', { data, method: 'put' });
        } catch (error) {
            throw error;
        }
    }

    static async getPscriptData(data = {}) {
        try {
            return await this.request('/api/form/cpnt/script', { data, method: 'post', showMsg: false });
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

    static async upload({ file, fileName = '', data = {}, api }) {
        try {
            const formData = new FormData();
            formData.append("file", file);
            for (let key in data) {
                formData.append(key, data[key], fileName);
            }
            return await this.request(api, { data: formData, method: 'post', headers: { 'Content-Type': 'multipart/form-data' } });
        } catch (error) {
            throw error;
        }
    }

    static async uploadTempPdf(file) {
        try {
            return await this.upload({ file, api: '/api/upload/temppdf' });
        } catch (error) {
            throw error;
        }
    }

    static async makeTempPdf(data) {
        try {
            return await this.request('/api/pdf/new', { data, method: 'post' });
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
            return await this.request('/api/form/data/api-data', { data, method: 'post' });
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

    static async getColumnBySql(data) {
        try {
            return await this.request('/api/sql/column', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async getDataRelation(data) {
        try {
            return await this.request('/api/form/data/relation', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async getSysConfig(data) {
        try {
            return await this.request('/api/sys/config', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async getNtfyCategory(data) {
        try {
            return await this.request('/api/notification/category', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async getFTR(data) {
        try {
            return await this.request('/api/ftr/data', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async wipeData(data) {
        try {
            return await this.request('/api/form/data/data', { data, method: 'delete' });
        } catch (error) {
            throw error;
        }
    }

    static async wipeDataAll(data) {
        try {
            return await this.request('/api/form/data/all', { data, method: 'delete' });
        } catch (error) {
            throw error;
        }
    }

    static async asyncDBTable(data) {
        try {
            return await this.request('/api/dbtable/data/sync', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async addOrUpdatePaper(data) {
        try {
            return await this.request('/api/feature/paper', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async getPapers(data) {
        try {
            return await this.request('/api/feature/paper', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async getScheduleTriggers(data) {
        try {
            return await this.request('/api/schedule-trigger', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async addOrUpdateScheduleTrigger(data) {
        try {
            return await this.request('/api/schedule-trigger', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async getFTRModulesData(data) {
        try {
            return await this.request('/api/ftr/subdata', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async getFTRModulesCfg(data) {
        try {
            return await this.request('/api/ftrcfg/cfg/modules', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async addOrUpdateFTRModule(data) {
        try {
            return await this.request('/api/ftrcfg/cfg/module', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async publishFTRCfg(data) {
        try {
            return await this.request('/api/ftrcfg/cfg/publish', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async siteLevel(data, method) {
        try {
            return await this.request('/api/sitelevel', { data, method });
        } catch (error) {
            throw error;
        }
    }

    static async sitebranch(data, method) {
        try {
            return await this.request('/api/sitebranch', { data, method });
        } catch (error) {
            throw error;
        }
    }

    static async updateFormCode(data) {
        try {
            return await this.request('/api/formcfg/prop/code', { data, method: 'put' });
        } catch (error) {
            throw error;
        }
    }

    static async approve(data) {
        try {
            return await this.request('/api/approval/approve', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async getSysData(data) {
        try {
            return await this.request('/api/sys/data', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }

    static async syncUsers(data) {
        try {
            return await this.request('/api/users/action/sync', { data, method: 'post' });
        } catch (error) {
            throw error;
        }
    }

    static async executeSQLScript(data, showMsg) {
        try {
            return await this.request('/api/sql/execute', { data, method: 'post', showMsg });
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
        // if (response.headers['encrypt-required'] === 'required' && response.data.data) {
        //     console.log(response.data.data);
        //     const decrypted = sm2.doDecrypt(response.data.data, privateKey, 1);
        //     response.data = JSON.parse(decrypted);
        // }
        if (response.data && response.data['__auth__']) {
            API.handleAppAuth && API.handleAppAuth(response.data['__auth__']);
        }
        return Promise.resolve(response.data);
    } else {
        return Promise.reject(response);
    }
}, (error) => {
    return Promise.reject(error);
});
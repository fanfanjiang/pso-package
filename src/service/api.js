import { Message } from 'element-ui';
import Qs from 'qs';
import axios from 'axios';
import Auth from '../tool/auth';

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

export default class API {

    URL_PREFIX = ''

    static async  request(url, { method = 'post', data = {} }) {
        url = `${this.URL_PREFIX}${url}`;
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
            console.log(error);
            if (error.response && error.response.status === 401) {
                Message({ showClose: true, message: '登录过期，请重新登录', type: 'warning' });
            } else {
                Message({ showClose: true, message: '数据请求失败，请稍后再试', type: 'error' })
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

    static async getFileTypes(data) {
        try {
            return await this.request('/api/workflowcfg/filetypes', { data, method: 'get' });
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
            return await this.request('/api/tree/node', { data });
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

    static async getTagLeafData(data) {
        try {
            return await this.request('/api/tag/leaf', { data, method: 'get' });
        } catch (error) {
            throw error;
        }
    }
}

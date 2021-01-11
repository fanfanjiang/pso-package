import API from "../../service/api.js";
import dayjs from "dayjs";
import { listToTree } from "../../utils/util";

export default class Notify {
    constructor(options) {

        this.$vue = {};
        this.fetching = false;
        this.updating = false;
        this.showExecutor = false;

        this.curInstance = {
            code: "",
            name: "",
            instance_id: ''
        }
        this.dataTotal = 0;
        this.instances = [];
        this.categorys = [];
        this.catTree = [];
        this.curCat = null;
        this.pagination = { limit: 20, start: 0 };
        this.unreadable = false;

        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option];
            }
        }
    }

    get unread() {
        return this.instances.filter(d => d.msg_status === 0).length;
    }

    setCurCat(data) {
        this.curCat = data;
    }

    async getCategory() {
        const ret = await API.getNtfyCategory();
        this.categorys = (await API.getSysConfig({ keys: JSON.stringify({ config_type: { value: '9,10', type: 4 } }) })).data;
        this.catTree = listToTree({
            list: this.categorys, pid: 'map_key1', id: "map_key0", each: (item) => {
                const exist = _.find(ret.data.tree, { sub_name: item.map_key2 });
                if (exist) {
                    this.$vue.$set(item, 'count', exist.total);
                }
            }
        });
    }

    async fetchByCat(data) {
        this.setCurCat(data);
        this.unreadable = false;
        await this.refresh();
    }

    async fetchUnread() {
        this.setCurCat(null);
        this.unreadable = true;
        await this.refresh();
    }

    async refresh() {
        this.pagination.start = 0;
        await this.fetch();
    }

    async fetch() {
        this.fetching = true;
        const params = { ...this.pagination };
        if (typeof params.keys === 'undefined') {
            params.keys = {}
        }
        if (this.curCat) {
            params.keys['msg_sub_type'] = { value: this.curCat.map_key0, type: 1 }
        }
        if (this.unreadable) {
            params.keys['msg_status'] = { value: 0, type: 1 };
        }
        if (params.keys) {
            params.keys = JSON.stringify(params.keys);
        }
        const ret = await API.notification({ data: params });
        if (ret.success) {
            if (ret.data && ret.data.data) {
                this.instances = ret.data.data;
            }
            this.dataTotal = ret.data.page;
        }
        this.fetching = false;
    }

    async update(data) {
        this.updating = true;
        const { msg_id, rec_id } = data;
        const ret = await API.notification({ data: { msg_id, rec_id, rec_type: 1, act_time: dayjs().format('YYYY-MM-DD HH:mm:ss') }, method: 'put' });
        if (ret.success) {
            data.msg_status = 1;
        }
        this.updating = false;
    }

    async checkAction(data) {
        const { msg_url, data_id } = data;

        if (msg_url && !data_id) {
            return window.open(`${msg_url}`);
        }

        if (!data_id) return;
        if (msg_url) {
            let url = '';
            const menuRet = await API.getTreeNode({ code: msg_url });
            if (menuRet.success && menuRet.data.data) {
                const { menu_type, menu_code, menu_link } = menuRet.data.data;
                if (menu_type === 2) {
                    url = menu_link;
                } else if (menu_type === 1) {
                    const ret = await API.getTreeNode({ code: menu_link });
                    if (ret.success && ret.data.data) {
                        const { tp_route } = ret.data.data;
                        if (tp_route) {
                            url = tp_route.replace(/:menu_code/g, menu_code);
                        }
                    }
                }
            }
            if (url) {
                return window.open(`${url}?insttogo=${data_id}`);
            }
        }

        const ret = await API.getDataRelation({ data_id });
        if (ret.success && ret.data && ret.data.wf_code) {
            const code = ret.data.wf_code;
            const customWf = (await API.getSysConfig({ keys: JSON.stringify({ config_type: { value: 14, type: 1 } }) })).data;
            const exist = _.find(customWf, { map_key1: code });
            if (exist && exist.map_key2) {
                return window.open(`${exist.map_key2}?insttogo=${data_id}`);
            }

            this.curInstance = { code, name: '', instance_id: data_id };
            this.showExecutor = true;
        }
    }
}
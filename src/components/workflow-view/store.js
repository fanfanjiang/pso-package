import FVStore from '../form-view/store'
import API from '../../service/api'

export default class WFVStore extends FVStore {
    constructor(options) {
        super({
            cpntText: {
                add: "新增",
                change: "更改",
                stage: "更改阶段",
                copy: "复制",
                backout: "撤销",
                archive: "归档",
            },
            ...options
        });

        this.wfCfg = null;

        this.wfStatuses = [];
        this.curWfStatus = undefined;

        this.lastOp = '';
    }

    async initialize(id, usedColumn) {
        this.initializing = true;

        const ret = await API.workflowcfg({ data: { node_id: id, auth: 1, extendForm: 1 } });
        if (!ret.success) return this.$vue.ResultNotify(ret);

        const { formCfg } = ret.data;
        delete ret.data.formCfg;

        this.analyzeFormCfg(formCfg, usedColumn);

        this.wfCfg = ret.data;
        const { opAuth } = this.wfCfg;

        if (opAuth) {
            this.opAuth = opAuth.leaf_auth;
        }

        await this.fetchStatus();

        this.initializing = false;
    }

    makeWfStatus(data) {
        data.forEach((d) => {
            d.name = d.status_name;
            d.value = d.instance_status;
            if (d.instance_status === 7) d.name = this.cpntText.backout;
            if (d.instance_status === 9) d.name = this.cpntText.archive;
        });
        return _.orderBy(data, ["instance_status"], ["asc"]);
    }

    async fetchStatus() {
        this.starting = true;

        const params = {
            wf_code: this.wfCfg.wf_code,
            keys: JSON.stringify({ ...this.defaultKeys }),
            leaf_auth: this.activeView,
            dict_type: this.usedFormCol,
        };

        this.appendSearchType(params);

        const ret = await API.getWfStatus(params);

        if (ret.success && ret.data) {

            this.wfStatuses = this.makeWfStatus(ret.data);

            const status = _.find(this.wfStatuses, { instance_status: this.lastOp });

            this.fetchCuzFastSwtich('curWfStatus', 'd_audit', status, 'instance_status');
        }

        this.starting = false;
    }

    async fetch() {
        this.fetching = true;

        const data = this.getFetchParams();
        data.wf_code = this.wfCfg.wf_code;

        const ret = await API.workflow({ data, method: "get" });

        if (ret.success) {
            this.instances = ret.data.data;
            this.dataTotal = ret.data.page;
            this.summary = ret.data.sum || null;
            this.$vue.$emit("data-loaded", this.instances);
        }
        console.log(this.summary);

        this.fetching = false;
    }

    async changeStatus(data) {
        await this.makeChange({ data, api: 'updateFormStatus', type: 'status', field: 'd_status', extend: { wf_code: this.wfCfg.wf_code } });
    }
}
import FVStore from '../form-view/store'
import API from '../../service/api'
import { REVIEW_STATUS, REVIEW_OP_TYPE } from "../../const/workflow";

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

        this.copying = false;
        this.lastOp = '';
    }

    get backoutable() {
        return this.selectedList.length ? this.selectedList.every((d) => [REVIEW_STATUS.submited.value, REVIEW_STATUS.reject.value, REVIEW_STATUS.pass.value].includes(d.d_audit)) : false;
    }

    get archiveable() {
        return this.selectedList.length ? this.selectedList.every((d) => d.d_audit === REVIEW_STATUS.pass.value) : false;
    }

    get opBackoutable() {
        return (this.opAuth & 8) === 8;
    }

    get opArchiveable() {
        return (this.opAuth & 16) === 16;
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

            await this.fetchCuzFastSwtich('curWfStatus', 'd_audit', status, 'instance_status');
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

        this.fetching = false;
        this.fixLayout();
    }

    async changeStatus(data) {
        await this.makeChange({ data, api: 'updateFormStatus', type: 'status', field: 'd_status', extend: { wf_code: this.wfCfg.wf_code } });
    }

    async changeStage(data) {
        await this.makeChange({ data, api: 'updateFormStage', type: 'stage', field: 'd_stage', extend: { wf_code: this.wfCfg.wf_code } });
    }

    copyInstance() {
        if (this.selectedList.length !== 1) {
            return this.$vue.$message("请先选择一条要复制的数据");
        }
        this.copying = true;
        this.curInstance = this.selectedList[0];
        this.showExecutor = true;
    }

    showInstance(row) {
        this.copying = false;
        this.curInstance = row;
        Vue.nextTick(() => {
            this.showExecutor = true;
        });
    }

    handleExcuted(data) {
        const { optype, status } = data;
        if (optype === REVIEW_OP_TYPE.confirm.type) {
            this.lastOp = REVIEW_STATUS.submited.value;
        } else if (optype === REVIEW_OP_TYPE.confirm.type && status === REVIEW_STATUS.backout.value) {
            this.lastOp = REVIEW_STATUS.submited.value;
        } else {
            this.lastOp = 0;
        }
        this.fetchStatus();
        this.showExecutor = false;
        this.$vue.$emit('executor-executed', data)
    }

    async handleBackout() {
        await this.changeWFStatus('backout', 'delete');
    }

    async handleArchive() {
        await this.changeWFStatus('archive', 'file');
    }

    async changeWFStatus(type, optype) {
        const value = REVIEW_STATUS[type].value;
        await this.makeChange({
            data: { value },
            api: 'updateWfStatus',
            type,
            field: 'instance_status',
            ids: 'instance_id',
            extend: { wf_code: this.wfCfg.wf_code, optype }
        });
        this.lastOp = value;
    }
}
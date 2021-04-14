import { judgeByRules } from '../../tool/form';
import API from '../../service/api'
import Action from './action';
import FormStore from "../form-designer/model/store.js";

//动作
export default class ActionMGR {

    constructor(options) {

        this.actions = [];
        this.actionsMap = {};
        this.actioning = null;
        this.fieldsRule = [];

        for (let op in options) {
            if (options.hasOwnProperty(op) && typeof options[op] !== 'undefined') {
                this[op] = options[op];
            }
        }
    }

    async addActions({ code, actionIds, actions, formStore, trans }) {
        if (code && !formStore) {
            const ret = await API.formsCfg({ data: { id: code }, method: "get" });
            if (!ret.success) return;
            formStore = new FormStore({ ...ret.data, options: { designMode: false } });

            if (!data) {
                const { data_button } = ret.data;
                if (!data_button) {
                    return;
                }
                actions = JSON.parse(data_button);
            }
        }

        if (!actions) {
            return;
        }

        if (actionIds) {
            actions = actions.filter(act => actionIds.includes(act.id));
        }

        for (let act of actions) {
            const action = new Action({ trans, formStore, ...act });
            this.actions.push(action);
        }
    }

    setActionEmpty() {
        this.fieldsRule = [];
        this.actioning = null;
        this.emptyAction && this.emptyAction();
    }


    checkActionable(action, data) {
        const { method, batchable, rule } = action;
        if (method !== '3') {
            if (batchable === '1' && data.length !== 1) {
                return false;
            }
            if (batchable === '2' && !data.length) {
                return false;
            }
        }
        if (method === '2' && rule.length) {
            action.transform(data);
            return this.checkActionableByRule({ action, data });
        }
        return true;
    }

    checkActionableByRule({ action: ruleOptions, data: datas }) {
        return judgeByRules({ datas, ruleOptions, store: ruleOptions.formStore });
    }

    async doActionScript({ action, data, flag = 'scriptable', btn_type = '1', emit = true, evt = "actioned" }) {
        if (!action[flag]) return true;
        const ret = await API.doActionScript({ btn_id: action.id, btn_type, data_code: action._code, data });
        this.$vue.ResultNotify(ret);
        if (emit) {
            this.$vue.$emit(evt, { data })
        }
        return ret ? ret.success : true;
    }

    async checkActionScript(action, data) {
        return await this.doActionScript({ action, data });
    }

    async checkBefActionScript({ op, formData }) {
        const action = this.actioning;
        if ((op === 2 || op === 1) && action && action.befSaveScriptable) {
            return await this.doActionScript({ action, data: formData.dataArr, flag: 'befSaveScriptable', btn_type: '2', evt: "befactioned" });
        }
        return true;
    }

    checkActionLink(action, data) {
        const { linkable, openLink, bindPlugin, linkParams } = action;
        if (linkable && openLink) {
            let link = openLink;
            if (bindPlugin) {
                link = link.replace(':plug_code', bindPlugin);
            }
            if (linkParams && linkParams.length) {
                for (let d of data) {
                    let itemLink = link;
                    const params = {};
                    for (let field of linkParams) {
                        itemLink = itemLink.replace(`:${field}`, d[field]);
                        params[field] = d[field];
                    }
                    window.open(`${itemLink}?${Qs.stringify(params)}`);
                }
            } else {
                window.open(link);
            }
        }
    }

    async checkAction({ action, data = [] }) {

        const { mode, method, fields = {}, beforeScriptable, batchable } = action;

        action.doing = true;
        action.transform(data);

        this.setActionEmpty();

        //查看是否满足使用条件
        if (!this.checkActionableByRule({ action, data })) {
            return this.$vue.$message({ message: '不满足执行条件', type: 'warning' });
        }

        //查看脚本
        if (beforeScriptable) {
            const ret = await API.doActionScript({ btn_id: action.id, btn_type: '0', data_code: action._code, data });
            if (!ret.success) {
                return action.doing = false;
            }
        }

        if (mode === '3') {
            //填写表单
            this.actioning = action;

            if (batchable === '1') {
                if (method === '3') {
                    //不需要选择数据
                    this.onNewInst();
                } else {
                    this.onShowInst(data[0]);
                }
            } else {
                this.onBatchNewInst();
            }

            if (fields.length) {
                action.formStore._forEach(cpnt => {
                    if (cpnt.data._fieldValue) {
                        this.fieldsRule.push({ id: cpnt.data._fieldValue, value: fields[cpnt.data._fieldValue] || 0.1 });
                    }
                });
            }

        } else {
            //不需要填写表单
            await this.checkActionScript(action, data);
            this.checkActionLink(action, data);
            this.onDone();
        }
        action.doing = false;
    }
}
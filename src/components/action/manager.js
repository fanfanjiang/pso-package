import { judgeByRules } from '../../tool/form';
import API from '../../service/api'
import Action from './action';
import FormStore from "../form-designer/model/store.js";
import Qs from 'qs';

//动作
export default class ActionMGR {

    constructor(options) {

        this.$vue = null;
        this.actions = [];
        this.actionsMap = {};

        this.actioning = null;
        this.fieldsRule = [];
        this.editable = false;
        this.actExtParam = null;

        for (let op in options) {
            if (options.hasOwnProperty(op) && typeof options[op] !== 'undefined') {
                this[op] = options[op];
            }
        }
    }

    getActions(l = '1') {
        return this.actions.filter(({ location = '1' }) => location === (l || '1'))
    }

    async addActions({ code, actionIds, actions, formStore, trans }) {
        if (code && !formStore) {
            const ret = await API.formsCfg({ data: { id: code }, method: "get" });
            if (!ret.success) return;
            formStore = new FormStore({ ...ret.data, options: { designMode: false } });

            if (!actions) {
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
            actions = actions.filter(act => actionIds.indexOf(act.id) !== -1);
        }

        for (let act of actions) {
            const action = new Action({ trans, formStore, ...act });
            this.actions.push(action);
        }
    }

    clear() {
        this.fieldsRule = [];
        this.actioning = null;
        this.editable = false;
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
            return this.checkActionableByRule({ action, data: action.transform(data) });
        }
        return true;
    }

    checkActionableByRule({ action: ruleOptions, data: datas }) {
        return judgeByRules({ datas, ruleOptions, store: ruleOptions.formStore });
    }

    async doActionScript({ action, data, flag = 'scriptable', btn_type = '1', emit = true, evt = "actioned", showMsg = true }) {
        if (!action[flag]) return true;

        //添加扩展参数
        let actData = data;
        if (this.actExtParam) {
            actData = [];
            data.forEach(d => {
                actData.push({ ...this.actExtParam, ...d })
            })
        }

        const ret = await API.doActionScript({ btn_id: action.id, btn_type, data_code: action._code, data: actData });
        if (ret && ret.success && showMsg) {
            this.$vue.ResultNotify(ret);
        }
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
            return await this.doActionScript({ action, data: formData.dataArr, flag: 'befSaveScriptable', btn_type: '2', evt: "befsaveactioned" });
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

    async beforeBatchSave({ op, selected, data }) {
        delete data[0]['optype'];
        this.fieldsRule.forEach(f => {
            if ((2 & f.value) !== 2) {
                delete data[0][f.id];
            }
        });
        //请求脚本接口时是所有数据，包括不能修改的字段,注意要替换leaf_id
        const batchData = selected.map((d) => ({ ...d, ...data[0], leaf_id: d.leaf_id }));

        //保存前执行脚本，新增时
        const befSaveSuccess = await this.checkBefActionScript({ op, formData: { dataArr: batchData } });
        if (!befSaveSuccess) {
            return;
        }

        return batchData;
    }

    async checkActionView(action, data = []) {
        const { linkFormView, formViewField, FormViewAuth, formViewOpts } = action;

        if (typeof this.onShowFormView !== 'function' || !linkFormView || !formViewOpts) return;

        const params = { viewAuth: FormViewAuth };

        this.$vue.$set(params, 'pluginParams', {});
        formViewOpts.forEach(item => {
            this.$vue.$set(params, item.field, item.value);
            this.$vue.$set(params.pluginParams, item.field, item.value);
        })

        if (data.length && formViewField.length) {
            params.actExtParam = {};
            formViewField.forEach(({ t, s }) => {
                if (t && s) {
                    params.actExtParam[t] = data[0][s]
                }
            })
        }

        if (params.defFormValue) {
            params.defFormValue = this.setFVParams(params.defFormValue, data[0]);
        }

        if (params.defKeys) {
            params.defKeys = this.setFVParams(params.defKeys, data[0]);
        }
        this.onShowFormView(params);
    }

    setFVParams(str, data) {
        const checked = [];
        for (let item of str.split(";")) {
            const key = item.split("#");
            if (key[1]) {
                const regret = new RegExp(`(?<=\\$__)\\S+(?=__\\$)`).exec(key[1]);
                if (regret && regret[0]) {
                    if (!data || typeof data[regret[0]] === 'undefined' || data[regret[0]] === '') {
                        continue;
                    }
                    checked.push(`${key[0]}#${data[regret[0]]}#${key[2]}`);
                    continue;
                }
            }
            checked.push(item);
        }
        return checked.length ? checked.join(';') : "";
    }

    async afterFormSave({ action, data }) {
        await this.checkActionScript(action, data);
        this.checkActionView(action, data);
        this.checkActionLink(action, data);
    }

    async checkAction({ action, data = [] }) {

        const { mode, method, fields = {}, batchable } = action;

        action.doing = true;
        data = action.transform(data);

        this.clear();

        //查看是否满足使用条件
        if (!this.checkActionableByRule({ action, data })) {
            return this.$vue.$message({ message: '不满足执行条件', type: 'warning' });
        }

        //查看脚本
        const success = await this.doActionScript({ action, showMsg: action.showBefMsg, btn_type: '0', flag: 'beforeScriptable', evt: "befactioned", data });
        if (!success) {
            return action.doing = false;
        }

        if (mode === '3') {
            //填写表单
            if (batchable === '1') {
                if (method === '3') {
                    //不需要选择数据
                    this.onNewInst();
                } else {
                    this.onShowInst(data[0]);
                    this.editable = true;
                }
            } else {
                this.onBatchNewInst();
            }

            if (fields && !_.isEmpty(fields)) {
                action.formStore._forEach(cpnt => {
                    if (cpnt.data._fieldValue) {
                        this.fieldsRule.push({ id: cpnt.data._fieldValue, value: fields[cpnt.data._fieldValue] || 0.1 });
                    }
                });
            }
            this.actioning = action;
        } else {
            //不需要填写表单
            await this.afterFormSave({ action, data });
            await this.onDone();
        }
        action.doing = false;
    }
}
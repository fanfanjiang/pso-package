import Component from './cpnt'
import { setSelectedActor } from "../helper/dom.js";
import { CPNT } from "../../../const/form";
import Vue from 'vue';
import shortid from 'shortid';
import { makeSysFormFields } from "../../../tool/form";

export default class FormStore {
    constructor(options) {

        this.currentCpnt = null;
        this.cpntsMap = {};
        this.cpntsFieldMap = {};
        this.permissionEntries = [];
        this.redoList = [];
        this.undoList = [];

        this.appid = '3';
        this.data_name = '动态表单'; //表单配置名称
        this.data_id = ""; //表单配置id
        this.data_code = ""; //表单配置code
        this.templateId = ''; //模板node_id

        this.beInstanceId = shortid.generate();
        this.instance_id = "";  //数据实例id
        this.parentInstanceId = "";  //数据父级实例id

        this.editable = true;
        this.forceInsertSys = true;

        this.instance = {};//数据实例，暂时做的

        this.designMode = true; //设计模式

        this.copyMode = false;

        this.storeLoading = false;

        this.is_pub = 0;

        this.extendAuth = null;//额外的表单权限配置，因为流程那里需要

        this.rule_config;

        //由node端拼接的字段
        this.__fieldAuth__ = []; //字段权限

        this.cpntsDataMps = {};

        this.hiddenCpnts = [];

        this.sub_config; //关联表配置

        this.withSys = false;

        this.ignoreAstColumn = false;
 
        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option];
            }
        }

        this.data_config = this.data_config || this.data_design;

        if (this.data_config && typeof this.data_config === 'string') {
            this.data_config = JSON.parse(this.data_config);
        }

        if (this.withSys) {
            this.data_config = this.data_config.concat(makeSysFormFields())
        }

        if (this.rule_config && typeof this.rule_config === 'string') {
            this.rule_config = JSON.parse(this.rule_config);
        }

        if (this.sub_config && typeof this.sub_config === 'string') {
            this.sub_config = JSON.parse(this.sub_config);
        }

        //对原始表单配置进行保存
        if (this.data_code && this.data_config && this.designMode) {
            this.traverse(this.data_config, (cpnt, parent) => {
                if (CPNT[cpnt.componentid].db || CPNT[cpnt.componentid].host_db) {
                    const cloned = _.cloneDeep(cpnt);
                    delete cloned.children;
                    if (parent && CPNT[parent.componentid].host_db) cloned.pid = parent.fid;
                    this.cpntsDataMps[cloned.fid] = cloned;
                }
            })
        }

        this.root = new Component({
            data: {
                fid: "0",
                componentid: "stage",
                children: _.cloneDeep(this.data_config)
            },
            store: this
        });

        //必须添加的字段
        if (this.forceInsertSys) {
            const sysName = this.search({ options: { db: true }, dataOptions: { _fieldValue: 'd_name' } });
            const sysTag = this.search({ options: { db: true }, dataOptions: { _fieldValue: 'd_tag' } });
            if (!sysTag.length) {
                this.append({ manual: true, newIndex: 0, to: { fid: '0' }, target: { componentid: 'tag', _fieldValue: "d_tag", _deletable: false, _fvEditable: false } });
            }
            if (!sysName.length) {
                this.append({ manual: true, newIndex: 0, to: { fid: '0' }, target: { componentid: 'text', _fieldValue: "d_name", _deletable: false, _fvEditable: false } });
            }
        }

        if (this.designMode) {
            this.setCurrentCpnt(this.root);
            this.redoList.push(_.cloneDeep(this.root.data.children));
        }
    }

    get fid() {
        return this.currentCpnt && this.currentCpnt.fid || "";
    }

    get canUndo() {
        return this.redoList.length > 1;
    }

    get canRedo() {
        return this.undoList.length > 0;
    }

    getBaseInfo() {
        return {
            data_name: this.data_name,
            data_code: this.data_code,
            data_config: this.data_config
        }
    }

    traverse(data, callback, parent) {
        for (let item of data) {
            callback && callback(item, parent);
            if (item.children && item.children.length) {
                this.traverse(item.children, callback, item)
            }
        }
    }

    _forEach(fun) {
        for (let key in this.cpntsMap) {
            if (!this.cpntsMap[key].CPNT.layout) {
                fun && fun(this.cpntsMap[key]);
            }
        }
    }

    //获取所有表单字段值，系统和非系统的
    getInstanceValue() {
        const data = { ...this.instance };
        for (let k in this.cpntsMap) {
            if (k === '0') continue;
            data[this.cpntsMap[k].data._fieldValue] = this.cpntsMap[k].data._val;
        }
        return data;
    }

    updateInstance(instance) {
        if (instance && instance.leaf_id) {
            this.instance_id = instance.leaf_id;
            this.instance = instance;
        } else {
            this.instance_id = '';
        }

        for (let key in this.cpntsMap) {
            const cpnt = this.cpntsMap[key];
            const cpntData = cpnt.data;

            if (cpntData._fieldValue) {

                const setDefaultVal = () => {
                    Vue.set(cpntData, '_val', cpntData._defaultValue || "");
                }

                if (instance) {
                    const cnptVal = instance[cpntData._fieldValue];
                    if (typeof cnptVal !== 'undefined' && !_.isNull(cnptVal)) {
                        if (this.copyMode && cpnt.componentid === 'asstable' && cpntData._new) {
                            setDefaultVal();
                        } else {
                            Vue.set(cpntData, '_val', cnptVal);
                        }
                    } else {
                        setDefaultVal();
                    }
                } else {
                    setDefaultVal();
                }
            }
        }

        this.setShowByRules();
    }

    //手动更新控件值
    async updateInstanceManually(data, options) {
        for (let k in data) {
            await this.updateCpntManually(k, data[k], options);
        }
    }

    async updateCpntManually(target, data, options = {}) {
        const { clear = false } = options;
        let cpnt = target;
        if (typeof target === 'string') {
            cpnt = this.searchByField(target);
        }
        if (cpnt) {
            if (cpnt.__setDataByIds) {
                if (clear) {
                    try {
                        if (cpnt.data._proxy) {
                            const list = cpnt.data._proxy.list || cpnt.data._proxy.valList;
                            if (list && list.length) list.splice(0);
                        }
                    } catch (error) {

                    }
                }
                await cpnt.__setDataByIds(data, options);
            } else {
                cpnt.data._val = data;
            }
        }
    }

    reload(data) {
        this.data_config = data;
        this.root.data.children = data;
        this.root.updateChildren();
    }

    searchByField(fieldValue, onlyData = false) {
        //仅仅方便在使用表单的时候查询
        if (_.isEmpty(this.cpntsFieldMap)) {
            this._forEach(cpnt => {
                if (cpnt.data._fieldValue) this.cpntsFieldMap[cpnt.data._fieldValue] = cpnt;
            })
        }
        const cpnt = this.cpntsFieldMap[fieldValue];
        return onlyData && cpnt ? cpnt.data : cpnt;
    }

    search({ options, dataOptions, beforePush, onlyData = false, opType = 'and', onlyMain = false }) {
        const { fid } = options;
        if (options && options.hasOwnProperty('fid')) {
            return onlyData ? (this.cpntsMap[fid] && this.cpntsMap[fid].data) : this.cpntsMap[fid];
        }
        if (!Object.keys(options).length) return [];

        const resault = [];

        const checkData = (key) => {
            if (dataOptions) {
                for (let dataKey in dataOptions) {
                    if (this.cpntsMap[key].data[dataKey] !== dataOptions[dataKey]) {
                        return false;
                    }
                }
            }
            return true;
        }

        const isMainData = (cpnt) => {
            return !onlyMain ? true : !cpnt.parent.CPNT.host_db
        }

        for (let key in this.cpntsMap) {

            //如果是舞台则跳过
            if (this.cpntsMap[key].componentid === 'stage') continue;

            let searchTag = opType === 'and';
            for (let opKey in options) {
                if (opType === 'and') {
                    if (this.cpntsMap[key].CPNT[opKey] !== options[opKey] || !checkData(key) || !isMainData(this.cpntsMap[key])) {
                        searchTag = false;
                        break;
                    }
                } else {
                    if (this.cpntsMap[key].CPNT[opKey] === options[opKey]) {
                        if (!checkData(key) || !isMainData(this.cpntsMap[key])) {
                            searchTag = false;
                            break;
                        }
                        searchTag = true;
                        break;
                    }
                }
            }

            if (searchTag && typeof beforePush === 'function') searchTag = beforePush(this.cpntsMap[key]);

            if (searchTag) {
                resault.push(onlyData ? this.cpntsMap[key].data : this.cpntsMap[key]);
            }
        }
        return resault;
    }

    setShowByRules(cpnt) {

        const rules = this.rule_config;
        const check = (r, show = true) => {
            const conditions = [];
            r.filters.forEach(f => {
                let condition = false;
                const _cpnt = this.search({ options: { db: true }, dataOptions: { _fieldValue: f.id } })[0];

                if (_cpnt) {
                    const op = _cpnt.CPNT.fop[f.op];
                    switch (op.id) {
                        case 'op1':
                            condition = _cpnt.data._val == f.val
                            break;
                    }
                }

                conditions.push(condition);
            })

            show = conditions[r.type === 1 ? 'every' : "some"](i => i);

            r.controlIds.forEach(_fieldValue => {
                const _cpnt = this.search({ options: { db: true }, dataOptions: { _fieldValue } })[0];
                if (_cpnt) {
                    Vue.set(_cpnt.data, r.controlType == 2 ? '_required' : 'showInRules', show)
                }
            })
        }

        if (rules && rules.length) {
            for (let r of rules) {

                if (!r.filtersIds) {
                    r.filtersIds = _.map(r.filters, 'id');
                }

                if (cpnt) {
                    if (r.filtersIds.indexOf(cpnt.data._fieldValue) !== -1) {
                        check(r, true);
                    } else {
                        continue;
                    }
                } else {
                    check(r, false);
                }
            }
        }
    }

    undo() {
        if (!this.canUndo) return;
        this.undoList.push(this.redoList.pop());
        const doneState = this.redoList[this.redoList.length - 1];
        this.reload(_.cloneDeep(doneState));
    }

    redo() {
        if (!this.canRedo) return;
        const unDoneState = this.undoList.pop();
        this.redoList.push(unDoneState);
        this.reload(_.cloneDeep(unDoneState));
    }

    append({ manual, to, from, target, oldIndex, newIndex }) {
        const toCpnt = this.search({ options: to });

        if (!manual && target.fid) {
            target = this.search({ options: target });
            target.remove();
        }

        const fid = target.fid || '';

        target = toCpnt.insertChild({ data: target.fid ? target.data : target, add: this.cpntsDataMps[fid] ? false : true }, newIndex);
        this.redoList.push(_.cloneDeep(this.root.data.children));
    }

    remove(cpnt) {
        cpnt.remove();
        this.redoList.push(_.cloneDeep(this.root.data.children));
    }

    setCurrentCpnt(cpnt) {
        this.currentCpnt = cpnt;
        setTimeout(() => {
            setSelectedActor(cpnt.fid);
        })
    }

    registerCpnt(cpnt) {
        Vue.set(this.cpntsMap, cpnt.fid, cpnt)
    }

    deregisterCpnt(cpnt) {
        delete this.cpntsMap[cpnt.fid];
    }
}
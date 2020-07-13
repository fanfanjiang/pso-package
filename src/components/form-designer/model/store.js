import Component from './cpnt'
import { setSelectedActor } from "../helper/dom.js";
import { CPNT } from "../../../const/form";
import Vue from 'vue';

export default class FormStore {
    constructor(options) {

        this.currentCpnt = null;
        this.cpntsMap = {};
        this.permissionEntries = [];
        this.redoList = [];
        this.undoList = [];

        this.appid = '3';
        this.data_name = '动态表单'; //表单配置名称
        this.data_id = ""; //表单配置id
        this.data_code = ""; //表单配置code
        this.templateId = ''; //模板node_id

        this.instance_id = "";  //数据实例id
        this.editable = true;
        this.forceInsertSys = true;

        this.designMode = true; //设计模式

        this.copyMode = false;

        this.is_pub = 0;


        this.rule_config;

        this.__fieldAuth__ = []; //字段权限

        this.cpntsDataMps = {};

        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option];
            }
        }

        this.data_config = this.data_config || this.data_design;

        if (this.data_config && typeof this.data_config === 'string') {
            this.data_config = JSON.parse(this.data_config);
        }

        if (this.rule_config && typeof this.rule_config === 'string') {
            this.rule_config = JSON.parse(this.rule_config);
        }

        //对原始表单配置进行保存
        if (this.data_id && this.data_config && this.designMode) {
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
            const sysName = this.search({ options: { componentid: "text" }, dataOptions: { _fieldValue: 'd_name' } });
            const sysTag = this.search({ options: { componentid: "tag" }, dataOptions: { _fieldValue: 'd_tag' } });
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
            data_id: this.data_id,
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
        for (let key in this.cpntsMap) fun && fun(this.cpntsMap[key]);
    }

    updateInstance(instance) {
        if (instance && instance.leaf_id) {
            this.instance_id = instance.leaf_id;
        } else {
            this.instance_id = '';
        }

        for (let key in this.cpntsMap) {
            const cpntData = this.cpntsMap[key].data;
            if (cpntData._fieldValue) {
                if (instance) {
                    if (typeof instance[cpntData._fieldValue] !== 'undefined') {
                        Vue.set(cpntData, '_val', instance[cpntData._fieldValue]);
                    } else {
                        Vue.set(cpntData, '_val', cpntData._defaultValue || "");
                    }
                } else {
                    Vue.set(cpntData, '_val', cpntData._defaultValue || "");
                }
            }
        }

        this.setShowByRules();
    }

    reload(data) {
        this.data_config = data;
        this.root.data.children = data;
        this.root.updateChildren();
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

        if (rules && rules.length) {
            rules.forEach(r => {
                if (!r.filtersIds) {
                    r.filtersIds = _.map(r.filters, 'id');
                }

                let show = false;

                if (cpnt && r.filtersIds.indexOf(cpnt.data._fieldValue) !== -1) {
                    const conditions = [];
                    r.filters.forEach(f => {
                        let condition = false;
                        const _cpnt = this.search({ options: { fid: f.id } });

                        if (_cpnt) {
                            const op = _cpnt.CPNT.fop[f.op];
                            switch (op.id) {
                                case 'op1':
                                    condition = _cpnt.data._val === f.val
                                    break;
                            }
                        }

                        conditions.push(condition);
                    })
                    show = conditions[r.type === 1 ? 'every' : "some"](i => i);
                }

                r.controlIds.forEach(fid => {
                    const _cpnt = this.search({ options: { fid } });
                    if (_cpnt) {
                        Vue.set(_cpnt.data, 'showInRules', show)
                    }
                })
            })
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
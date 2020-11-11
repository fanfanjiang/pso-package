
import { genComponentData } from '../helper';
import { CPNT } from "../../../const/form";
import Vue from 'vue';

export default class Component {
    constructor(options) {
        this.level = 0;
        this.parent = null;
        this.childComponents = [];
        this.cache = {};

        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option];
            }
        }
        const store = this.store;

        genComponentData(this.data);

        //默认组件名称
        this.data._fieldName = this.data._fieldName || this.CPNT.name;

        //最终组件是否显示
        this.data.__eventualShow__ = true;

        //显示
        if (store.hiddenCpnts.indexOf(this.data.fid) !== -1) {
            this.data._hideForever = true;
        }

        if (store.extendAuth) {
            const exist = _.find(store.extendAuth, { id: this.data._fieldValue });
            if (exist && exist.value) {
                if ((1 & exist.value) === 1) {
                    this.data._hideOnNew = this.data._hideForever = false;
                }
                if ((2 & exist.value) === 2) {
                    Vue.set(this.data, '__forceEdit__', true)
                }
                if ((4 & exist.value) === 4) {
                    this.data._required = true;
                }
            }
        }

        //权限
        const auth = _.find(store.__fieldAuth__, { field_name: this.data._fieldValue }) || {};
        this.data.__auth__ = auth.show_auth || null;

        //对以前数据的兼容处理
        this.compatible('_required');
        this.compatible('_hideOnNew');
        this.compatible('_unique');
        this.compatible('_read');

        store.registerCpnt(this);

        if (this.parent) {
            this.level = this.parent.level + 1;
        }

        if (this.data) {
            this.setData(this.data);
        }
    }

    compatible(field) {
        if (this.data[field] === '1') this.data[field] = true;
        if (this.data[field] === '0') this.data[field] = false;
    }

    get fid() {
        return this.data.fid;
    }

    get componentid() {
        return this.data.componentid;
    }

    get _val() {
        return this.data._val;
    }

    get CPNT() {
        return CPNT[this.componentid] || {};
    }

    setData(data) {

        this.data = data;
        this.childComponents = [];
        const children = this.getChildren(this.level === 0) || [];

        for (let i = 0, j = children.length; i < j; i++) {
            this.insertChild({ data: children[i] });
        }
    }

    insertChild(child, index, batch) {
        if (!child) throw new Error('insertChild error: child is required.');

        if (!(child instanceof Component)) {
            if (!batch) {
                const children = this.getChildren(true);
                if (children.indexOf(child.data) === -1) {
                    if (typeof index === 'undefined' || index < 0) {
                        children.push(child.data);
                    } else {
                        children.splice(index, 0, child.data);
                    }
                }
            }
            Object.assign(child, {
                parent: this,
                store: this.store
            });
            child = new Component(child);
        }

        child.level = this.level + 1;

        if (typeof index === 'undefined' || index < 0) {
            this.childComponents.push(child);
        } else {
            this.childComponents.splice(index, 0, child);
        }

        this.store.setCurrentCpnt(child);

        return child;
    }

    remove() {
        const parent = this.parent;
        if (parent) {
            parent.removeChild(this);
        }
    }

    removeChild(child) {
        const children = this.getChildren() || [];
        const dataIndex = children.indexOf(child.data);
        if (dataIndex > -1) {
            this.data.children.splice(dataIndex, 1);
        }

        const index = this.childComponents.indexOf(child);

        if (index > -1) {
            this.store.setCurrentCpnt(child.parent);
            this.store && this.store.deregisterCpnt(child);
            child.parent = null;
            this.childComponents.splice(index, 1);
        }
    }

    removeChildByData(data) {
        let targetNode = null;

        for (let i = 0; i < this.childComponents.length; i++) {
            if (this.childComponents[i].data === data) {
                targetNode = this.childComponents[i];
                break;
            }
        }

        if (targetNode) {
            this.removeChild(targetNode);
        }
    }

    getChildren(forceInit = false) {
        if (!this.data) return null;
        const children = this.data.children;
        if (!children && forceInit) {
            Vue.set(this.data, 'children', [])
        }
        return this.data.children;
    }

    updateChildren() {
        const newData = this.getChildren() || [];
        const oldData = this.childComponents.map((node) => node.data);

        const newDataMap = {};
        const newNodes = [];

        newData.forEach((item, index) => {
            const key = item['fid'];
            const isNodeExists = !!key && _.find(oldData, { fid: key });
            if (isNodeExists) {
                newDataMap[key] = { index, data: item };
            } else {
                newNodes.push({ index, data: item });
            }
        });

        oldData.forEach((item) => {
            if (!newDataMap[item['fid']]) this.removeChildByData(item);
        });

        newNodes.forEach(({ index, data }) => {
            this.insertChild({ data }, index);
        });
    }
}
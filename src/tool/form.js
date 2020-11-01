import { CPNT, SUMMARY_OP } from "../const/form";
import { FILTER_OP, FILTER_TYPE } from "../../share/const/filter";
import { genComponentData } from '../components/form-designer/helper'
import API from "../service/api.js";
import Vue from 'vue';

/**
 *转换condition
 *
 * @export
 * @param {*} map
 * @returns
 */
export function transCMapToCondition(map) {
    try {
        const condition = [];
        _.cloneDeep(map).forEach(conditionOr => {
            const cdtAnd = [];
            conditionOr.forEach(conditionAnd => {
                const fieldName = (conditionAnd.cpnt.tableName ? conditionAnd.cpnt.tableName + '.' : '') + conditionAnd.cpnt._fieldValue;
                const dataType = CPNT[conditionAnd.cpnt.componentid].type === 'number' ? '@' : '#';
                const datas = [];
                if (conditionAnd.op) {
                    const FilterOp = FILTER_OP[conditionAnd.op].op;
                    if (Array.isArray(FilterOp)) {
                        FilterOp.forEach((op, i) => {
                            if (conditionAnd.data && (conditionAnd.data[i] || conditionAnd.data[i] === 0)) {
                                datas.push({ op: op.value, data: `[${dataType}${conditionAnd.data[i]}]` });
                            }
                        })
                    } else {
                        if (Array.isArray(conditionAnd.data)) {
                            if (conditionAnd.data.length) {
                                datas.push({ op: FilterOp.value, data: conditionAnd.data.map(dv => `[${dataType}${dv}]`).join(',') });
                            }
                        } else if (conditionAnd.data || conditionAnd.data === 0) {
                            datas.push({ op: FilterOp.value, data: `[${dataType}${conditionAnd.data}]` });
                        }
                    }
                }
                datas.forEach(d => {
                    cdtAnd.push(`[${fieldName}] ${Array.isArray(d.op) ? (d.op[0] + d.data + d.op[1]) : (d.op + d.data)}`)
                })
            })
            if (cdtAnd.length) {
                condition.push(`【${cdtAnd.join(' AND ')}】`);
            }
        })
        return `【${condition.join(' OR ')}】`;
    } catch (error) {
        console.log('解析错误', error);
        return ''
    }
}

/**
 *通过统计插件列表配置生成相对应的组件数据
 *
 * @export
 * @param {*} { code, onEach }
 * @returns
 */
export async function makeFormByScript({ code, onEach }) {
    const ret = await API.getTreeNode({ code });
    if (ret.data.data.tp_content) {
        const data_config = [];
        JSON.parse(ret.data.data.tp_content).forEach((f) => {
            const fType = FILTER_TYPE[f.searchType || 'string'];
            const sItem = { componentid: fType.cid, fid: f.field, _fieldValue: f.field, _fieldName: f.name, displayName: f.name, _val: "" };
            if (f.searchList && f.searchList.length) {
                sItem._option = f.searchList.map((i) => {
                    return { _optionName: i.n, _optionValue: i.v };
                });
            }
            onEach && onEach(sItem);
            data_config.push(genComponentData(sItem));
        });
        return { ...ret.data.data, data_config };
    }
}

/**
 *生成系统字段组件数据
 *
 * @export
 * @returns
 */
export function makeSysFormFields() {
    const sysFields = ['leaf_id', 'd_status', 'd_audit', 'd_stage', 'creator'];
    const fields = [];
    sysFields.forEach(f => {
        fields.push(genComponentData({ componentid: 'text', _fieldValue: f, _fieldName: f }))
    })
    return fields;
}

/**
 *检查组件值是否符合小数点位数要求，修改至符合要求
 *
 * @export
 * @param {*} cpnt
 * @param {*} value
 * @returns
 */
export function filterByDecimal(cpnt, value) {
    try {
        const { componentid, _decimalPlaces, _selectedOp } = cpnt;
        if (componentid === 'summary' && SUMMARY_OP.datetime.includes(_selectedOp)) return value;

        if (typeof _decimalPlaces !== "undefined" && _decimalPlaces && !_.isNaN(value) && !_.isNull(value) && value !== '') {
            if (typeof value === "string") {
                value = parseFloat(value);
            }
            return value.toFixed(_decimalPlaces);
        }

        return value;
    } catch (e) {
        console.log(e);
        return value;
    }
}

/**
 *获取组件值的显示名称
 *
 * @export
 * @param {*} cpnt
 * @param {*} proxy
 * @returns  显示名称
 */
export function getDisplayOfCpnt(cpnt, proxy) {
    proxy = cpnt.data._proxy || proxy;
    let value = '';
    if (proxy) {
        //人员和部门
        if (cpnt.componentid === "user" || cpnt.componentid === "department") {
            const name = cpnt.componentid === "user" ? "user_name" : "node_display";
            if (proxy.list.length) {
                value = _.map(proxy.list, name).join(",");
            }
        }

        //标签
        if (cpnt.componentid === "tag") {
            const name = cpnt.data._source === "tree" ? "node_display" : "tag_name";
            if (proxy.list.length) {
                value = _.map(proxy.list, name).join(",");
            }
        }
    }
    return value;
}

/**
 *模仿后端返回的数据，给字段加_x的中文名
 *
 * @export
 * @param {*} data 
 * @param {*} store
 */
export function imitateFormData(data, store) {
    for (let k in data) {
        const cpnt = store.searchByField(k);
        if (cpnt) {
            if (['user', 'tag', 'department'].includes(cpnt.data.componentid)) {
                Vue.set(data, `${k}_x`, getDisplayOfCpnt(cpnt));
            }
        }
    }
}
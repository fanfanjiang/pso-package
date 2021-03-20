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
        return { ...ret.data.data, data_config: makeFormByOther(JSON.parse(ret.data.data.tp_content), onEach) };
    }
}

export async function makeFormByPluginModule({ code, options, onEach }) {
    if (options) {
        return { data_config: makeFormByOther(options, onEach) };
    } else {
        const ret = await API.getPluginModules({ keys: JSON.stringify({ child_id: { type: 1, value: code } }) });
        if (ret.success && ret.data.length) {
            return { ...ret.data.data, data_config: makeFormByOther(JSON.parse(ret.data[0].child_content), onEach) };
        }
    }
}

export function makeFormByOther(data, onEach) {
    const config = [];
    data.forEach((f) => {
        const fType = FILTER_TYPE[f.searchType || 'string'];
        const sItem = { componentid: fType.cid, fid: f.field, _fieldValue: f.field, _fieldName: f.name, displayName: f.name, _val: "" };
        if (f.searchList && f.searchList.length) {
            sItem._option = f.searchList.map((i) => {
                return { _optionName: i.n, _optionValue: i.v };
            });
        }
        onEach && onEach(sItem);
        config.push(genComponentData(sItem));
    });
    return config;
}

/**
 *生成系统字段组件数据
 *
 * @export
 * @returns
 */
export function makeSysFormFields({ allString = true } = {}) {
    const sysFields = [
        { _fieldValue: 'leaf_id', _fieldName: 'LEAF_ID(系统)', componentid: 'text' },
        { _fieldValue: 'd_status', _fieldName: '表单状态(系统)', componentid: 'text' },
        { _fieldValue: 'd_audit', _fieldName: '审核状态(系统)', componentid: 'text' },
        { _fieldValue: 'd_stage', _fieldName: '阶段(系统)', componentid: 'text' },
        { _fieldValue: 'creator', _fieldName: '表单创建人(系统)', componentid: 'text' },
    ];
    const fields = [];
    sysFields.forEach(f => {
        fields.push(genComponentData(f))
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
    let value = cpnt.data._val;
    if (proxy) {
        //人员和部门
        if (cpnt.componentid === "user" || cpnt.componentid === "department") {
            let name = "node_display";
            if (cpnt.componentid === "user") {
                if (cpnt.data._sourceType === "2") {
                    name = `${cpnt.data._bindFormField}_x`;
                } else {
                    name = "user_name";
                }
            }
            if (proxy.list.length) {
                value = _.map(proxy.list, name).join(",");
            }
        }

        //标签
        if (cpnt.componentid === "tag") {
            const name = ["tree", 'folder'].includes(cpnt.data._source) ? "node_display" : "tag_name";
            if (proxy.list.length) {
                value = _.map(proxy.list, name).join(",");
            }
        }
    }

    if ((cpnt.componentid === "select" || cpnt.componentid === "checkbox") && cpnt.data._option) {
        const opt = _.find(cpnt.data._option, { _optionValue: value });
        if (opt) {
            value = opt._optionName;
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

export function checkUntransField(id) {
    return (/\S+_s$/.test(id) || /\S+_x$/.test(id));
}

export function judgeByRules(args) {
    const { datas, ruleOptions, store } = args;
    const { rule, ruleType } = ruleOptions;

    for (let data of datas) {
        const result = [];
        for (let r of rule) {
            const cpnt = store.search({ options: { fid: r.field } });
            let condition = false;
            if (cpnt) {
                let tv = r.data;
                let sv = data[cpnt.data._fieldValue];
                if (r.type === '2') {
                    tv = data[r.data];
                }

                try {
                    if (['op1', 'op2', 'op3', 'op4', 'op5', 'op6'].includes(r.op)) {
                        if (cpnt.CPNT.figure || ['d_status', 'd_audit', 'd_stage'].includes(cpnt.data._fieldValue)) {
                            sv = parseFloat(sv)
                            tv = parseFloat(tv)
                        }
                    }
                } catch (error) {
                    console.log(error);
                }

                if (r.op === 'op1') {
                    condition = sv == tv;
                } else if (r.op === 'op2') {
                    condition = sv != tv;
                } else if (r.op === 'op3') {
                    condition = sv > tv;
                } else if (r.op === 'op4') {
                    condition = sv >= tv;
                } else if (r.op === 'op5') {
                    condition = sv < tv;
                } else if (r.op === 'op6') {
                    condition = sv <= tv;
                } else if (r.op === 'op7') {
                    if (sv && tv && typeof tv === 'string') {
                        const tList = tv.split(',');
                        sv = sv + '';
                        let tempRet = true;
                        for (let v in sv.split(',')) {
                            if (tList.indexOf(v) == -1) {
                                tempRet = false;
                                break;
                            }
                        }
                        condition = tempRet;
                    }
                } else if (r.op === 'op8') {
                    condition = true;
                    if (tv && typeof tv === 'string') {
                        const tList = tv.split(',');
                        sv = sv + '';
                        let tempRet = true;
                        for (let v in sv.split(',')) {
                            if (tList.indexOf(v) == -1) {
                                tempRet = false;
                                break;
                            }
                        }
                        condition = tempRet;
                    }
                } else if (r.op === 'op9') {
                    if (sv && tv && typeof sv === 'string' && typeof tv === 'string') {
                        condition = sv.search(tv) !== -1;
                    }
                } else if (r.op === 'op90') {
                    condition = (sv === '' || _.isNull(sv));
                } else if (r.op === 'op91') {
                    condition = !(sv === '' || _.isNull(sv));
                }
            }
            result.push(condition)
        }
        if (!result[ruleType === '1' ? 'every' : "some"](i => i)) {
            return false;
        };
    }
    return true;
}
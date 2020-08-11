import { CPNT } from "../const/form";
import { OP_TYPE } from "../const/op";
const { FILTER_OP, FILTER_TYPE } = require("../../share/const/filter");
import { genComponentData } from '../components/form-designer/helper'
import API from "../service/api.js";

export function transCMapToCondition(map) {
    try {
        const condition = [];
        _.cloneDeep(map).forEach(conditionOr => {
            const cdtAnd = [];
            conditionOr.forEach(conditionAnd => {
                const fieldName = (conditionAnd.cpnt.tableName ? conditionAnd.cpnt.tableName + '.' : '') + conditionAnd.cpnt._fieldValue;
                const dataType = CPNT[conditionAnd.cpnt.componentid].type === 'number' ? '@' : '#';
                const FilterOp = FILTER_OP[conditionAnd.op].op;
                const datas = [];
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
                datas.forEach(d => {
                    cdtAnd.push(`[${fieldName}] ${Array.isArray(d.op) ? (d.op[0] + d.data + d.op[1]) : (d.op + d.data)}`)
                })
            })
            condition.push(`【${cdtAnd.join(' AND ')}】`);
        })
        return `【${condition.join(' OR ')}】`;
    } catch (error) {
        console.log('解析错误', error);
        return ''
    }
}

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
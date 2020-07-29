import { CPNT } from "../const/form";
import { OP_TYPE } from "../const/op";
const { FILTER_OP } = require("../../share/const/filter");

export function transCMapToCondition(map) {
    try {
        const condition = [];
        _.cloneDeep(map).forEach(conditionOr => {
            const cdtAnd = [];
            conditionOr.forEach(conditionAnd => {
                const fieldName = (conditionAnd.cpnt.tableName ? conditionAnd.cpnt.tableName + '.' : '') + conditionAnd.cpnt.data._fieldValue;
                const dataType = CPNT[conditionAnd.cpnt.componentid].type === 'number' ? '@' : '#';
                const FilterOp = FILTER_OP[conditionAnd.op].op;
                const datas = [];
                if (Array.isArray(FilterOp)) {
                    FilterOp.forEach((op, i) => {
                        if (conditionAnd.data[i] !== '' && typeof conditionAnd.data[i] !== 'undefined') {
                            datas.push({ op: op.value, data: `[${dataType}${conditionAnd.data[i]}]` });
                        }
                    })
                } else {
                    if (Array.isArray(conditionAnd.data)) {
                        if (conditionAnd.data.length) {
                            datas.push({ op: FilterOp.value, data: conditionAnd.data.map(dv => `[${dataType}${dv}]`).join('') });
                        }
                    } else if (conditionAnd.data !== '' && typeof conditionAnd.data !== 'undefined') {
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
        return ''
    }
}
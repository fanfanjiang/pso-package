import { CPNT } from "../const/form";
import { OP_TYPE } from "../const/op";

export function transCMapToCondition(map) {
    try {
        let condition = [];
        let tempMap = _.cloneDeep(map);
        tempMap.forEach(conditionOr => {
            let cdtAnd = [];
            conditionOr.forEach(conditionAnd => {
                let fieldName = (conditionAnd.cpnt.tableName ? conditionAnd.cpnt.tableName + '.' : '') + conditionAnd.cpnt._fieldValue;
                let dataType = CPNT[conditionAnd.cpnt.componentid].type === 'number' ? '@' : '#';
                let data = Array.isArray(conditionAnd.data) ? conditionAnd.data.map(dataVal => `[${dataType}${dataVal}]`).join('') : `[${dataType}${conditionAnd.data}]`;
                let opType = OP_TYPE[conditionAnd.op].value;
                cdtAnd.push(`[${fieldName}] ${Array.isArray(opType) ? (opType[0] + data + opType[1]) : (opType + data)}`)
            })
            condition.push(`【${cdtAnd.join(' AND ')}】`);
        })
        return `【${condition.join(' OR ')}】`;
    } catch (error) {
        return ''
    }
}
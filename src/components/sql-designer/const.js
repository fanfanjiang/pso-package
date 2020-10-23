export const TYPE = [
    { v: "0", n: "纯脚本" },
    { v: "1", n: "psoscript" },
    { v: "2", n: "pso纯脚本" },
];

export const OP = [
    { v: "0", n: "选择" },
    { v: "1", n: "插入" },
    { v: "2", n: "更新" },
];

export const OPTYPE = [
    { v: "0", n: "表单" },
    { v: "1", n: "包含记录" },
];

export const RELATE = [
    { v: "0", n: "单表" },
    { v: "1", n: "关联主表" },
    { v: "2", n: "关联子表" },
];

export const FORMULAR = [
    { v: "0", n: "无" },
    { v: "1", n: "等于" },
    { v: "2", n: "加" },
    { v: "3", n: "减" },
    { v: "4", n: "乘" },
    { v: "5", n: "除" },
];

export const CONDITION = [
    { v: "0", n: "否" },
    { v: "1", n: "是" },
];

export default {
    TYPE,
    OP,
    OPTYPE,
    RELATE,
    FORMULAR,
    CONDITION,
}


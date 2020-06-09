export const SUMMARY_OP_TYPE = {
    COUNT_FILLED: '已填计数',
    COUNT_UNDERFILL: '未填计数',
    SUM: '求和',
    AVG: '平均值',
    MAX: '最大值',
    MIN: '最小值',
    FIRST: '最早',
    LAST: '最晚',
}

export const SUMMARY_OP = {
    string: [SUMMARY_OP_TYPE.COUNT_FILLED, SUMMARY_OP_TYPE.COUNT_UNDERFILL],
    decimal: [
        SUMMARY_OP_TYPE.COUNT_FILLED,
        SUMMARY_OP_TYPE.COUNT_UNDERFILL,
        SUMMARY_OP_TYPE.SUM,
        SUMMARY_OP_TYPE.AVG,
        SUMMARY_OP_TYPE.MAX,
        SUMMARY_OP_TYPE.MIN
    ],
    datetime: [
        SUMMARY_OP_TYPE.COUNT_FILLED,
        SUMMARY_OP_TYPE.COUNT_UNDERFILL,
        SUMMARY_OP_TYPE.FIRST,
        SUMMARY_OP_TYPE.LAST,
    ]
}

export const FORMULA_DATE_TYPE = {
    DURATION: '计算时长',
    COMPUTE: '加减时间',
}

export const FORMULA_OP = {
    SUM: 'SUM',
    AVERAGE: 'AVERAGE',
    MAX: 'MAX',
    MIN: 'MIN',
    COUNTA: 'COUNTA',
    CUSTOM: 'CUSTOM',
}

export const FORMULA_NUM_TYPE = [
    { name: '求和', op: FORMULA_OP.SUM },
    { name: '平均值', op: FORMULA_OP.AVERAGE },
    { name: '最大值', op: FORMULA_OP.MAX },
    { name: '最小值', op: FORMULA_OP.MIN },
    { name: '自定义', op: FORMULA_OP.CUSTOM },
]

export const FORMULA_OP_LIST = [
    {
        name: '求和',
        op: FORMULA_OP.SUM
    },
    {
        name: '平均值',
        op: FORMULA_OP.AVERAGE
    }
];

export const DATE_OPTION = {
    date: [
        {
            name: "不设置",
            value: ""
        },
        {
            name: "当日",
            value: "1"
        }
    ],
    datetime: [
        {
            name: "不设置",
            value: ""
        },
        {
            name: "当前时间",
            value: "1"
        }
    ],
    time: [
        {
            name: "不设置",
            value: ""
        },
        {
            name: "当前时间",
            value: "1"
        },
        {
            name: "指定时间",
            value: "2"
        }
    ]
}

export const FIELD_FORMAT = {
    common: {
        label: '常规',
        value: 'common'
    },
    common_x: {
        label: '扩展',
        value: 'common_x'
    },
    user: {
        label: '用户',
        value: 'user'
    },
    dept: {
        label: '部门',
        value: 'dept'
    },
    tag: {
        label: '标签',
        value: 'tag'
    },
    calculate: {
        label: '计算',
        value: 'calculate'
    },
    table: {
        label: '子表',
        value: 'table'
    },
    alert: {
        label: '日期',
        value: 'alert'
    },
    autotag: {
        label: '标签编号',
        value: 'autotag'
    }
}


export const CPNT = require('../../share/const/form');

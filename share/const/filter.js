const OP_TYPE = require('./op');

const FILTER_OP = {
    op1: {
        id: 'op1',
        name: '等于',
        op: OP_TYPE.op1
    },
    op2: {
        id: 'op2',
        name: '不等于',
        op: OP_TYPE.op2
    },
    op3: {
        id: 'op3',
        name: '大于',
        op: OP_TYPE.op3
    },
    op4: {
        id: 'op4',
        name: '大于等于',
        op: OP_TYPE.op4
    },
    op5: {
        id: 'op5',
        name: '小于',
        op: OP_TYPE.op5
    },
    op6: {
        id: 'op6',
        name: '小于等于',
        op: OP_TYPE.op6
    },
    op7: {
        id: 'op7',
        name: '在其中',
        op: OP_TYPE.op7,
        savearray: true,
    },
    op8: {
        id: 'op8',
        name: '不在其中',
        op: OP_TYPE.op8,
        savearray: true,
    },
    op9: {
        id: 'op9',
        name: '包含',
        op: OP_TYPE.op9
    },
    op10: {
        id: 'op10',
        name: '在范围内',
        op: [OP_TYPE.op4, OP_TYPE.op6]
    },
    op11: {
        id: 'op11',
        name: '不在范围内',
        op: [OP_TYPE.op4, OP_TYPE.op6]
    },
    op12: {
        id: 'op12',
        name: '在日期范围内',
        op: [OP_TYPE.op4, OP_TYPE.op6],
        arraytype: true,
        type: 'daterange',
        format: 'yyyy-MM-dd'
    },
    op17: {
        id: 'op17',
        name: '在日期时间围内',
        op: [OP_TYPE.op4, OP_TYPE.op6],
        arraytype: true,
        type: 'datetimerange',
        format: 'yyyy-MM-dd HH:mm:ss'
    },
    op13: {
        id: 'op13',
        name: '在月范围内',
        op: [OP_TYPE.op4, OP_TYPE.op6],
        arraytype: true,
        type: 'monthrange',
        format: 'yyyy-MM-dd',
        vformat: 'yyyy-MM-dd'
    },
    op14: {
        id: 'op14',
        name: '选择年',
        op: OP_TYPE.op1,
        type: 'year',
        format: 'yyyy'
    },
    op15: {
        id: 'op15',
        name: '在月范围内(仅筛选月份值)',
        op: [OP_TYPE.op4, OP_TYPE.op6],
        arraytype: true,
        type: 'monthrange',
        format: 'yyyy-MM-dd',
        vformat: 'MM'
    },
    op16: {
        id: 'op16',
        name: '在周范围内',
        op: [OP_TYPE.op4, OP_TYPE.op6],
        arraytype: true,
        type: 'week',
        format: 'yyyy 第 WW 周',
        vformat: 'yyyy-MM-dd'
    },
    op90: {
        id: 'op90',
        name: OP_TYPE.op10.name,
        op: OP_TYPE.op10
    },
    op91: {
        id: 'op91',
        name: OP_TYPE.op11.name,
        op: OP_TYPE.op11
    }
}

exports.FILTER_OP = FILTER_OP;

const FILTER_TYPE = {
    number: {
        id: 'number',
        cid: 'number',
        name: '数值',
        op: [
            { ...FILTER_OP.op9, match: 1 },
            { ...FILTER_OP.op1, match: 1 },
            { ...FILTER_OP.op2, match: 1 },
            { ...FILTER_OP.op3, match: 1 },
            { ...FILTER_OP.op4, match: 1 },
            { ...FILTER_OP.op5, match: 1 },
            { ...FILTER_OP.op6, match: 1 },
            { ...FILTER_OP.op7, match: 1 },
            { ...FILTER_OP.op8, match: 1 },
            { ...FILTER_OP.op10, match: 5, arraytype: true, defaultVal: [0, 0] },
            // { ...FILTER_OP.op90, match: 1, defaultVal: 'empty' },
            // { ...FILTER_OP.op91, match: 1, defaultVal: 'empty' },
        ]
    },
    string: {
        id: 'string',
        cid: 'text',
        name: '字符串',
        op: [
            { ...FILTER_OP.op9, match: 1 },
            { ...FILTER_OP.op1, match: 1 },
            { ...FILTER_OP.op2, match: 1 },
            { ...FILTER_OP.op3, match: 1 },
            { ...FILTER_OP.op4, match: 1 },
            { ...FILTER_OP.op5, match: 1 },
            { ...FILTER_OP.op6, match: 1 },
            { ...FILTER_OP.op7, match: 1 },
            { ...FILTER_OP.op8, match: 1 },
            // { ...FILTER_OP.op90, match: 1, defaultVal: 'empty' },
            // { ...FILTER_OP.op91, match: 1, defaultVal: 'empty' },
        ]
    },
    select: {
        id: 'select',
        cid: 'select',
        name: '选择', 
        op: [
            { ...FILTER_OP.op1, match: 2, optional: true },
            { ...FILTER_OP.op7, match: 7, optional: true, arraytype: true },
            { ...FILTER_OP.op2, match: 2 },
            // { ...FILTER_OP.op90, match: 1, defaultVal: 'empty' },
            // { ...FILTER_OP.op91, match: 1, defaultVal: 'empty' },
        ]
    },
    time: {
        id: 'time',
        cid: 'time',
        name: '时间',
        op: [
            { ...FILTER_OP.op1, match: 4 },
            { ...FILTER_OP.op9, match: 4 },
            { ...FILTER_OP.op2, match: 4 },
            { ...FILTER_OP.op3, match: 4 },
            { ...FILTER_OP.op4, match: 4 },
            { ...FILTER_OP.op5, match: 4 },
            { ...FILTER_OP.op6, match: 4 },
            { ...FILTER_OP.op12, match: 6 },
            { ...FILTER_OP.op13, match: 6 },
            { ...FILTER_OP.op14, match: 6 },
            { ...FILTER_OP.op15, match: 6 },
            { ...FILTER_OP.op17, match: 6 },
            { ...FILTER_OP.op16, match: 8 },
            // { ...FILTER_OP.op90, match: 1, defaultVal: 'empty' },
            // { ...FILTER_OP.op91, match: 1, defaultVal: 'empty' },
        ]
    },
    asstable: {
        id: 'asstable',
        cid: 'asstable',
        name: '关联表',
        op: [
            { ...FILTER_OP.op1, match: 99 },
            // { ...FILTER_OP.op90, match: 1, defaultVal: 'empty' },
            // { ...FILTER_OP.op91, match: 1, defaultVal: 'empty' },
        ]
    },
    tag: {
        id: 'tag',
        cid: 'tag',
        name: '标签',
        op: [
            { ...FILTER_OP.op1, match: 99 },
            // { ...FILTER_OP.op90, match: 1, defaultVal: 'empty' },
            // { ...FILTER_OP.op91, match: 1, defaultVal: 'empty' },
        ]
    },
    user: {
        id: 'user',
        cid: 'user',
        name: '用户',
        op: [
            { ...FILTER_OP.op1, match: 99 },
            { ...FILTER_OP.op2, match: 99 },
            // { ...FILTER_OP.op90, match: 1, defaultVal: 'empty' },
            // { ...FILTER_OP.op91, match: 1, defaultVal: 'empty' },
        ]
    },
    dept: {
        id: 'dept',
        cid: 'department',
        name: '部门',
        op: [
            { ...FILTER_OP.op1, match: 99 },
            { ...FILTER_OP.op2, match: 99 },
            // { ...FILTER_OP.op90, match: 1, defaultVal: 'empty' },
            // { ...FILTER_OP.op91, match: 1, defaultVal: 'empty' },
        ]
    },
    cascader: { 
        id: 'cascader',
        cid: 'cascader',
        name: '级联选择',
        op: [
            { ...FILTER_OP.op9, match: 99 },
            // { ...FILTER_OP.op90, match: 1, defaultVal: 'empty' },
            // { ...FILTER_OP.op91, match: 1, defaultVal: 'empty' },
        ]
    }
}
exports.FILTER_TYPE = FILTER_TYPE;

exports.FILTER_TYPE_ARY = Object.values(FILTER_TYPE);



const OP_TYPE = {
    op1: {
        name: '等于',
        value: '=',
        id: 'op1'
    },
    op2: {
        name: '不等于',
        value: '!=',
        id: 'op2'
    },
    op3: {
        name: '大于',
        value: '>',
        id: 'op3'
    },
    op4: {
        name: '大于等于',
        value: '>=',
        id: 'op4'
    },
    op5: {
        name: '小于',
        value: '<',
        id: 'op5'
    },
    op6: {
        name: '小于等于',
        value: '<=',
        id: 'op6'
    },
    op7: {
        name: '在其中',
        value: ['IN(', ')'],
        id: 'op7',
    },
    op8: {
        name: '不在其中',
        value: ['NOTIN(', ')'],
        id: 'op8'
    },
    op9: {
        name: '包含',
        value: ['LIKE(', ')'],
        id: 'op9'
    },
    op10: {
        name: '动态范围',
        value: '10',
        id: 'op10'
    }
}

module.exports = OP_TYPE;
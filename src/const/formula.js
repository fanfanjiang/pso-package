export const FORMULA = {
    //时间
    DATE: {
        id: 'DATE',
        info: '返回时间',
        input: "DATE(数字字段,数字字段,...)",
        example: "示例：DATE(2008, 7, 8) <br><br> 结果：Tue Jul 08 2008 00:00:00 GMT-0700 (PDT)",
        content: '',
        cursorLocation: -1
    },
    DATEVALUE: {
        id: 'DATEVALUE',
        info: '返回时间',
        input: "DATEVALUE('字符串')",
        example: "示例：DATEVALUE('8/22/2011') <br><br> 结果：Mon Aug 22 2011 00:00:00 GMT-0700 (PDT)",
        content: '',
        cursorLocation: -1
    },
    DAY: {
        id: 'DAY',
        info: '返回日期中的天数',
        input: "DAY('字符串')",
        example: "示例：DAY('15-Apr-11') <br><br> 结果：15",
        content: '',
        cursorLocation: -1
    },
    DAYS: {
        id: 'DAYS',
        info: '返回日期差',
        input: "DAY('字符串'，'字符串')",
        example: "示例：DAYS('3/15/11', '2/1/11') <br><br> 结果：42",
        content: '',
        cursorLocation: -1
    },
    HOUR: {
        id: 'HOUR',
        info: '返回小时数',
        input: "HOUR('字符串')",
        example: "示例：HOUR('7/18/2011 7:45:00 AM') <br><br> 结果：7",
        content: '',
        cursorLocation: -1
    },
    MINUTE: {
        id: 'MINUTE',
        info: '返回分钟数',
        input: "MINUTE('字符串')",
        example: "示例：MINUTE('2/1/2011 12:45:00 PM') <br><br> 结果：45",
        content: '',
        cursorLocation: -1
    },
    MONTH: {
        id: 'MONTH',
        info: '返回月数',
        input: "MONTH('字符串')",
        example: "示例：MONTH('15-Apr-11') <br><br> 结果：4",
        content: '',
        cursorLocation: -1
    },
    NOW: {
        id: 'NOW',
        info: '返回当前时间',
        input: "MONTH('字符串')",
        example: "示例：MONTH('15-Apr-11') <br><br> 结果：4",
        content: '',
        cursorLocation: -1
    },
    SECOND: {
        id: 'SECOND',
        info: '返回秒数',
        input: "SECOND('字符串')",
        example: "示例：SECOND('2/1/2011 4:48:18 PM') <br><br> 结果：18",
        content: '',
        cursorLocation: -1
    },
    WEEKDAY: {
        id: 'WEEKDAY',
        info: '返回星期',
        input: "WEEKDAY('字符串')",
        example: "示例：WEEKDAY('2/14/2008', 3) <br><br> 结果：3",
        content: '',
        cursorLocation: -1
    },
    YEAR: {
        id: 'YEAR',
        info: '返回年份',
        input: "YEAR('字符串')",
        example: "示例：YEAR('7/5/2008') 结果：2008",
        content: '',
        cursorLocation: -1
    },

    //逻辑
    AND: {
        id: 'AND',
        info: '任何一个参数的逻辑值为false，即返回false；只有当所有参数的逻辑值为true，才返回true',
        input: "AND ( logical1,logical2,... )",
        example: "示例：AND(true, false, true) 结果: 	false",
        content: '任何一个参数的逻辑值为false，即返回false；只有当所有参数的逻辑值为true，才返回true。logical:逻辑值，例如，2>1的逻辑值为true',
        cursorLocation: -1
    },
    IF: {
        id: 'IF',
        info: '根据判断条件的正确(true)或错误(false)，返回不同的值。',
        input: "IF ( 判断条件,真值,假值 )",
        example: "示例：IF(true, 'Hello!', 'Goodbye!') 结果: Hello!",
        content: '',
        cursorLocation: -1
    },
    FALSE: {
        id: 'FALSE',
        info: '布尔值false,无参数',
        input: "FALSE()",
        example: "示例：FALSE() 结果: false",
        content: '',
        cursorLocation: 0
    },
    TRUE: {
        id: 'TRUE',
        info: '布尔值true,无参数',
        input: "TRUE()",
        example: "示例：TRUE() 结果: true",
        content: '',
        cursorLocation: 0
    },
    IFS: {
        id: 'IF',
        info: '检查是否满足一个或多个条件，且返回符合第一个 TRUE 条件的值',
        input: "IFS(判断条件1，真值1，判断条件2（可选），真值2（可选），···)",
        example: "示例：IFS(false, 'Hello!', true, 'Goodbye!') 结果: Goodbye!",
        content: '',
        cursorLocation: -1
    },
    OR: {
        id: 'OR',
        info: '任何一个参数逻辑值为true，即返回true；只有当所有逻辑参数值为false，才返回false。',
        input: "OR ( logical1,logical2,... )",
        example: "示例：OR(true, false, true) 结果: true",
        content: '',
        cursorLocation: -1
    },
    NOT: {
        id: 'NOT',
        info: '返回参数逻辑值的反值。',
        input: "NOT ( logical1 )",
        example: "示例：NOT(true) 结果: false",
        content: '',
        cursorLocation: -1
    },
    XOR: {
        id: 'XOR',
        info: '返回所有参数的异或值。',
        input: "XOR ( logical1,logical2,... )",
        example: "示例：XOR(true, false, true) 结果: false",
        content: '',
        cursorLocation: -1
    },

    // 文本函数
    CHAR: {
        id: 'CHAR',
        info: '返回对应于数字代码的字符',
        input: "CHAR (数字)",
        example: "示例：CHAR(65) 结果: A",
        content: '',
        cursorLocation: -1
    },
    CLEAN: {
        id: 'CLEAN',
        info: '删除文本中所有不能打印的字符',
        input: "CHAR (字符串)",
        example: "示例：CLEAN('Monthly report') 结果: Monthly report",
        content: '',
        cursorLocation: -1
    },
    CODE: {
        id: 'CODE',
        info: '返回对应于字符的数字',
        input: "CODE (字符)",
        example: "示例：CODE('A') 结果: 65",
        content: '',
        cursorLocation: -1
    },
    CONCATENATE: {
        id: 'CONCATENATE',
        info: '将两个或多个文本字符串联接为一个字符串',
        input: "CONCATENATE (字符串,字符串..)",
        example: "示例：CONCATENATE('Andreas', ' ', 'Hauser') 结果: Andreas Hauser",
        content: '',
        cursorLocation: -1
    },
    EXACT: {
        id: 'EXACT',
        info: '比较两个文本字符串，如果它们完全相同，则返回 TRUE，否则返回 FALSE',
        input: "EXACT (字符串,字符串)",
        example: "示例：EXACT('Word', 'word') 结果: false",
        content: '',
        cursorLocation: -1
    },
    FIND: {
        id: 'FIND',
        info: '在第二个文本串中定位第一个文本串，并返回第一个文本串的起始位置的值',
        input: "FIND(find_text, within_text, [start_num])",
        example: "示例：FIND('M', 'Miriam McGovern', 3) 结果: 8",
        content: '',
        cursorLocation: -1
    },
    LEFT: {
        id: 'LEFT',
        info: '从文本字符串的第一个字符开始返回指定个数的字符',
        input: "LEFT(text, [num_chars])",
        example: "示例：LEFT('Sale Price', 4) 结果: Sale",
        content: '',
        cursorLocation: -1
    },
    LEN: {
        id: 'LEN',
        info: '返回文本串的字符数',
        input: "LEN('Phoenix, AZ')",
        example: "示例：LEFT('Sale Price', 4) 结果: 11",
        content: '',
        cursorLocation: -1
    },
    LOWER: {
        id: 'LOWER',
        info: '将一个文本字符串中的所有大写字母转换为小写字母',
        input: "LOWER(text)",
        example: "示例：LOWER('E. E. Cummings') 结果: e. e. cummings",
        content: '',
        cursorLocation: -1
    },
    MID: {
        id: 'MID',
        info: '返回文本字符串中从指定位置开始的特定数目的字符',
        input: "MID(text, start_num, num_chars)",
        example: "示例：MID('Fluid Flow', 7, 20) 结果: 	Flow",
        content: '',
        cursorLocation: -1
    },
    MID: {
        id: '',
        info: '',
        input: "",
        example: "",
        content: '',
        cursorLocation: -1
    },
    MID: {
        id: '',
        info: '',
        input: "",
        example: "",
        content: '',
        cursorLocation: -1
    },
    MID: {
        id: '',
        info: '',
        input: "",
        example: "",
        content: '',
        cursorLocation: -1
    },
    MID: {
        id: '',
        info: '',
        input: "",
        example: "",
        content: '',
        cursorLocation: -1
    },
    MID: {
        id: '',
        info: '',
        input: "",
        example: "",
        content: '',
        cursorLocation: -1
    },
    MID: {
        id: '',
        info: '',
        input: "",
        example: "",
        content: '',
        cursorLocation: -1
    }
}

export const FORMULA_LIST = [
    {
        name: '逻辑函数',
        list: [FORMULA.AND, FORMULA.IF, FORMULA.FALSE, FORMULA.TRUE, FORMULA.IFS, FORMULA.OR, FORMULA.NOT, FORMULA.XOR,
        ]
    },
    {
        name: '文本函数',
        list: [FORMULA.CHAR, FORMULA.CLEAN, FORMULA.CODE, FORMULA.CONCATENATE, FORMULA.EXACT, FORMULA.FIND, FORMULA.LEFT, FORMULA.LEN,
        FORMULA.LOWER, FORMULA.MID]
    },
    {
        name: '数字函数',
        list: []
    },
    {
        name: '时间函数',
        list: [FORMULA.DATE, FORMULA.DATEVALUE, FORMULA.DAY, FORMULA.DAYS, FORMULA.HOUR, FORMULA.MINUTE, FORMULA.MONTH,
        FORMULA.NOW, FORMULA.SECOND, FORMULA.WEEKDAY, FORMULA.YEAR]
    },
    {
        name: '财务函数',
        list: []
    },
    {
        name: '统计函数',
        list: []
    }
]
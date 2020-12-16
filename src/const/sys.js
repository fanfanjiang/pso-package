export const TP_TYPES = [
    {
        name: "页面插件",
        value: 0
    },
    {
        name: "统计插件",
        value: 1,
        router: '/statistics/:menu_code'
    },
    {
        name: "自定义插件",
        value: 2,
        router: '/bda/output/:menu_code'
    },
    {
        name: "图表插件",
        value: 3
    },
    {
        name: "CMS组件",
        value: 4
    },
    {
        name: "CMS页面",
        value: 5
    }
]

export const TP_NEW_TYPES = [
    {
        name: "页面插件",
        value: 0
    },
    {
        name: "统计插件",
        value: 1,
        router: '/statistics/:menu_code'
    },
    {
        name: "组合插件",
        value: 2,
        router: ''
    }
]

export const PLUGIN_PARAMS = {
    field: "", value: "", picker: "", name: "", saveType: "1", relateParam: ""
}

export const FORM_COLUMN_FIELDS = {
    field_name: '',
    display: '',
    width: "",
    using: "1",
    show: "1",
    align: "left",
    number: 0,
    sortable: "0",
    url: "",
    cal: "0",
    res_dimen: "",
    target_form: {},
    searchable: false,
    editable: false,
    clearZero: false,
    defSort: "", //默认排序类型
    defSortOrder: 0,//默认排序顺序
    docWidth: "",
    relatedShowField: "",
}

export const STATIC_COLUMN_FIELDS = {
    field: "",
    name: "",
    width: 120,
    show: "1",
    cal: "0",
    align: "left",
    number: 0,
    formulable: "0",
    formula: "",
    searchable: "0",
    searchList: [],
    searchType: '',
    searchOp: '',
    defaultVal: '',
    drillTarget: '',
    drillParams: []
}

export const FORM_UPLOAD_FIELDS = {
    field: "",
    name: "",
    type: "",
    enable: false
}

export const FORM_STATUS_FIELDS = {
    value: 0,
    name: "",
    color: "",
    display: "",
    uneditable: false,
    script: [],
    target: []
}

//请求接口中keys中的type
export const KEYS_TYPE = [
    {
        name: "等于",
        value: 1,
    },
    {
        name: "模糊查询",
        value: 2,
        array: true
    },
    {
        name: "时间区间段",
        value: 3,
    },
    {
        name: "IN查询",
        value: 4,
    },
    {
        name: "NOT IN查询",
        value: 5,
    },
    // {
    //     name: "多字段模糊查询",
    //     value: 6,
    // },
    {
        name: "反向区间段",
        value: 7,
        array: true
    },
    {
        name: "为空",
        value: 8,
    },
    {
        name: "不为空",
        value: 9,
    },
    // {
    //     name: "全部在其中",
    //     value: 99,
    // },
    {
        name: "大于",
        value: 20,
    },
    {
        name: "大于等于",
        value: 21,
    },
    {
        name: "小于",
        value: 22,
    },
    {
        name: "小于等于",
        value: 23,
    }
];

//权限
export const ATUH_FOLDER = [{ n: "无", v: 0 }, { n: "查看", v: 1 }, { n: "完全控制", v: 2 }];
export const ATUH_LEAF_FORM = [{ n: "新增", v: 1 }, { n: "更改", v: 2 }, { n: "导出", v: 4 }, { n: "更改阶段", v: 8 }];
export const ATUH_LEAF_WF = [{ n: "新增", v: 1 }, { n: "编辑", v: 2 }, { n: "删除", v: 4 }, { n: "发布", v: 8 }, { n: "审核", v: 16 }];

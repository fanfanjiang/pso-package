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
    }
]

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
    editable: false
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
    script: [],
    target: []
}
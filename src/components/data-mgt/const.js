export const ICONPREFIX = '/static/app/img/file-icon/';

export const _DATA = {
    tableData: [],
    colData: [],
    colCfg: {
        def: "",
        column: [],
    },
    actions: [],
    staData: [],
    pubCfg: {
        isPublic: false,
        authRequired: false,
        ruleable: false,
        showReturn: false,
        layout: '',
        stime: '',
        etime: '',
        attach: "",
        name: "",
        subBtnText: "提交",
        doneText: "已完成",
        errorText: "未启用",
        pageTitle: "",
        qrList: [],
        rules: [],
        submitable: true,
        formLabelPosition: "top",
        formLabelWith: "110px",
    },
    upload: {
        is_wf: "0",
        wf_code: "",
        mainfields: [],
        relate_table: "0",
        relate_type: "0",
        relate_unique: "",
        childTable: []
    },
    rules: [],
    subCfg: [],
    stageData: [],
    asstable: [],
    inner_api: {
        inner_type: "",
        async_type: "",
        async_stime: "",
        async_etime: "",
        inner_return: [],
        inner_params: {},
        field_config: {},
        api_tag: "",
        return_tag: "",
        incre_type: "",
        incre_field: "",
    },
    outer_api: {},
    ext_config: {
        quickInput: { enable: false, reg: '', relation: [] },
        notify: { content: '' }
    }
};
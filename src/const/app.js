export const CONFIG_TYPE = [{
    n: '基础配置',
    id: 0,
    cpnt: 'base',
    t: "",
    deletable: false,
    column: [
        { n: '系统名称', k: 'map_key0' },
        { n: 'LOGO', k: 'map_key1' },
        { n: 'LOGO底色', k: 'map_key5' },
        { n: '登录方式', k: 'map_key2' },
        { n: '注册方式', k: 'map_key3' },
        { n: '子系统数量', k: 'map_key4' },
        { n: '用户ID生成', k: 'map_key6' },
        { n: '注册执行脚本', k: 'map_key9' },
    ]
},
{
    n: '产品快链',
    id: 2,
    cpnt: 'product',
    t: "",
    deletable: true,
    column: [
        { n: '产品名称', k: 'map_key0' },
        { n: '产品链接', k: 'map_key1' },
    ]
},
{
    n: '工作台模块',
    id: 3,
    cpnt: 'deskitem',
    t: "",
    deletable: true,
    column: [
        { n: '模块名称', k: 'map_key0' },
        { n: '模块ID', k: 'map_key1' },
        { n: '默认高度', k: 'map_key2' },
        { n: '默认宽度', k: 'map_key3' },
        { n: '图标', k: 'map_key4' },
        { n: '更多地址', k: 'map_key5' },
    ]
},
{
    n: '系统应用分类',
    id: 4,
    cpnt: 'systype',
    t: "",
    deletable: true,
    column: [
        { n: '名称', k: 'map_key0' },
    ]
},
{
    n: '系统二级分类',
    id: 5,
    cpnt: 'syssectype',
    t: "",
    deletable: true,
    column: [
        { n: '名称', k: 'map_key0' },
        { n: '系统应用分类', k: 'map_key1' },
    ]
},
{
    n: '社会化注册',
    id: 6,
    cpnt: 'passport',
    t: "",
    deletable: false,
    column: [
        { n: 'ID', k: 'map_key0' },
        { n: '名称', k: 'map_key1' },
        { n: '是否启用', k: 'map_key2' },
        { n: '启用终端', k: 'map_key3' },
        { n: 'APPKEY', k: 'map_key4' },
        { n: 'APPSECRET', k: 'map_key5' },
        { n: '接口地址', k: 'map_key6' },
        { n: 'LOGO', k: 'map_key7' },
        { n: '自动创建用户', k: 'map_key8' },
        { n: '脚本', k: 'map_key9' },
    ]
},
{
    n: '消息一级分类',
    id: 9,
    cpnt: 'msgmain',
    t: "",
    deletable: false,
    column: [
        { n: 'ID', k: 'map_key0' },
        { n: '名称', k: 'map_key2' },
    ]
},
{
    n: '消息二级分类',
    id: 10,
    cpnt: 'msgsub',
    t: "",
    deletable: false,
    column: [
        { n: 'ID', k: 'map_key0' },
        { n: '一级分类', k: 'map_key1' },
        { n: '名称', k: 'map_key2' },
    ]
},
{
    n: '消息配置',
    id: 11,
    cpnt: 'sysmsg',
    t: "",
    deletable: false,
    column: [
        { n: 'ID', k: 'map_key0' },
        { n: '名称', k: 'map_key1' },
        { n: '时间', k: 'map_key2' },
        { n: '脚本', k: 'map_key9' },
    ]
},
{
    n: '快捷入口',
    id: 12,
    cpnt: 'entrance',
    t: "",
    deletable: true,
    column: [
        { n: '快捷入口名称', k: 'map_key0' },
        { n: '快捷入口图标', k: 'map_key1' },
        { n: '快捷入口类型', k: 'map_key2' },
        { n: '快捷入口', k: 'map_key3' },
        { n: '自定义分类', k: 'map_key4' },
        { n: '排序', k: 'map_key5' },
    ]
},
{
    n: '快捷入口类型',
    id: 13,
    cpnt: 'entrancetype',
    t: "",
    deletable: true,
    column: [
        { n: '类型ID', k: 'map_key0' },
        { n: '类型名称', k: 'map_key1' },
        { n: '排序', k: 'map_key2' },
        { n: '角色', k: 'map_key3' },
    ]
},
{
    n: '自定义流程',
    id: 14,
    cpnt: 'customwf',
    t: "",
    deletable: true,
    column: [
        { n: '自定义名称', k: 'map_key0' },
        { n: '流程', k: 'map_key1' },
        { n: '流程菜单', k: 'map_key2' },
    ]
},
{
    n: '其它应用入口',
    id: 31,
    cpnt: 'app',
    t: "",
    deletable: true,
    column: [
        { n: '应用名称', k: 'map_key0' },
        { n: '应用图片', k: 'map_key1' },
        { n: '应用地址', k: 'map_key2' },
    ]
},
{
    n: '流程消息配置',
    id: 15,
    cpnt: 'wfmsgcfg',
    t: "",
    deletable: true,
    column: [
        { n: '配置ID', k: 'map_key0' },
        { n: '配置名称', k: 'map_key1' },
        { n: '消息分类', k: 'map_key2' },
        { n: '消息子类', k: 'map_key3' },
        { n: '提醒方式', k: 'map_key4' },
        { n: '消息目标', k: 'map_key5' },
        { n: '到期处理方式', k: 'map_key6' },
        { n: '自发消息', k: 'map_key7' },
        { n: '是否默认所有流程', k: 'map_key8' },
        { n: '关联流程', k: 'map_key9' },
    ]
},
{
    n: '消息模板配置',
    id: 16,
    cpnt: 'msgtemplate',
    t: "",
    deletable: true,
    column: [
        { n: '模板ID', k: 'map_key0' },
        { n: '模板名称', k: 'map_key1' },
        { n: '模板类型', k: 'map_key2' },
        { n: '模板标识', k: 'map_key3' },
        { n: '模板关联', k: 'map_key4' },
        { n: '字段配置', k: 'map_key9' },
    ]
},
{
    n: '资源分类配置',
    id: 80,
    cpnt: 'resource',
    t: "",
    deletable: true,
    column: [
        { n: '绑定栏目', k: 'map_key2' },
        { n: '保存类型', k: 'map_key3' },
        { n: '是否重命名', k: 'map_key4' },
        { n: '是否覆盖', k: 'map_key5' },
        { n: '是否分类', k: 'map_key6' },
        { n: '分类名称', k: 'map_key7' },
    ]
},
{
    n: '资源控制',
    id: 99,
    cpnt: 'appcontrol',
    t: "",
    deletable: true,
    column: [
        { n: '关联站点', k: 'map_key0' },
        { n: '节点数', k: 'map_key1' },
        { n: '资源容量', k: 'map_key2' },
        { n: '数据容量', k: 'map_key3' },
        { n: '过期时间', k: 'map_key4' },
    ]
},
{
    n: '脚本参数',
    id: 100,
    cpnt: 'script',
    t: "",
    deletable: true,
    column: [
        { n: '配置名称', k: 'map_key0' },
        { n: '标记', k: 'map_key1' },
        { n: '表单', k: 'map_key2' },
        { n: '值字段', k: 'map_key3' },
        { n: '参数字段', k: 'map_key4' },
    ]
},
{
    n: 'AUTH',
    id: -1,
    cpnt: '',
    t: "",
    deletable: true,
    column: [
        { n: 'key', k: 'map_key0' },
    ]
}];

export const ENTRANCE_TYPE = [
    { n: "流程", v: "workflow" },
    { n: "表单", v: "form" },
    { n: "菜单", v: "menu" }
]

//插件参数
export const PLUGIN_PARAMS_TREE = [
    { field: "data_type", value: "", picker: "picker-tag", name: "维度", saveType: "1", relateParam: "", tip: '选择数据维度' },
];

export const PLUGIN_PARAMS_ASSTABLE = [
    { field: "asstables", value: "", picker: "picker-field", name: "显示关联表", saveType: "2", relateParam: "cfgId", tip: '选择需要显示操作的关联表' },
];

const getKeysOption = (relateParam, field = 'defKeys', name = '数据约束条件', order = 10, tip = '配置数据获取限制条件，可以手动设置') => {
    return { field, value: "", picker: "picker-dfilter", name, saveType: "1", relateParam, tip, order }
}

//字段对应关系
const getMatchOption = (relateParam, field = 'fmatchup', name = '字段对应关系', order = 10) => {
    return { field, value: [], picker: "picker-fmatchup", name, saveType: "2", relateParam, tip: '设置两表单之间的字段对应关系', order }
}

export const PLUGIN_PARAMS_VIEW = [
    { field: "searchType", value: "", picker: "input", name: "搜索类型", saveType: "1", relateParam: "", tip: '下个版本将废弃，请勿使用', order: 11 },
    { field: "hideAuthTab", value: false, picker: "picker-yes", name: "隐藏权限切换", saveType: "1", relateParam: "", tip: '开启则会隐藏页面右上角的全部、部门等数据查看切换按钮', order: 12 },
    { field: "hideStatusTab", value: false, picker: "picker-yes", name: "隐藏状态切换", saveType: "1", relateParam: "", tip: '开启则会隐藏状态切换按钮', order: 13 },
    { field: "hideNewBtn", value: false, picker: "picker-yes", name: "隐藏新增按钮", saveType: "1", relateParam: "", tip: '开启则会强制隐藏新增按钮', order: 14 },
    { field: "hideChangeBtn", value: false, picker: "picker-yes", name: "隐藏更改按钮", saveType: "1", relateParam: "", tip: '开启则会强制隐藏更改按钮', order: 15 },
    { field: "hideStage", value: false, picker: "picker-yes", name: "隐藏阶段按钮", saveType: "1", relateParam: "", tip: '开启则会强制隐藏阶段按钮', order: 16 },
    { field: "hideCopyBtn", value: false, picker: "picker-yes", name: "隐藏复制按钮", saveType: "1", relateParam: "", tip: '开启则会强制隐藏复制按钮', order: 17 },
    { field: "hideActions", value: false, picker: "picker-yes", name: "隐藏动作按钮", saveType: "1", relateParam: "", tip: '开启则会强制隐藏动作按钮', order: 18 },
    { field: "hideMoreBtn", value: false, picker: "picker-yes", name: "隐藏更多按钮", saveType: "1", relateParam: "", tip: '开启则会强制隐藏更多按钮', order: 19 },
    { field: "hideTablefun", value: false, picker: "picker-yes", name: "隐藏功能按钮", saveType: "1", relateParam: "", tip: '开启则会强制隐藏非查询相关按钮', order: 20 },
    { field: "displayRow", value: "", picker: "picker-select", name: "布局", saveType: "1", relateParam: "", options: [{ n: '上下', v: "1" }, { n: '左右', v: "0" }], tip: '选择页面的布局方式', order: 21 },
    { field: "bottomHeight", value: "", picker: "input", name: "页面内容大小", saveType: "1", relateParam: "", tip: '页面主要内容部分所占的宽度或者高度,单位为px或者%!', order: 22 },
    { field: "textGroup", value: "", picker: "picker-text", name: "文本组", saveType: "1", relateParam: "", tip: '选择在插件中设置的文本以改变页面元素显示的文字', order: 23 },
    { field: "downloadFiles", value: "", picker: "picker-file", name: "文件下载", saveType: "1", relateParam: "", tip: '选择文件，用户可以在页面上快速下载次文件', order: 24 },
];

export const PLUGIN_PARAMS_FORM = [
    { field: "cfgId", value: "", picker: "picker-form", name: "表单", saveType: "1", relateParam: "", tip: "", order: 1 },
    { field: "useCloumn", value: "", picker: "picker-column", name: "视图", relateParam: "cfgId", saveType: "1", tip: "选择一个表单中配置的视图", order: 2 },
    { field: "defComplexity", value: "", picker: "input", name: "复杂条件", saveType: "1", relateParam: "", tip: "", order: 23 },
    ...PLUGIN_PARAMS_VIEW,
    getKeysOption('cfgId'),
    getKeysOption('cfgId', 'defFormValue', '默认值', 11, '默认值'),
];

export const PLUGIN_PARAMS_WORKFLOW = [
    { field: "wfId", value: "", picker: "picker-wf", name: "流程", saveType: "1", relateParam: "", order: 1 },
    { field: "useCloumn", value: "", picker: "picker-column", name: "视图", relateParam: "wfId", saveType: "1", tip: "选择一个表单中配置的视图", order: 2 },
    ...PLUGIN_PARAMS_VIEW,
    getKeysOption('wfId'),
    getKeysOption('wfId', 'defFormValue', '默认值', 11, '默认值'),
    { field: "hideArchiveBtn", value: "", picker: "picker-yes", name: "隐藏归档按钮", saveType: "1", relateParam: "", tip: '开启则会强制隐藏归档按钮', order: 19 },
    { field: "hideBackBtn", value: "", picker: "picker-yes", name: "隐藏撤销按钮", saveType: "1", relateParam: "", tip: '开启则会强制隐藏撤销按钮', order: 19 },
];

export const PLUGIN_DEFAULT = [
    { n: '表单视图', id: "pso-form-view", path: '/form/list/:menu_code', type: 0, params: PLUGIN_PARAMS_FORM },
    { n: '表单树-表单视图', id: "pso-ftree-fv", path: '/form/list-tree/:menu_code', type: 0, params: PLUGIN_PARAMS_TREE.concat(PLUGIN_PARAMS_FORM) },
    { n: '表单视图-关联子表', id: "pso-fv-ast", path: '/form/list-sub/:menu_code', type: 0, params: PLUGIN_PARAMS_ASSTABLE.concat(PLUGIN_PARAMS_FORM) },
    {
        n: '表单视图-流程视图', id: "pso-fv-wv", path: '/form/list-flow/:menu_code', type: 0, params: PLUGIN_PARAMS_FORM.concat([
            { field: "wfId", value: "", picker: "picker-wf", name: "关联流程", saveType: "1", relateParam: "", order: 30 },
            { field: "wfTextGroup", value: "", picker: "picker-text", name: "关联流程文本", saveType: "1", relateParam: "", order: 31 },
            getKeysOption('wfId', 'wfDefKeys', '流程数据约束条件', 32),
            getMatchOption('cfgId,wfId', 'fmatchup', '字段对应关系', 32),
            { field: "wfSearchType", value: "", picker: "input", name: "流程数据搜索类型", saveType: "1", relateParam: "", tip: '下个版本将废弃，请勿使用', order: 33 },
            { field: "formSourceField", value: "", picker: "picker-field", name: "表单关联流程字段", saveType: "1", relateParam: "cfgId", order: 34 },
            { field: "wfTargetField", value: "", picker: "picker-field", name: "流程关联表单字段", saveType: "1", relateParam: "wfId", order: 35 },
        ])
    },
    {
        n: '表单视图-表单视图', id: "pso-fv-fv", path: '/form/form-form/:menu_code', type: 0, params: PLUGIN_PARAMS_FORM.concat([
            { field: "ass__cfgId", value: "", picker: "picker-form", name: "关联表单", saveType: "1", relateParam: "" },
            getKeysOption('ass__cfgId', 'ass__defKeys', '关联数据约束条件', 32),
            getMatchOption('cfgId,ass__cfgId', 'fmatchup', '字段对应关系', 32),
            { field: "sourceField", value: "", picker: "picker-field", name: "主表关联关联表字段", saveType: "1", relateParam: "cfgId" },
            { field: "targetField", value: "", picker: "picker-field", name: "关联表关联主表字段", saveType: "1", relateParam: "ass__cfgId" },
        ])
    },
    {
        n: '表单视图-多表单视图', id: "pso-fv-multifv", path: '/composite/fv-multifv/:menu_code', type: 0, params: PLUGIN_PARAMS_FORM.concat([
            { field: "relateto", value: [], picker: "formrelate", name: "表单关系", saveType: "2", relateParam: "cfgId", order: 40 },
        ])
    },
    {
        n: '多表单视图', id: "pso-multifv", path: '/composite/multifv/:menu_code', type: 0, params: [
            { field: "multifv", value: [], picker: "multifv", name: "表单视图", saveType: "2", relateParam: "", order: 40 },
        ]
    },
    {
        n: '树-表单视图', id: "pso-tree-fv", path: '/form/tree-form/:menu_code', type: 0, params: PLUGIN_PARAMS_FORM.concat([
            { field: "tree_data_type", value: "", picker: "picker-tag", name: "树维度类型", saveType: "1", relateParam: "" },
            { field: "tree_dimen", value: "", picker: "input", name: "树维度", saveType: "1", relateParam: "" },
            { field: "sourceField", value: "", picker: "input", name: "树源字段", saveType: "1", relateParam: "" },
            { field: "targetField", value: "", picker: "picker-field", name: "关联表关联主表字段", saveType: "1", relateParam: "cfgId" },
        ])
    },
    {
        n: '表单视图树', id: "pso-fvtree", path: '/fvtree/:menu_code', type: 0, params: [
            { field: "fvtree", value: "", picker: "", name: "配置", saveType: "2", relateParam: "" },
        ]
    },
    {
        n: '表单视图-资源文件', id: "pso-fv-srcv", path: '/fv-srcv/:menu_code', type: 0, params: PLUGIN_PARAMS_FORM.concat({ field: "opable", value: true, picker: "picker-yes", name: "开启操作模式", saveType: "1", relateParam: "" })
    },
    {
        n: '流程视图', id: "pso-wf-view", path: '/wf/list/:menu_code', type: 0, params: PLUGIN_PARAMS_WORKFLOW
    },
    {
        n: '流程树-表单视图', id: "pso-wtree-fv", path: '/wf/list-tree/:menu_code', type: 0, params: PLUGIN_PARAMS_TREE.concat(PLUGIN_PARAMS_FORM)
    },
    {
        n: '流程树-流程视图', id: "pso-wtree-wv", path: '/wf/list-tree-form/:menu_code', type: 0, params: PLUGIN_PARAMS_TREE.concat(PLUGIN_PARAMS_WORKFLOW)
    },
    {
        n: '树-流程时间线', id: "pso-tree-timeline", path: '/wf/list-timeline/:menu_code', type: 0, params: PLUGIN_PARAMS_TREE
    },
    {
        n: '流程视图-关联子表', id: "pso-wv-ast", path: '/wf/wf-list-asstable/:menu_code', type: 0, params: PLUGIN_PARAMS_WORKFLOW.concat([
            { field: "asstables", value: "", picker: "picker-field", name: "关联子表字段", saveType: "2", relateParam: "wfId" },
        ])
    },
    {
        n: '插件管理', id: "pso-templete-mgt", path: '/templete-mgt/:menu_code', type: 0, params: PLUGIN_PARAMS_TREE
    },
    {
        n: '菜单管理', id: "pso-menu-mgt", path: '/menu-mgt/:menu_code', type: 0, params: PLUGIN_PARAMS_TREE
    },
    {
        n: '流程管理', id: "pso-wf-mgt", path: '/wf-mgt/:menu_code', type: 0, params: PLUGIN_PARAMS_TREE
    },
    {
        n: '表单管理', id: "pso-data-mgt", path: '/data-mgt/:menu_code', type: 0, params: PLUGIN_PARAMS_TREE
    },
    {
        n: '维度管理', id: "pso-dimen-mgt", path: '/dimen-mgt', type: 0, params: []
    },
    {
        n: '标签管理', id: "pso-tag-mgt", path: '/tag-mgt/:menu_code', type: 0, params: PLUGIN_PARAMS_TREE
    },
    {
        n: '知识管理', id: "pso-knowl-mgt", path: '/knowl-mgt/:menu_code', type: 0, params: PLUGIN_PARAMS_TREE.concat([
            { field: "defKeys", value: "", picker: "input", name: "数据约束条件", saveType: "1", relateParam: "" },
            { field: "mgtable", value: "", picker: "picker-yes", name: "是否管理", saveType: "1", relateParam: "" },
        ])
    },
    {
        n: '标签动态页面', id: "pso-tag-any", path: '/tag-list/:menu_code', type: 0, params: PLUGIN_PARAMS_TREE.concat([
            { field: "where", value: "", picker: "input", name: "表单关联", saveType: "1", relateParam: "" },
        ])
    },
    {
        n: 'SQL标签页面', id: "pso-node-any", path: '/composite/node-any/:menu_code', type: 0, params: PLUGIN_PARAMS_TREE.concat([
            { field: "__sql__", value: "", picker: "picker-sql", name: "脚本", saveType: "1", relateParam: "" },
        ])
    },
    {
        n: '表单视图-统计视图', id: "pso-fv-stats", path: '/fv-stats/:menu_code', type: 0, params: PLUGIN_PARAMS_FORM.concat([
            { field: "__relatedstatus__", value: "", picker: "picker-stats", name: "关联统计", saveType: "3", relateParam: "cfgId" },
        ])
    },
];

export default {
    PLUGIN_DEFAULT,
    PLUGIN_PARAMS_FORM,
    PLUGIN_PARAMS_WORKFLOW
}

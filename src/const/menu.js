export const MENU_TYPE = [{
    n: '插件',
    v: 1
}, {
    n: '链接',
    v: 2
}];

export const OPEN_TYPE = [{
    n: '默认',
    v: 1
}, {
    n: '新页面',
    v: 2
}];

//模板参数设置控件类型
export const TP_CTL_TYPE = [
    {
        n: '维度选择器',
        v: 'picker-tag'
    },
    {
        n: '表单选择器',
        v: 'picker-form'
    },
    {
        n: '流程选择器',
        v: 'picker-wf'
    },
    {
        n: '文本选择器',
        v: 'picker-text'
    },
    {
        n: '文本',
        v: 'input'
    }
];

//leaf节点权限
export const MENU_LEAF_AUTH = [
    { n: "仅个人", v: 0 },
    { n: "仅部门", v: 1 },
    { n: "仅岗位", v: 2 },
    { n: "全部", v: 4 }
];

export const FORM_AUTH = [
    { n: "仅个人", v: 0 },
    { n: "仅部门", v: 1 },
    { n: "仅岗位", v: 2 },
    { n: "全部", v: 4 },
    { n: "内容查看", v: 8 },
];
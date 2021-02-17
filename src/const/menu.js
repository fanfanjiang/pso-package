export const MENU_TYPE = [{
    n: '插件',
    v: 1
}, {
    n: '链接',
    v: 2
}];

export const OPEN_TYPE = [{
    n: '默认',
    v: '1'
}, {
    n: '新页面',
    v: '2'
}, {
    n: 'IFRAME',
    v: '3'
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
        n: '字段选择器',
        v: 'picker-field'
    },
    {
        n: '列表选择器',
        v: 'picker-column'
    },
    {
        n: '是否',
        v: 'picker-yes'
    },
    {
        n: '统计字段选择器',
        v: 'picker-stafield'
    },
    {
        n: '统计脚本编辑器',
        v: 'picker-staFormula'
    },
    {
        n: '菜单选择器',
        v: 'picker-menu'
    },
    {
        n: '文件选择器',
        v: 'picker-file'
    },
    {
        n: '文本',
        v: 'input'
    },
    {
        n: 'SQL脚本编辑器',
        v: 'picker-sql'
    },
    {
        n: '统计关联器',
        v: 'picker-stats'
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
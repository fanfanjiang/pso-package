export const ICONPREFIX = '/static/app/img/file-icon/';

export const SHEET = {
    form: {
        id: 'form',
        name: '动态表单',
        icon: [`${ICONPREFIX}/form.png`, `${ICONPREFIX}/form_expand.png`],
    },
    excel: {
        id: 'excel',
        name: 'EXCEL表单',
        icon: [`${ICONPREFIX}/excel.png`, `${ICONPREFIX}/excel_expand.png`],
    },
    xml: {
        id: 'xml',
        name: 'XML表单',
        icon: [`${ICONPREFIX}/xml.png`, `${ICONPREFIX}/xml_expand.png`],
    },
    sql: {
        id: 'sql',
        name: 'SQL视图',
        icon: [`${ICONPREFIX}/sql.png`, `${ICONPREFIX}/sql_expand.png`],
    }
}

export const SHEET_MENU = [{
    name: SHEET.form.name,
    id: SHEET.form.id,
    icon: SHEET.form.icon,
    tip: "动态表单创建"
},
{
    name: SHEET.excel.name,
    id: SHEET.excel.id,
    icon: SHEET.excel.icon,
    tip: "上传excel文件"
},
{
    name: SHEET.xml.name,
    id: SHEET.xml.id,
    icon: SHEET.xml.icon,
    tip: "上传xml文件"
},
{
    name: SHEET.sql.name,
    id: SHEET.sql.id,
    icon: SHEET.sql.icon,
    tip: "编写SQL语句来生成新的工作表，以新建图表"
}]
export const DEFAULT = {
    child_id: "",
    child_name: "",
    child_cate: "",
    child_cate: "",
    child_status: 1,
    child_content: "",
    child_data: "",
    child_design: "",
}

export const CPNT = {
    chart: {
        id: "chart",
        name: "图表",
        data: {
            w: 8,
            h: 8,
            design: {}
        }
    },
    text: {
        id: "text",
        name: "文本",
        data: {
            w: 8,
            h: 4
        }
    }
}

export const MENU = [
    {
        name: '通用',
        children: [CPNT.chart, CPNT.text]
    },
    {
        name: '项目管理',
        children: []
    }
]
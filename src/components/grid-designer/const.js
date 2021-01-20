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

export const DATAFIELDS = {
    sourceType: '0', //数据源类型
    source: '', //数据源标记
    useCloumn: '',//列表
    defKeys: '',
    defComplexity: '',
    limit: 0,
    fieldTitle: '',
    fieldPic: '',
    fieldTime: '',
    timeAgo: true,
    moreable: false, //显示更多
    paging: false, //显示分页
    viewAuth: '4', //权限
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
    },
    todo: {
        id: "todo",
        name: "我的待办",
        data: {
            w: 8,
            h: 4
        }
    },
    dataview: {
        id: "dataview",
        name: "通用图文列表",
        data: {
            ...DATAFIELDS,
            w: 8,
            h: 8,
            withCalendar: false,
            calendarTime: '',
            fieldContent: [],
            actions: [],
        }
    },
    carousel: {
        id: "carousel",
        name: "轮播图（走马灯）",
        data: {
            ...DATAFIELDS,
            w: 24,
            h: 6,
            fieldContent: [],
            actions: [],
        }
    }
}

export const MENU = [
    {
        name: '通用',
        children: [CPNT.dataview, CPNT.chart, CPNT.carousel, CPNT.text]
    },
    {
        name: '流程相关',
        children: [CPNT.todo]
    },
    {
        name: '项目管理',
        children: []
    }
]
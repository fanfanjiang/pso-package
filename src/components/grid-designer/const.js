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

export const MORETYPES = [
    { n: "手动录入", v: "0" },
    { n: "选择菜单", v: "1" },
];

export const COMMONFIELDS = {
    moreable: false, //显示更多
    moreType: '0',
    moreTarget: '',
    headerBgColor: '#fff',
    headerTextColor: '#666',
    styleType: '0'
}

export const DATABASE = {
    sourceType: '0', //数据源类型
    source: '', //数据源标记
    defKeys: '',
    defComplexity: '',
    viewAuth: '4', //权限
    useCloumn: '',//列表
    limit: 0,
}

const DATADETAIL = () => {
    return {
        fieldTitle: '',
        fieldPic: '',
        fieldTime: '',
        fieldAbs: '',
        fieldMain: '',
        picMode: false,
        fieldContent: [],
        timeAgo: true,
    }
}

export const DATAFUNC = {
    ...COMMONFIELDS,
    ...DATABASE,
    ...DATADETAIL(),
    paging: false, //显示分页
    titleClickable: true,
    titleClickType: '1',
    titleClickVal: ''
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
            w: 7,
            h: 12
        }
    },
    dataview: {
        id: "dataview",
        name: "通用图文列表",
        data: {
            ...DATAFUNC,
            w: 8,
            h: 8,
            withCalendar: false,
            calendarTime: '',
            actions: [],
        }
    },
    datadetail: {
        id: "datadetail",
        name: "数据详情",
        data: {
            ...COMMONFIELDS,
            ...DATABASE,
            ...DATADETAIL(),
            w: 8,
            h: 8,
            limit: 1,
            dataId: '' //数据唯一ID
        }
    },
    carousel: {
        id: "carousel",
        name: "轮播图",
        data: {
            ...DATAFUNC,
            w: 24,
            h: 10,
        }
    },
    nav: {
        id: "nav",
        name: "导航",
        data: {
            ...COMMONFIELDS,
            w: 8,
            h: 8,
            style: '',
            menus: [],
        }
    },

    //系统模块
    todo: {
        id: "todo",
        name: "我的待办",
        data: {
            w: 10,
            h: 8
        }
    },
    app: {
        id: "app",
        name: "其它应用入口",
        data: {
            w: 7,
            h: 8,
        }
    },
    entrance: {
        id: "entrance",
        name: "快捷入口",
        data: {
            w: 7,
            h: 12,
        }
    },
    knowledge: {
        id: "knowledge",
        name: "知识库",
        data: {
            w: 7,
            h: 8,
        }
    },
    meeting: {
        id: "meeting",
        name: "近期会议",
        data: {
            w: 7,
            h: 12,
        }
    },
    news: {
        id: "news",
        name: "企业动态",
        data: {
            w: 7,
            h: 12,
        }
    },


    //项目管理
    proindex: {
        id: "proindex",
        name: "项目信息一览",
        data: {
            ...COMMONFIELDS,
            w: 10,
            h: 18,
        }
    },
    prosale: {
        id: "prosale",
        name: "销售项目情况",
        data: {
            ...COMMONFIELDS,
            w: 10,
            h: 18,
        }
    },
    prosalestatus: {
        id: "prosalestatus",
        name: "销售项目状态情况",
        data: {
            ...COMMONFIELDS,
            w: 7,
            h: 8,
        }
    },
    propersonnel: {
        id: "propersonnel",
        name: "人事概况",
        data: {
            ...COMMONFIELDS,
            w: 7,
            h: 8,
        }
    },
    prorecruitment: {
        id: "prorecruitment",
        name: "今日招聘",
        data: {
            ...COMMONFIELDS,
            w: 7,
            h: 8,
        }
    }
}

export const MENU = [
    {
        name: '通用',
        children: [CPNT.dataview, CPNT.datadetail, CPNT.chart, CPNT.carousel, CPNT.nav, CPNT.text]
    },
    {
        name: '系统功能',
        children: [CPNT.todo, CPNT.app, CPNT.entrance, CPNT.knowledge, CPNT.meeting, CPNT.news]
    },
    {
        name: '项目管理',
        children: [CPNT.proindex, CPNT.prosale, CPNT.prosalestatus, CPNT.propersonnel, CPNT.prorecruitment]
    }
]
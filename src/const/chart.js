export const SORT = {
    DEFAULT: '默认',
    ASC: '升序',
    DESC: "降序",
}

export const SORT_VAL = {
    [SORT.DEFAULT]: '',
    [SORT.ASC]: 'asc',
    [SORT.DESC]: "desc",
}

//维度操作
export const DIMEN_OP = {
    YEAR: '按年',
    QUARTER: '按季度',
    MONTH: "按月",
    WEAK: "按周",
    DAY: "按日",
}

export const DIMEN_OP_LIST = {
    datetime: [DIMEN_OP.YEAR, DIMEN_OP.QUARTER, DIMEN_OP.MONTH, DIMEN_OP.WEAK, DIMEN_OP.DAY]
}

export const FIGER_OP = {
    SUM: '求和',
    COUNT: "计数",
    AVG: '平均值'
}

export const FIGER_OP_LIST = {
    decimal: [FIGER_OP.SUM, FIGER_OP.COUNT, FIGER_OP.AVG],
    string: [FIGER_OP.COUNT],
    datetime: [FIGER_OP.COUNT]
}

export const FIGER_DEFALUT_OP = {
    decimal: FIGER_OP.SUM,
    string: FIGER_OP.COUNT,
    datetime: FIGER_OP.COUNT,
}

export const CHART = {
    table: {
        icon: "",
        name: '表格',
        id: "table",
        info: '0个或多个维度<br>0个或多个数值',
        dimensionType: 'array',
        metricsType: 'array',
        dimensionLimit: 9999,
        metricsLimit: 9999,
    },
    card: {
        icon: "",
        name: '指标卡',
        id: "card",
        info: '0个维度<br>1个或2个数值',
        dimensionType: 'array',
        metricsType: 'array',
        dimensionLimit: 0,
        metricsLimit: 2,
    },
    line: {
        icon: "",
        name: '折线图',
        id: "line",
        info: '0个或多个维度<br>0个或多个数值',
        dimensionType: 'array',
        metricsType: 'array',
        dimensionLimit: 9999,
        metricsLimit: 9999,
    },
    histogram: {
        icon: "",
        name: '柱图',
        id: "histogram",
        info: '0个或多个维度<br>0个或多个数值',
        dimensionType: 'array',
        metricsType: 'array',
        dimensionLimit: 9999,
        metricsLimit: 9999,
        extend: {
            series: {
                label: { show: true, position: "top" }
            }
        }
    },
    bar: {
        icon: "",
        name: '条形图',
        id: "bar",
        info: '0个或多个维度<br>0个或多个数值',
        dimensionType: 'array',
        metricsType: 'array',
        dimensionLimit: 9999,
        metricsLimit: 9999,
        extend: {
            series: {
                label: { show: true, position: "right" }
            }
        }
    },
    pie: {
        icon: "",
        name: '饼图',
        id: "pie",
        info: '0个或多个维度<br>0个或多个数值',
        dimensionType: 'string',
        metricsType: 'string',
        dimensionLimit: 9999,
        metricsLimit: 1,
    },
    ring: {
        icon: "",
        name: '环图',
        id: "ring",
        info: '1个维度<br>1个数值',
        dimensionType: 'string',
        metricsType: 'string',
        dimensionLimit: 1,
        metricsLimit: 1,
        setting: {
            offsetY: 170,
            radius: [60, 80],
            label: {
                formatter: '{b|{b}：}{c} {per|{d}%}',
                rich: {
                    a: {
                        color: '#999',
                        lineHeight: 22,
                        align: 'center'
                    },
                    b: {
                        fontSize: 12,
                        lineHeight: 33
                    },
                    per: {
                        color: '#eee',
                        backgroundColor: '#334455',
                        padding: [2, 4],
                        borderRadius: 2
                    }
                }
            }
        }
    },
    waterfall: {
        icon: "",
        name: '瀑布图',
        id: "waterfall",
        info: '1个维度<br>1个数值',
        dimensionType: 'string',
        metricsType: 'string',
        dimensionLimit: 1,
        metricsLimit: 1,
    },
    funnel: {
        icon: "",
        name: '漏斗图',
        id: "funnel",
        info: '0个或多个维度<br>0个或多个数值',
        dimensionType: 'string',
        metricsType: 'string',
        dimensionLimit: 1,
        metricsLimit: 1,
    },
    radar: {
        icon: "",
        name: '雷达图',
        id: "radar",
        info: '0个或多个维度<br>0个或多个数值',
        dimensionType: 'array',
        metricsType: 'array',
        dimensionLimit: 9999,
        metricsLimit: 9999,
    },
    map: {
        icon: "",
        name: '地图',
        id: "map",
        info: '0个或多个维度<br>0个或多个数值',
        dimensionType: 'array',
        metricsType: 'array',
        dimensionLimit: 9999,
        metricsLimit: 9999,
    },
    sankey: {
        icon: "",
        name: '桑基图',
        id: "sankey",
        info: '0个或多个维度<br>0个或多个数值',
        dimensionType: 'string',
        metricsType: 'string',
        dimensionLimit: 1,
        metricsLimit: 1,
    },
    heatmap: {
        icon: "",
        name: '热力图',
        id: "heatmap",
        info: '0个或多个维度<br>0个或多个数值',
        dimensionType: 'array',
        metricsType: 'string',
        dimensionLimit: 9999,
        metricsLimit: 1,
    },
    scatter: {
        icon: "",
        name: '散点图',
        id: "scatter",
        info: '0个或多个维度<br>0个或多个数值',
        dimensionType: 'string',
        metricsType: 'array',
        dimensionLimit: 1,
        metricsLimit: 9999,
    },
    candle: {
        icon: "",
        name: 'K线图',
        id: "candle",
        info: '0个或多个维度<br>0个或多个数值',
        dimensionType: 'string',
        metricsType: 'array',
        dimensionLimit: 1,
        metricsLimit: 9999,
    },
    gauge: {
        icon: "",
        name: '仪表盘',
        id: "gauge",
        info: '0个或多个维度<br>0个或多个数值',
        dimensionType: 'string',
        metricsType: 'string',
        dimensionLimit: 1,
        metricsLimit: 1,
    },
    // liquidfill: {
    //     icon: "",
    //     name: '水球图',
    //     id: "liquidfill",
    //     info: '0个或多个维度<br>0个或多个数值',
    //     dimensionType: 'string',
    //     metricsType: 'string',
    //     dimensionLimit: 1,
    //     metricsLimit: 1,
    // },
    // wordcloud: {
    //     icon: "",
    //     name: '云词图',
    //     id: "wordcloud",
    //     info: '0个或多个维度<br>0个或多个数值',
    //     dimensionType: 'string',
    //     metricsType: 'string',
    //     dimensionLimit: 1,
    //     metricsLimit: 1,
    // }
}

export const CONFIG_TYPE = [{
    n: '工作台模块',
    id: 3,
    cpnt: 'deskitem',
    t: "",
    column: [
        { n: '模块名称', k: 'map_key0' },
        { n: '模块ID', k: 'map_key1' },
        { n: '默认高度', k: 'map_key2' },
        { n: '默认宽度', k: 'map_key3' },
        { n: '图标', k: 'map_key4' },
    ]
}, {
    n: '快捷入口',
    id: 12,
    cpnt: 'entrance',
    t: "",
    column: [
        { n: '快捷入口名称', k: 'map_key0' },
        { n: '快捷入口图标', k: 'map_key1' },
        { n: '快捷入口类型', k: 'map_key2' },
        { n: '快捷入口', k: 'map_key3' },
    ]
}];

export const USER_CONFIG_TYPE = [{
    n: '快捷入口',
    id: 12,
    cpnt: 'entrance',
    t: "",
    column: [
        { n: '配置名称', k: 'config_name' },
        { n: '系统默认入口', k: 'map_key1' },
        { n: '用户自定义入口', k: 'map_key2' },
    ]
}];

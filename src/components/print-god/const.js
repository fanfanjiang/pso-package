export const PAGE = [
    { n: 'A3', v: 'A3', w: 297, h: 420 },
    { n: 'A4', v: 'A4', w: 210, h: 297 },
    { n: 'A5', v: 'A5', w: 148, h: 210 },
    { n: '自定义', v: 'custom', w: 210, h: 297 },
];

export const PAGE_MARGIN = [19.1, 17.8, 19.1, 17.8];

export const PAGE_DIRECT = [
    { n: '纵向', v: 'portrait' },
    { n: '横向', v: 'landscape' },
];

export const FONT_SIZE = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 24, 30, 36, 48, 64, 72, 144];

export const FONT_FAMILY = [
    { n: '宋体', v: 'SimSun' },
    { n: '微软雅黑', v: 'YaHei' },
    { n: '黑体', v: 'SimHei' },
    { n: '楷体', v: 'KaiTi' },
];

export const FONT_ALIGN_H = [
    { n: '水平居中', v: 'center' },
    { n: '左对齐', v: 'left' },
    { n: '右对齐', v: 'right' },
];

export const FONT_ALIGN_V = [
    { n: '垂直居中', v: 'middle' },
    { n: '顶部对齐', v: 'top' },
    { n: '底部对齐', v: 'bottom' },
];

export const BORDER_WIDTH = [1, 2, 3, 4, 5];

export const BORDER_TYPE = ['left', 'top', 'bottom', 'right', 'none', 'outer', 'all'];

export const COLOR = ['000000', 'F5222D', 'FA8C16', '52C41A', '1890FF', '722ED1', '5E6D82'];

export const STYLES = {
    'font-family': { prefix: 'font-family', type: '' },
    'font-size': { prefix: 'font-size', type: 'number' },
    'border-width': { prefix: 'border-width', type: 'number' },
    'color': { prefix: 'color', type: '', apd: '#' },
    'text-align': { prefix: 'text-align', type: '' },
    'vertical-align': { prefix: 'vertical-align', type: '' },
    'font-weight': { prefix: 'font-weight', type: '', },
    'font-style': { prefix: 'font-style', type: '', },
    'text-decoration': { prefix: 'text-decoration', type: 'array', },
};

export const EXTEND = {
    extendable: false,
    showOpts: false,
    optNum: 0
};


export default {
    PAGE, PAGE_MARGIN, PAGE_DIRECT,
    FONT_SIZE, FONT_FAMILY, BORDER_WIDTH, BORDER_TYPE,
    COLOR, FONT_ALIGN_H, FONT_ALIGN_V, STYLES, EXTEND
}

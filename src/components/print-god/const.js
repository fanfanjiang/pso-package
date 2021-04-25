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

export const FONT_SIZE = [6, 8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 64, 72, 144];

export const FONT_FAMILY = [
    { n: '微软雅黑', v: 'YaHei' },
    { n: '宋体', v: 'SimSun' },
    { n: '黑体', v: 'SimHei' },
    { n: '楷体', v: 'KaiTi' },
];

export const BORDER_WIDTH = [1, 2, 3, 4, 5];

export const BORDER_TYPE = ['left', 'top', 'bottom', 'right', 'none', 'outer', 'all'];

export const COLOR = ['000000', 'F5222D', 'FA8C16', '52C41A', '1890FF', '722ED1', '5E6D82'];

export default { PAGE, PAGE_MARGIN, PAGE_DIRECT, FONT_SIZE, FONT_FAMILY, BORDER_WIDTH, BORDER_TYPE, COLOR }

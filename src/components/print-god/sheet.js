
import { matchRegExp } from '../../utils/util';
import shortid from "shortid";
import { STYLES } from "./const";
const DEFAULT_STYLE = 'default';
const STYLEARY = Object.values(STYLES);

export default class Sheet {
    constructor(options) {

        this.dragField = null;
        this.overCell = null;
        this.fMap = {};
        this.selectRange = [];
        this.background = { id: '', show: true, url: '' };
        this.$sheet = null;
        this.name = '';

        for (let op in options) {
            if (options.hasOwnProperty(op) && typeof options[op] !== 'undefined') {
                this[op] = options[op];
            }
        }

        this.initializeHot();
        this.addHotHook();
        this.setSheetData();
    }

    initializeHot() {
        this.hot = new Handsontable(this.$sheet, {
            data: Handsontable.helper.createEmptySpreadsheetData(100, 24),
            minRows: 100,
            minCols: 25,
            colWidths: (col) => this.getColWidth(col),
            rowHeights: (row) => this.getRowHeight(row),
            rowHeaders: true,
            colHeaders: true,
            contextMenu: true,
            mergeCells: true,
            language: "zh-CN",
            customBorders: true,
            manualRowResize: true, //自定义行高
            manualColumnResize: true, //自定义列宽
            undo: false,
            redo: false,
            outsideClickDeselects: false,
            renderAllRows: true,
            height: $('.printgod-designer-sheet-body').height(),
            cells: (row, column, prop) => this.renderCells(row, column, prop),
        });
    }

    addHotHook() {
        this.hot.addHook("afterOnCellMouseOver", (evt, cell, n) => {
            if (this.dragField) {
                this.overCell = cell;
                this.hot.selectCell(cell.row, cell.col);
            } else {
                this.overCell = null;
            }
        })
        this.hot.addHook("afterSelectionEnd", (sRow, sCol, eRow, eCol) => {
            if (sRow < 0 || sCol < 0) return;
            this.selectRange = [sRow, sCol, eRow, eCol];
            const meta = this.hot.getCellMeta(sRow, sCol);
            this.checkMenuStyle(meta.className, this.isCellMerge(sRow, sCol, eRow, eCol))
        })
        this.hot.addHook("beforeChange", (cellsInfo, changeType) => {
            for (let cellInfo of cellsInfo) {
                const [row, col, oldVal, newVal] = cellInfo;
                this.fMap[this.mapKey(row, col)] = newVal ? newVal : void 0;
            }
        })
    }

    getColWidth(col) {
        return this.print.def.colWidth;
    }

    getRowHeight(row) {
        return this.print.def.rowHeight;
    }

    renderCells(row, column, prop) {
        const field = this.mapVal(row, column) || '';
        return {
            editor: typeof field === 'string' ? "text" : false, //返回false则不能编辑
            renderer: (hotInst, td, row, column, prop, cellData, cellProp) => {
                td.className = cellProp.className || "";

                if (!cellData) return td.innerHTML = "";
                td.innerHTML = `<div class="content"><div class="data"><span>${this.getFieldText(cellData)}</span></div></div>`
            },
        };
    }

    getFieldText(data) {
        if (typeof data === 'string') {
            return data;
        } else if (data.text) {
            return `$[${data.text}]`;
        }
    }

    mapKey(row, col) {
        return `${row}:${col}`;
    }

    mapVal(row, col) {
        return this.fMap[this.mapKey(row, col)];
    }

    addHotCellData(row, col, field) {
        this.hot.setDataAtCell(row, col, field);
    }

    checkDragField() {
        if (this.overCell) {
            this.addHotCellData(this.overCell.row, this.overCell.col, this.dragField);
        }
        this.removeDragFeild();
    }

    addDragField(fieldDom) {
        const $field = $(fieldDom);
        const ast = $field.attr('ast');
        const fid = $field.attr('fid');
        const text = $field.attr('text');
        this.dragField = fid ? { ast, fid, text } : text;
    }

    removeDragFeild() {
        this.dragField = null;
    }

    getFormatRange(range) {
        range = range || this.hot.getSelectedRange();
        if (!range) return;
        if (Array.isArray(range)) {
            if (!range.length) return;
            range = range[0]
        }
        if (range.from.row < 0) {
            range.from.row = 0
        }
        if (range.from.col < 0) {
            range.from.col = 0
        }
        return range;
    }

    eachCell(range, callback, onlySurface = true) {
        range = this.getFormatRange(range);
        if (!range) return;
        const { from, to } = range;
        for (let row = from.row; row <= to.row; row++) {
            for (let col = from.col; col <= to.col; col++) {
                if (this.isBehindMerge(row, col) && onlySurface) continue;
                callback(row, col);
            }
        }
    }

    getSurfaceCell(row, col) {
        const mergeInfo = this.getCellMergeInfo(row, col);
        if (mergeInfo) {
            row = mergeInfo.row;
            col = mergeInfo.col;
        }
        return { row, col };
    }

    getSerfaceDetail(row, col) {
        const cell = this.getSurfaceCell(row, col);
        row = cell.row;
        col = cell.col;
        const TD = this.hot.getCell(row, col);
        const meta = this.hot.getCellMeta(row, col);
        return { TD, meta, row, col }
    }

    refreshCellCls(row, col, prefix, value) {
        const { TD, meta } = this.getSerfaceDetail(row, col);
        const newCls = value ? `${prefix}${value}` : "";
        const reg = new RegExp(`${prefix}[a-zA-Z0-9]+`, 'g');
        meta.className = (meta.className ? meta.className.replace(reg, "") : "") + (newCls ? ` ${newCls}` : "");
        TD.className = meta.className;
        return meta.className;
    }

    checkCellCls(row, col, cls, positiveCB, negativeCB) {
        const { TD, meta } = this.getSerfaceDetail(row, col);
        const reg = new RegExp(`${cls}`, 'g');
        meta.className = meta.className || '';
        if (!reg.test(meta.className)) {
            positiveCB && positiveCB(meta, reg);
        } else {
            negativeCB && negativeCB(meta, reg);
        }
        TD.className = meta.className;
    }

    addCellCls(row, col, cls) {
        this.checkCellCls(row, col, cls, (meta) => {
            meta.className += (meta.className ? ' ' : '') + cls;
        });
    }

    addOrRemoveCellCls(row, col, cls) {
        this.checkCellCls(row, col, cls,
            (meta) => {
                meta.className += (meta.className ? ' ' : '') + cls;
            },
            (meta, reg) => {
                meta.className = meta.className.replace(reg, "")
            }
        );
    }

    setFontFamilyCls(value, range) {
        this.print.menu.fontFamily = value;
        this.eachCell(range, (row, col) => {
            this.setCellFontFamilyCls({ value, row, col });
        })
    }

    setFontSizeCls(value, range) {
        this.print.menu.fontSize = value;
        this.eachCell(range, (row, col) => {
            this.setCellFontSizeCls({ value, row, col });
        })
    }

    setCellFontFamilyCls({ row, col, value }) {
        this.refreshCellCls(row, col, 'font-family-', value);
    }

    setCellFontSizeCls({ row, col, value }) {
        this.refreshCellCls(row, col, 'font-size-', value);
    }

    setBorder(value, range) {
        this.print.menu.border = value;
        range = this.getFormatRange(range);
        if (!range) return;
        let { from, to } = range;
        if (this.isCellMerge(range.from, range.to)) {
            to = { ...from };
        }
        switch (value) {
            case 'left':
                for (let row = from.row; row <= to.row; row++) {
                    this.setCellBorderCls({ row, col: from.col, value });
                }
                break;
            case 'top':
                for (let col = from.col; col <= to.col; col++) {
                    this.setCellBorderCls({ row: from.row, col, value });
                }
                break;
            case 'bottom':
                for (let col = from.col; col <= to.col; col++) {
                    this.setCellBorderCls({ row: to.row, col, value });
                }
                break;
            case 'right':
                for (let row = from.row; row <= to.row; row++) {
                    this.setCellBorderCls({ row, col: to.col, value });
                }
                break;
            case 'none':
                this.eachCell({ from, to }, (row, col) => {
                    this.refreshCellCls(row, col, 'border-');
                })
                break;
            case 'outer':
                this.eachCell({ from, to }, (row, col) => {
                    const border = [];
                    if (from.row === row) {
                        border.push('top');
                    }
                    if (from.col === col) {
                        border.push('left');
                    }
                    if (row === to.row) {
                        border.push('bottom');
                    }
                    if (col === to.col) {
                        border.push('right');
                    }
                    border.forEach(d => {
                        this.setCellBorderCls({ row, col, value: d });
                    })
                })
                break;
            case 'all':
                this.eachCell({ from, to }, (row, col) => {
                    ['left', 'top', 'bottom', 'right'].forEach(d => {
                        if (d === 'bottom' && row !== to.row) {
                            return;
                        }
                        if (d === 'right' && col !== to.col) {
                            return;
                        }
                        this.setCellBorderCls({ row, col, value: d });
                    })
                })
                break;
        }
    }

    setCellBorderCls({ row, col, value }) {
        this.addCellCls(row, col, `border-${value}`)
    }

    getMergedCells() {
        return this.hot.getPlugin("MergeCells").mergedCellsCollection
    }

    getCellMergeInfo(row, col) {
        return this.getMergedCells().get(row, col);
    }

    isCellMerge() {
        let from = arguments[0];
        let to = arguments[1];
        if (arguments.length === 4) {
            from = { row: arguments[0], col: arguments[1] }
            to = { row: arguments[2], col: arguments[3] }
        }
        const info = this.getCellMergeInfo(from.row, from.col);
        return info && from.row + info.rowspan - 1 === to.row && from.col + info.colspan - 1 === to.col
    }

    isBehindMerge(row, col) {
        const info = this.getCellMergeInfo(row, col);
        return info && (info.row !== row || info.col !== col);
    }

    mergeOrUnmerge(range) {
        range = this.getFormatRange(range);
        if (!range) return;
        if (this.isCellMerge(range.from, range.to)) {
            this.hot.getPlugin("MergeCells").unmergeSelection(range);
        } else {
            this.hot.getPlugin("MergeCells").mergeSelection(range);
        }
    }

    hasStyle(row, col, prefix) {
        const cell = this.getSurfaceCell(row, col);
        const meta = this.hot.getCellMeta(cell.row, cell.col);
        const reg = new RegExp(`${prefix}[a-zA-Z0-9]+`, 'g');
        return reg.test(meta.className ? meta.className : '')
    }

    setBorderWidthCls(value, range) {
        this.print.menu.borderWidth = value;
        this.eachCell(range, (row, col) => {
            if (this.hasStyle(row, col, 'border-')) {
                this.setCellBorderWidthCls({ value, row, col });
            }
        })
    }

    setCellBorderWidthCls({ row, col, value }) {
        this.refreshCellCls(row, col, 'border-width-', value);
    }

    setFontColorCls(value, range) {
        this.print.menu.color = value;
        this.eachCell(range, (row, col) => {
            this.setCellFontColorCls({ value, row, col });
        })
    }

    setCellFontColorCls({ row, col, value }) {
        this.refreshCellCls(row, col, 'color-', value);
    }

    setCommonCls(value, prefix, range) {
        this.print.menu[prefix] = value;
        this.eachCell(range, (row, col) => {
            this.setCellCommonCls({ value, row, col, prefix });
        })
    }

    setCellCommonCls({ row, col, value, prefix }) {
        this.refreshCellCls(row, col, prefix + '-', value);
    }

    setOrRemoveCommonCls(value, prefix = 'style', range) {
        this.eachCell(range, (row, col) => {
            this.addOrRemoveCellCls(row, col, `${prefix}-${value}`);
        })
    }

    checkMenuStyle(className, merged) {
        this.print.menu.merge = !merged;
    }

    cellHasBorder(cls) {
        return cls && /border-[a-zA-Z0-9]+/g.test(cls);
    }

    cellClsToStyle(cls) {
        if (!cls) return {};
        const matches = matchRegExp(cls, "(?<=\s*)[0-9a-zA-Z-_]+(?=\s*)");
        const style = { border: [false, false, false, false] };
        for (let mat of matches) {
            for (let { prefix, type, apd = '' } of STYLEARY) {
                const reg = new RegExp(`${prefix}-[a-zA-Z0-9]+`, 'g');
                if (reg.test(mat)) {
                    let value = mat.replace(`${prefix}-`, "");
                    if (type === 'number') {
                        value = parseInt(value);
                    }
                    if (apd) {
                        value = `${apd}${value}`;
                    }
                    if (type === 'array') {
                        if (!style[prefix]) {
                            style[prefix]
                        }
                        style[prefix].push(value)
                    } else {
                        style[prefix] = value;
                    }
                }
            }
            ['left', 'top', 'right', 'bottom'].forEach((d, i) => {
                if (mat === `border-${d}`) {
                    style.border[i] = true;
                }
            })
        }
        return style;
    }

    getCellStyleName(meta) {
        const style = this.cellClsToStyle(meta.className);
        if (_.isEmpty(style)) {
            return DEFAULT_STYLE;
        }
        const name = JSON.stringify(style);
        if (!this.print.styleNameMap[name]) {
            const id = shortid.generate();
            this.print.styleNameMap[name] = id;
            this.print.styleMap[id] = style;
        }
        return this.print.styleNameMap[name];
    }

    async destroy() {
        const data = await this.export();
        this.hot.destroy();
        return data;
    }

    splitCellTag(tag) {
        const data = tag.split(':');
        return [parseInt(data[0]), parseInt(data[1])];
    }

    cellStyleToCls(style) {
        if (!style) return '';
        const clsAry = [];
        for (let skey in style) {
            if (STYLES[skey]) {
                if (Array.isArray(style[skey])) {
                    style[skey].forEach(d => {
                        clsAry.push(STYLES[skey].prefix + '-' + d)
                    })
                } else {
                    clsAry.push(STYLES[skey].prefix + '-' + style[skey])
                }
            }
            if (skey === 'border') {
                ['left', 'top', 'right', 'bottom'].forEach((d, i) => {
                    if (style[skey][i]) {
                        clsAry.push(`border-${d}`)
                    }
                })
            }
        }
        return clsAry.length ? clsAry.join(' ') : "";
    }

    analyzeSheetData(row, col, content, data, endCell) {
        if (_.isEmpty(data)) {
            for (let i = 0; i <= endCell[0]; i++) {
                data[i] = [];
                data[i].length = endCell[1];
            }
        }
        if (col > endCell[1]) return;
        data[row][col] = content;
    }

    setSheetData(data) {
        data = data || this.template;
        if (!data || _.isEmpty(data)) return;
        const props = [];
        const sheetData = [];
        const endCell = this.splitCellTag(data.range.e);
        for (let tag in data.cells) {
            const [row, col] = this.splitCellTag(tag);
            const cell = data.cells[tag];
            const className = this.cellStyleToCls(data.styles[cell.style]);
            if (className) {
                props.push({ row, col, prop: { className } })
            }
            this.analyzeSheetData(row, col, cell.content, sheetData, endCell);
        }

        if (!_.isEmpty(sheetData)) {
            this.hot.updateSettings({ data: sheetData });
        }

        const merged = this.getMergedCells();
        data.merge.forEach(m => {
            merged.add(m)
        })
        props.forEach(({ row, col, prop }) => {
            this.hot.setCellMetaObject(row, col, prop)
        });

        this.hot.render();
    }

    async export() {
        const rows = this.hot.countRows();
        const cols = this.hot.countCols();
        let endCell = [0, 0];

        const data = {
            cols: [],
            rows: [],
            cells: {},
            merge: this.getMergedCells().mergedCells,
            range: {
                s: "0:0",
            },
            styles: {},
            background: this.background
        }

        for (let row = 0; row < rows; row++) {
            //行高
            data.rows.push(this.hot.getRowHeight(row) || this.def.rowHeight);

            for (let col = 0; col < cols; col++) {
                //列宽
                if (!row) {
                    data.cols.push(this.hot.getColWidth(col) || this.def.colWidth);
                }

                const meta = this.hot.getCellMeta(row, col);
                if (!meta) continue;

                const key = this.mapKey(meta.row, meta.col);
                const content = this.mapVal(meta.row, meta.col) || '';

                if (!content && !this.cellHasBorder(meta.className)) continue;
                const style = this.getCellStyleName(meta);

                if (endCell[0] < meta.row) {
                    endCell[0] = meta.row;
                }
                if (endCell[1] < meta.col) {
                    endCell[1] = meta.col;
                }
                data.cells[key] = { content, style }
            }
        }

        if (Array.isArray(data.merge) && 0 < data.merge.length) {
            const last = data.merge[data.merge.length - 1];
            endCell[0] = Math.max(endCell[0], last.row + last.rowspan - 1);
            // endCell[1] = Math.max(endCell[1], last.col + last.colspan - 1);
        }

        data.range.e = this.mapKey(endCell[0], endCell[1]);
        data.styles = this.print.styleMap;

        console.log(data);
        return data;
    }
}
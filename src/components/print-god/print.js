import { PAGE, PAGE_MARGIN, PAGE_DIRECT } from './const';

export default class Print {
    constructor(options) {

        this.dragField = null;
        this.overCell = null;
        this.store = null;
        this.assStores = [];
        this.fMap = {};
        this.def = {
            colWidth: 100,
            rowHeight: 24,
        }

        this.page = {
            type: PAGE[1].v,
            direction: PAGE_DIRECT[0].v,
            width: PAGE[1].w,
            height: PAGE[1].h,
            margin: _.cloneDeep(PAGE_MARGIN)
        }

        this.menu = {
            fontSize: 9,
            fontFamily: 'YaHei',
            textAlign: 'left',
            verticalAlign: 'middle',
            borderWidth: 1,
            border: 'none',
            bold: false,
            italic: false,
            underline: false,
            color: '#000000'
        }

        for (let op in options) {
            if (options.hasOwnProperty(op) && typeof options[op] !== 'undefined') {
                this[op] = options[op];
            }
        }

        this.initializeHot();
        this.addHotHook();
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
            cells: (row, column, prop) => this.renderCells(row, column, prop),
        });
    }

    getColWidth(col) {
        return this.def.colWidth
    }

    getRowHeight(row) {
        return this.def.rowHeight
    }

    renderCells(row, column, prop) {
        const field = this.mapVal(row, column) || '';
        return {
            editor: typeof field === 'string' ? "text" : false, //返回false则不能编辑
            renderer: (hotInst, td, row, column, prop, cellData, cellProp) => {
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

    addHotHook() {
        this.hot.addHook("afterOnCellMouseOver", (evt, cell, n) => {
            if (this.dragField) {
                this.overCell = cell;
                this.hot.selectCell(cell.row, cell.col);
            } else {
                this.overCell = null;
            }
        })
    }

    mapKey(row, col) {
        return `${row}:${col}`;
    }

    mapVal(row, col) {
        return this.fMap[this.mapKey(row, col)];
    }

    addHotCellData(row, col, field) {
        this.fMap[this.mapKey(row, col)] = field;
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

    setFontFamilyCls(value, range) {
        range = range || this.hot.getSelectedRange();
        console.log(range);
    }

    setCellFontFamilyCls({ row, col, value }) {
        const meta = this.hot.getCellMeta(row, col);
        console.log(meta);

    }
}
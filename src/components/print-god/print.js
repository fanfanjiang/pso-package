import { PAGE, PAGE_MARGIN, PAGE_DIRECT } from './const';
import DomUnit from '../../utils/dom/unit';
import Sheet from './sheet';
import shortid from "shortid";

export default class Print {
    constructor(options) {

        this.store = null;
        this.assStores = [];
        this.$vue = null;


        this.def = {
            colWidth: 100,
            rowHeight: 24,
        }

        this.page = {
            type: PAGE[1].v,
            layout: PAGE_DIRECT[0].v,
            width: PAGE[1].w,
            height: PAGE[1].h,
            margin: _.cloneDeep(PAGE_MARGIN),
            radio: 1
        }

        this.menu = {
            fontSize: 9,
            fontFamily: 'YaHei',
            alignh: 'left',
            alignv: 'middle',
            borderWidth: 1,
            border: 'none',
            bold: false,
            italic: false,
            underline: false,
            color: '000000',
            merge: true
        }

        this.styleMap = {};
        this.styleNameMap = {};

        this.$sheet = null;

        this.sheets = {};
        this.sheet = null;
        this.sheetId;

        for (let op in options) {
            if (options.hasOwnProperty(op) && typeof options[op] !== 'undefined') {
                this[op] = options[op];
            }
        }

        this.domUnit = new DomUnit();

        if (_.isEmpty(this.sheets)) {
            this.addSheet();
        }
        this.setSheet();
    }

    get pageWidth() {
        return this.domUnit.mmToPx(this.page.width);
    }

    get pageHeight() {
        return this.domUnit.mmToPx(this.page.height);
    }

    get pageMargin() {
        return this.page.margin.map(d => this.domUnit.mmToPx(d || 0))
    }

    get lineHeight() {
        return (this.page.layout === "portrait" ? this.pageHeight : this.pageWidth) + 26 - this.pageMargin[1] - this.pageMargin[3];
    }

    get lineWidth() {
        return (this.page.layout === "portrait" ? this.pageWidth : this.pageHeight) + 50 - this.pageMargin[0] - this.pageMargin[2];
    }

    addSheet(id) {
        id = id || shortid.generate();
        this.$vue.$set(this.sheets, id, { name: '分页', template: {} })
        return id;
    }

    removeSheet(id, force = true) {
        if (!force && Object.keys(this.sheets).length === 1) return;
        const sheet = _.cloneDeep(this.sheets[id]);
        this.$vue.$delete(this.sheets, id);
        delete this.sheets[id];
        return sheet;
    }

    removeAndSetSheet(id) {
        const removed = this.removeSheet(id, false);
        removed && this.setSheet();
    }

    getSheet(id) {
        id = id || Object.keys(this.sheets)[0];
        return this.sheets[id];
    }

    addAndSetSheet() {
        this.setSheet(this.addSheet())
    }

    async setSheet(id) {
        id = id || Object.keys(this.sheets)[0];
        if (this.sheetId && id === this.sheetId) return;

        if (this.sheet) {
            const template = await this.sheet.destroy();
            if (this.sheets[this.sheetId]) {
                this.sheets[this.sheetId].template = template;
            }
        }

        this.sheetId = id;
        this.sheet = null;

        const { template } = this.getSheet(id);
        setTimeout(() => {
            this.sheet = new Sheet({ $sheet: this.$sheet, print: this, template, $vue: this.$vue });
        })
    }

    async save() {
        this.page.radio = this.domUnit.radio;
        this.sheets[this.sheetId].template = await this.sheet.export();
        return { page: this.page, sheets: this.sheets }
    }
}
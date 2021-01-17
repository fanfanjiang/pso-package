<template>
  <div></div>
</template>
<script>
import { filterByDecimal, getDisplayOfCpnt } from "../../tool/form.js";

const DEFSTYLE = { margin: [5, 5, 5, 5], fontSize: 10, alignment: "left", color: "#000" };
export default {
  props: {
    config: Object,
  },
  data() {
    this.header = [];
    this.content = [];
    this.fields = [];
    this.store = null;
    this.widths = [];
    return {};
  },
  created() {},
  methods: {
    traverseFields(callback) {
      for (let field of this.fields) {
        const { using, printable, show } = field;
        if (using === "1" && show === "1") {
          callback && callback(field);
        }
      }
    },
    getUnitByColumnField(field_name) {
      const cpnt = this.store.searchByField(field_name, true);
      if (cpnt && cpnt._unit) {
        return cpnt._unit;
      }
      return "";
    },
    analyzeTBody(data) {
      const content = [];
      const { count } = this.config;
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        const col = [];
        const pageBreak = count && i !== 0 && i % parseInt(count) === 0;
        this.traverseFields(({ field_name }) => {
          const td = { style: "body" };
          pageBreak && (td.pageBreak = "before");
          td.text = `${d[field_name]}${this.getUnitByColumnField(field_name)}`;
          col.push(td);
        });
        content.push(col);
      }
      this.content = content;
    },
    analyzeTHeader(fields) {
      const header = [];
      const widths = [];
      this.traverseFields(({ display: text, docWidth, width, widthAuto, fillRemain }) => {
        header.push({ style: "header", text });
        widths.push(fillRemain ? "*" : widthAuto ? "auto" : docWidth || width || "auto");
      });
      this.header = [header];
      this.widths = widths;
    },
    analyze({ cpnt, value, proxy, fields, store, printFields } = params) {
      const { source } = this.config;
      if (cpnt.data._fieldValue === source && cpnt.componentid === "asstable" && proxy && fields) {
        this.fields = printFields || fields;
        this.store = store;
        this.analyzeTHeader();
        this.analyzeTBody(proxy.valList);
      } else {
        if (["user", "department", "tag", "select", "checkbox"].includes(cpnt.componentid)) {
          value = getDisplayOfCpnt(cpnt);
        }
        const _unit = cpnt.data._unit || "";
        value = cpnt.data.__showVal__ || filterByDecimal(cpnt.data, value);
        value = !_.isNaN(value) && !_.isNull(value) ? `${value} ${_unit}` : "";
        this.replaceField(this.config.title, cpnt.data._fieldValue, value);
        this.replaceField(this.config.header, cpnt.data._fieldValue, value);
        this.replaceField(this.config.footer, cpnt.data._fieldValue, value);
      }
    },
    replaceField(table, field, value) {
      for (let row of table) {
        for (let cell of row) {
          if (cell.text) {
            const reg = new RegExp(`@${field}@`, "g");
            cell.text = cell.text.replace(reg, value);
          }
        }
      }
    },
    getStyle(id) {
      return _.find(this.config.styles, { id });
    },
    makeWidths(row) {
      const widths = [];
      for (let cell of row) {
        const { widthType, width } = cell;
        widths.push(widthType === "custom" ? width : widthType);
      }
      return widths;
    },
    analyzeTable(data) {
      if (data && data.length && data[0].length) {
        return [{ table: { widths: this.makeWidths(data[0]), body: data } }];
      }
      return [];
    },
    async print() {
      const { orientation, size, margins, dheaderStyle, dbodyStyle } = this.config;
      const settings = {
        pageSize: size,
        pageMargins: Object.values(margins),
        pageOrientation: orientation,
        content: [{ table: { headerRows: 1, widths: this.widths, body: this.header.concat(this.content) } }],
        header: [this.analyzeTable(this.config.title), this.analyzeTable(this.config.header)],
        footer: this.analyzeTable(this.config.footer),
        styles: {
          header: this.getStyle(dheaderStyle) || DEFSTYLE,
          body: this.getStyle(dbodyStyle) || DEFSTYLE,
        },
      };

      this.config.styles.forEach((s) => {
        settings.styles[s.id] = s;
      });

      const ret = await this.API.makeTempPdf({ settings });
      if (ret.success) {
        window.open(`/pdf?url=/static/temp/${ret.data.name}.pdf`);
      }
    },
  },
};
</script>
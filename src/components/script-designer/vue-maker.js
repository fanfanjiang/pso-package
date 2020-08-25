import shortid from "shortid";
// import { html, js, css } from "js-beautify";  

function genId() {
    return `<${shortid.generate()}>`;
}
class VueMaker {
    constructor({ data = {} }) {
        this._data = data;
    }

    getHtml() {
        const rootDiv = (new Div(this._data)).toHtml();
        const parentSolt = rootDiv.subSolt;
        let parent = rootDiv.template;
        (function toHtml(children, solt) {
            for (let item of children) {
                let { subSolt, template } = (new VueMaker.resolver[item.componentid](item)).toHtml();
                parent = parent.replace(new RegExp(solt), template)
                if (item.children) toHtml(item.children, subSolt);
            }
        })(this._data.children, parentSolt);
        // return html(parent, { indent_size: 2, space_in_empty_paren: true });
        return parent;
    }

    getJs() {
        const jsCode = `var app={
            data() {
              return {};
            },
            computed: {},
            created() {},
            mounted() {},
            methods: {}
          };`
        // return js(jsCode, { indent_size: 2, space_in_empty_paren: true });
        return jsCode;
    }

    getCss() {
        const cssCode = ``;
        // return css(cssCode, { indent_size: 2, space_in_empty_paren: true });
        return cssCode
    }

    static register(cls) {
        let id = cls.name || cls.toString().match(/^class\s+(.+?)\s+\{/)[1];
        this.resolver[cls._componentid || id.replace(/^./, id[0].toLowerCase())] = cls;
    }
}
VueMaker.resolver = {};

class Row {
    constructor(data) {
        this._data = data;
    }
    toHtml() {
        let subSolt = genId();
        let length = this._data.children ? this._data.children.length : 0;
        let template = `<el-row>${new Array(length).fill(`<el-col>${subSolt}</el-col>`).join('')}</el-row>`;
        return { subSolt, template };
    }
}
VueMaker.register(Row);

class Div {
    constructor(data) {
        this._data = data;
    }
    toHtml() {
        let subSolt = genId();
        let length = this._data.children ? this._data.children.length : 0;
        let template = `<div>${new Array(length).fill(subSolt).join('')}</div>`;
        return { subSolt, template };
    }
}
VueMaker.register(Div);

class Carousel {
    constructor(data) {
        this._data = data;
    }
    toHtml() {
        let template = `<pso-carousel></pso-carousel>`;
        return { template };
    }
}
VueMaker.register(Carousel);


class Chart {
    constructor(data) {
        this._data = data;
    }
    toHtml() {
        let template = `<pso-chart-viewer chartId="${this._data._defaultValue}"></pso-chart-viewer>`;
        return { template };
    }
}
VueMaker.register(Chart);

class Graphiccard {
    constructor(data) {
        this._data = data;
    }
    toHtml() {
        let template = `<pso-card-graphic title="${this._data._fieldName}"
      form-id="${this._data._selectedTable}" title-field="${this._data._titleField}"
      img-field="${this._data._imgField}" info-field="${this._data._infoField}"></pso-card-graphic>`;
        return { template };
    }
}
VueMaker.register(Graphiccard);

export default VueMaker;

import PsoFormAttach from "../components/form-interpreter/components/attachment";
import { genComponentData } from "../components/form-designer/helper";
import { filterByDecimal, getDisplayOfCpnt } from "../tool/form.js";

export const Attach = {
    components: { PsoFormAttach },
    data() {
        return {
            attach: { data: {} },
        };
    },
    methods: {
        createCpnt(ids = "", name = "") {
            this.attach.data = genComponentData({ componentid: "attachment", _fieldName: "", _val: ids });
            this.attach.data._fieldName = name;
        }
    }
};

export const QuickInput = {
    data() {
        return {};
    },
    methods: {
        initKeyevent(store) {
            this.quickStore = store;
            $(window).keydown(this.checkKeyevent);
            this.$store.commit('APP_PUSHSTORE', { store });
        },
        clearKeyevent() {
            this.$store.commit('APP_POPSTORE');
            $(window).unbind('keydown', this.checkKeyevent);
        },
        checkKeyevent(e) {
            if (e.ctrlKey && e.which == 13) {
                if (this.$store.state.base.curStore === this.quickStore) {
                    console.log(e);
                }
            }
        }
    }
};

export const Printer = {
    data() {
        return {
            printRef: ''
        };
    },
    methods: {
        prepareSysFields(data) {
            for (let key in data) {
                if (typeof data[key] === "string") {
                    this.setPrinterValue({ cpnt: { data: { _fieldValue: `${key}` } }, value: data[key] });
                }
            }
        },
        setPrinterValue({ cpnt, value, proxy, fields, store, printFields }) {
            const { data } = cpnt;
            if (!data._fieldValue) return;
            const $el = $(this.printRef).find(`[field=${data._fieldValue}]`);
            if (!$el.get(0)) return;

            //人员和部门
            if (["user", "department", "tag", "select", "checkbox"].includes(cpnt.componentid)) {
                value = getDisplayOfCpnt(cpnt);
            }

            value = data.__showVal__ || filterByDecimal(cpnt.data, value);
            if (this.__xssFilter__) {
                value = this.PSODOMPurify.sanitize(value);
            }
            const _unit = data._unit || '';
            $el.html((!_.isNaN(value) && !_.isNull(value)) ? `${value} ${_unit}` : '');

            if (cpnt.componentid === "qrcode") {
                $el.empty();
                $el.append(`<img src="${value}" alt="二维码" />`);
            }

            //关联表
            if (cpnt.componentid === "asstable" && proxy && fields) {
                const display = $el.attr('display');
                $el.empty();
                if (display === 'script') {
                    const format = $el.attr('format');
                    if (format) {
                        const fieldObj = {};
                        const $wrapper = $('<div class="pso-script"></div>');
                        try {
                            proxy.valList.forEach(d => {
                                let datasource = format;
                                for (let k in d) {
                                    if (!fieldObj[k]) {
                                        const f = _.find(fields, { field_name: k });
                                        if (f) fieldObj[k] = f.fid;
                                    }
                                    datasource = datasource.replace(new RegExp(`@${fieldObj[k]}@`, "g"), d[k]);
                                }
                                $wrapper.append(`<div>${datasource}</div>`)
                            })
                            $el.append($wrapper)
                        } catch (error) {
                            console.log('解析主体关联表错误', error)
                        }
                    }
                } else {
                    const sequence = $el.attr('sequence');
                    if (cpnt.data._type == 1 && display !== 'table') {
                        if (proxy.valList.length) {
                            $el.html(proxy.valList[0][cpnt.data._radioField || 'leaf_id']);
                        }
                    } else {
                        if (proxy.valList.length) {
                            $el.css({ display: 'block', overflow: 'auto' });
                            $el.append(this.makeStaticTable(printFields || fields, proxy.valList, sequence === '1', store, cpnt.data._printCount));
                            const parentTd = $('.pso-static-table').parentsUntil('td');
                            if (parentTd.get(0)) {
                                $('.pso-static-table').addClass('outer-border-none');
                                parentTd.parent().css('padding', 0);
                            }
                        }
                    }
                }
            }
        },
        makeStaticTable(allFields, data, showIndex = false, store, count) {
            const fields = allFields.filter((f) => f.using === "1" && f.show === "1");
            const $wrapper = $(`<table class="pso-static-table"><colgroup></colgroup><thead><tr></tr></thead><tbody></tbody></table>`);
            const $colgroup = $wrapper.find('colgroup');
            const $ftr = $wrapper.find('thead>tr');
            const $tbody = $wrapper.find('tbody');
            if (showIndex) {
                $colgroup.append(`<col width="40">`);
                $ftr.append(`<th>项次</th>`);
            }
            for (let f of fields) {
                $colgroup.append(`<col width="${f.docWidth || f.width || 120}">`);
                $ftr.append(`<th>${f.display}</th>`);
            }
            for (let i = 0; i < data.length; i++) {
                if (typeof count !== 'undefined' && (count <= i)) {
                    break;
                }
                const $tr = $('<tr></tr>');
                if (showIndex) {
                    $tr.append(`<td>${i + 1}</td>`)
                }
                for (let f of fields) {
                    let unit = '';
                    if (store) {
                        const cpnt = store.searchByField(f.field_name, true);
                        if (cpnt && cpnt._unit) {
                            unit = cpnt._unit;
                        }
                    }
                    $tr.append(`<td>${data[i][f.field_name]}${unit}</td>`)
                }
                $tbody.append($tr);
            }
            return $wrapper;
        }
    }
};

export default {
    Attach
}
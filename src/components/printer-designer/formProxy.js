import FormStore from '../form-designer/model/store';
import API from '../../service/api'
import { makeFormByPluginModule } from "../../tool/form";
import { genComponentData } from '../form-designer/helper'
import { SYS_FIELDS } from "../../const/form";

export default class FormProxy {
    constructor(options) {
        this.$vue = {};
        this.code = '';
        this.source = '1';

        this.store = null;
        this.assStores = [];

        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option];
            }
        }
    }

    async analyze({ asstable = false } = {}) {
        let ret;
        if (this.source === '1') {
            ret = await API.formsCfg({ data: { id: this.code }, method: "get" });
        } else {
            ret = await makeFormByPluginModule({ code: this.code });
        }
        const store = new FormStore({ ...ret.data, designMode: false });
        this.store = await this.appendSysFields(store);
        if (asstable) {
            await this.analyzeAsstable(store);
        }
    }

    async analyzeAsstable(store) {
        const assStores = await store.getAsstable();
        for (let ast of assStores) {
            this.assStores.push(await this.appendSysFields(ast));
        }
    }

    async appendSysFields(store) {
        const ret = await API.getFormDict({ data_code: store.data_code });
        const extendFields = [genComponentData({ componentid: 'text', fid: 'INDEX', _fieldValue: 'INDEX', _fieldName: '数据序号', _val: "", __sys__: '1', is_sys: '1' })];
        for (let item of ret.data) {
            let field = store.searchByField(item.field_name, true);
            if (!field) {
                const _name = item.field_name.replace(/_s$/, '').replace(/_x$/, '');
                field = store.searchByField(_name, true);
                if (!field) {
                    field = _.find(SYS_FIELDS, { _fieldValue: _name })
                }
                const fixed = _name === item.field_name ? '' : '_X';
                const { field_name } = item;
                const _fieldName = field ? `${field._fieldName}${fixed}` : "未知";
                extendFields.push(genComponentData({ componentid: 'text', fid: field_name, _fieldValue: field_name, _fieldName, _val: "", __sys__: '1', is_sys: '1' }))
            }
        }
        return new FormStore({ data_config: store.data_config.concat(extendFields), data_code: store.data_code, data_name: store.data_name, designMode: false })
    }

    getCpntMap() {
        const map = {};
        if (this.store) {
            map[this.store.data_code] = this.store.getCpntDataMapWithFV();
        }

        for (let ast of this.assStores) {
            map[ast.data_code] = ast.getCpntDataMapWithFV();
        }
        return map;
    }

    async fetch({ ids, mode = '1' }) {
        let mainList = ids;
        if (typeof mainList === 'string') {
            mainList = await this.fetchData(this.store.data_code, mainList);
        }

        if (mode === '2') {
            return [{ __chd__: { 'main': mainList } }]
        } else {
            return await this.fetchAsstables(mainList);
        }
    }

    async fetchAsstables(mainList) {
        const asstables = this.store.search({ options: { componentid: 'asstable' }, onlyData: true });

        for (let ast of asstables) {
            if (ast._option) {
                for (let item of mainList) {
                    if (typeof item['__chd__'] === 'undefined') item['__chd__'] = {};

                    if (!item['__chd__'][ast._option]) {
                        item['__chd__'][ast._option] = [];
                        if (item[ast._fieldValue]) {
                            item['__chd__'][ast._option] = await this.fetchData(ast._option, item[ast._fieldValue]);
                        }
                    }
                }
            }
        }
        return mainList;
    }

    async fetchData(form_code, value) {
        const ret = await API.searchForm({ form_code, leaf_auth: 4, keys: { leaf_id: { type: 4, value } } });
        return ret.success ? ret.data : []
    }
}
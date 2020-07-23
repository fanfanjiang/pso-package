import MUT_TYPES from '../mutation-types';
import API from "../../service/api.js";
import { FIGER_DEFALUT_OP, SORT } from "../../const/chart";
import FormStore from "../../components/form-designer/model/store.js";

import Vue from 'vue';

const STATE = {
    initializing: false,
    formId: '',
    cfg: {},
    chartName: '',
    chartRemark: '',
    source: [],
    dimension: [],
    figure: [],
    filter: [],
    conditionOptions: [],
    dataLimit: {
        checked: false,
        direction: '前',
        count: 10,
        unit: '条'
    }
};

export default {
    state: _.cloneDeep(STATE),
    mutations: {
        [MUT_TYPES.CD_INIT](state, data) {
            if (data) {
                for (let key in data) {
                    if (state.hasOwnProperty(key)) state[key] = data[key] || state[key];
                }
            } else {
                Object.assign(state, _.cloneDeep(STATE));
            }
        },
        [MUT_TYPES.CD_SOURCE_SET](state, data) {
            state.source = data;
        },
        [MUT_TYPES.CD_DIMENSION_SET](state, data) {
            const list = [];

            data.forEach(tempItem => {
                let item = tempItem;
                if (!tempItem._familyId) {
                    item = _.cloneDeep(tempItem);
                    item._familyId = "dimen";
                }

                //设置别名
                Vue.set(item, 'alias', item.alias || item._fieldName);

                //设置操作类型
                Vue.set(item, 'op', item.op || '');

                //设置去重
                Vue.set(item, 'uniq', typeof item.uniq === 'undefined' ? false : item.uniq);

                //设置排序
                Vue.set(item, 'chartSort', item.chartSort || SORT.DEFAULT);

                list.push(item);
            });

            state.dimension = list;
        },
        [MUT_TYPES.CD_FIGURE_SET](state, data) {
            const list = [];
            data.forEach(tempItem => {
                let item = tempItem;
                if (!tempItem._familyId) {
                    item = _.cloneDeep(tempItem);
                    item._familyId = "figure";
                }

                //设置别名
                Vue.set(item, 'alias', item.alias || item._fieldName);

                //设置指标操作类型
                Vue.set(item, 'op', item.op || FIGER_DEFALUT_OP[item._fieldRealType]);

                //设置去重
                Vue.set(item, 'uniq', typeof item.uniq === 'undefined' ? false : item.uniq);

                //设置单位
                Vue.set(item, 'unit', item.unit || '');

                //设置排序
                Vue.set(item, 'chartSort', item.chartSort || SORT.DEFAULT);

                list.push(item);
            });
            state.figure = list;
        }
    },
    actions: {
        async  [MUT_TYPES.CD_SOURCE_GET]({ state, getters, commit, dispatch }, reset = false) {
            console.log(state.filter);
            state.initializing = true;

            if (reset) {
                commit(MUT_TYPES.CD_INIT, { ..._.cloneDeep(STATE), formId: state.formId });
            }

            let ret = await API.formsCfg({ data: { id: state.formId }, method: "get" });
            if (!ret.success) return;
            state.cfg = ret.data;
            const store = new FormStore(ret.data);
            const fields = store.search({
                options: { db: true },
                onlyData: true,
                beforePush: item => !item.parent.CPNT.host_db
            }); 
            commit(MUT_TYPES.CD_SOURCE_SET, fields);
            state.conditionOptions = fields;
            state.initializing = false;
        },
    }
}

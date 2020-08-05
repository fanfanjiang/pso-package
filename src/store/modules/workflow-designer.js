import MUT_TYPES from '../mutation-types';
import shortid from 'shortid';
import nodeField from "../../components/workflow-designer/node-field";
import API from "../../service/api.js";
import { transCMapToCondition } from "../../tool/form";
import FormStore from "../../components/form-designer/model/store.js";
import { WF_AUTH_TYPE } from "../../const/workflow";

export function genNode(tid) {
    let newNode = Object.assign({ tid, nid: shortid.generate(), children: [] }, _.cloneDeep(nodeField.default));
    if (nodeField[tid]) Object.assign(newNode, _.cloneDeep(nodeField[tid]));
    return newNode;
}

const STATE = {
    pid: '',
    node_id: '',
    templateId: '',   //模板node_id
    wfName: '工作流名称',
    wfCode: '',
    wfFiletype: [], //发文编号
    wfAuthType: WF_AUTH_TYPE[0].v,
    formId: '',
    formName: '',
    tableContent: '',
    selectedNode: null,
    nodePanelVisible: false,
    stageScale: 1,
    node: [],
    fields: [],
    formsList: [],
    permissionEntries: [],
    fileTypes: [], //发文编号缓存
    loading: false,
    initializing: true,
    formStore: {},
    displaySmall: false,
    fieldsOptions: []
}

export default {
    state: _.cloneDeep(STATE),
    mutations: {
        [MUT_TYPES.WF_RESET](state) {
            Object.assign(state, _.cloneDeep(STATE))
        },
        [MUT_TYPES.WF_NODE_INIT](state, { pid = '', node_id = "", node, templateId = '' }) {
            state.pid = pid;

            //如果有模板id，则不能更新node_id;
            if (templateId) {
                state.templateId = templateId;
            } else {
                state.node_id = node_id;
            }

            if (!node) {
                let newNode = genNode('start');
                newNode.atype = 'form';
                newNode.opList = [1, 2];

                state.node = [newNode];
                this.commit(MUT_TYPES.WF_SET_SELECTED, newNode)
            } else {
                state.node = node;
                this.commit(MUT_TYPES.WF_SET_SELECTED, state.node[0])
            }
        },
        [MUT_TYPES.WF_NODE_ADD](state, { target, node, pnode }) {
            let newNode = genNode(target.tid);
            if (target.tid === 'branch') {
                newNode.children.push(genNode('branchitem'), genNode('branchitem'))
            }
            if (!pnode) {
                state.node[0].children.unshift(newNode);
            } else if (node.tid === "branchitem") {
                node.children.unshift(newNode);
            } else {
                pnode.children.splice(_.findIndex(pnode.children, { nid: node.nid }) + 1, 0, newNode);
            }
            this.commit(MUT_TYPES.WF_SET_SELECTED, newNode.children.length ? newNode.children[0] : newNode)
        },
        [MUT_TYPES.WF_BRANCH_ADD](state, pnode) {
            let newNode = genNode('branchitem');
            pnode.children.push(newNode);
            this.commit(MUT_TYPES.WF_SET_SELECTED, newNode);
        },
        [MUT_TYPES.WF_SET_SELECTED](state, node) {
            state.selectedNode = node;
            this.commit(MUT_TYPES.WF_NODE_PANEL_SET, state.selectedNode ? true : false);
        },
        [MUT_TYPES.WF_NODE_PANEL_SET](state, visible = false) {
            if (state.nodePanelVisible === visible) return;
            state.nodePanelVisible = visible;
            if (visible === false) {
                setTimeout(() => {
                    this.commit(MUT_TYPES.WF_SET_SELECTED, null);
                }, 200)
            }
        },
        [MUT_TYPES.WF_NODE_DEL](state, { node, pnode }) {
            if (node.tid === 'branchitem' && pnode.children.length === 2) {
                let { parent, index } = this.getters[MUT_TYPES.WF_FIND_NODE]({ options: { nid: pnode.nid } });
                if (state.selectedNode && _.find(pnode.children, { nid: state.selectedNode.nid })) {
                    this.commit(MUT_TYPES.WF_SET_SELECTED, null);
                }
                return parent.children.splice(index, 1);
            }
            if (state.selectedNode && state.selectedNode.nid === node.nid) {
                this.commit(MUT_TYPES.WF_SET_SELECTED, null);
            }
            pnode.children.splice(_.findIndex(pnode.children, { nid: node.nid }), 1);
        },
        [MUT_TYPES.WF_STAGE_SET](state, val = 1) {
            state.stageScale = val;
        },
        [MUT_TYPES.WF_CONDITION_ADD](state, { node, orIndex }) {
            const condition = { cpnt: '', field: "", op: "", data: "", match: '' };
            if (typeof orIndex === 'undefined') {
                node.conditionMap.push([condition])
            } else {
                node.conditionMap[orIndex].push(condition);
            }
        },
        [MUT_TYPES.WF_CONDITION_DEL](state, { node, orIndex, addIndex }) {
            node.conditionMap[orIndex].splice(addIndex, 1);
            if (!node.conditionMap[orIndex].length) node.conditionMap.splice(orIndex, 1);
        },
        [MUT_TYPES.WF_CONDITION_MAKE](state) {
            this.getters[MUT_TYPES.WF_FIND_NODE]({
                options: { nid: -1 },
                cb: (node) => {
                    //检查流程数据合法性
                    if (node.nt === 'leaf') {
                        if (!node.opList.length || typeof node.opa === 'undefined' || node.opa === '' || !node.name) {
                            this.commit(MUT_TYPES.WF_SET_SELECTED, node);
                            throw new Error('请完善');
                        }
                        node.op = node.opList.reduce((a, b) => a + b);
                        node.bodyitemsList.length && (node.bodyitems = node.bodyitemsList.join(','));
                    }

                    if (!node.conditionMap) return;
                    node.condition = transCMapToCondition(node.conditionMap);
                    node.has = node.children.length ? true : false;
                }
            });
        }
    },
    actions: {
        async [MUT_TYPES.WF_SAVE]({ state, getters, commit }) {
            const node = _.cloneDeep(state.node);
            const children = node[0].children;
            node[0].children = [];
            node.push(...children);

            // 将数据跟新需要的参数删除
            const traverse = (data) => {
                for (let item of data) {
                    if (item.update) {
                        item.update.forEach(upItem => {
                            delete upItem.store;
                            delete upItem.cpnt;
                        })
                    }
                    if (item.children && item.children.length) {
                        traverse(item.children)
                    }
                }
            }
            traverse(node);
            const data = {
                pid: state.pid,
                node_id: state.node_id,
                wf_name: state.wfName,
                map_data_code: state.formId,
                wf_list_column: '',
                wf_code: state.wfCode || shortid.generate(),
                wf_map_tp: JSON.stringify(node),
                wf_auth_type: state.wfAuthType,
                wf_filetype: state.wfFiletype.join(','),
                permissionEntries: state.permissionEntries
            }
            return data;
        },
        async [MUT_TYPES.WF_INIT]({ state, getters, commit, dispatch }, params) {

            //获取表单列表
            state.formsList = await API.getFormTree();

            //获取发文类型
            const fRet = await API.wfFileType();
            state.fileTypes = fRet.data;

            if (params.node_id || params.templateId) {
                state.loading = true;
                state.initializing = true;
                let data;
                if (params.node_id) {
                    const ret = await API.workflowcfg({ data: { node_id: params.node_id } });
                    if (!ret.success) return;
                    data = ret.data;
                    state.wfCode = data.wf_code;
                    state.wfFiletype = _.map(data.files, 'wf_filetype');
                } else {
                    const ret = await API.resource({ data: { leaf_id: params.templateId } });
                    if (!ret || !ret.data) return;
                    data = JSON.parse(ret.data.r_data);
                    if (data.wf_filetype) state.wfFiletype = data.wf_filetype.split(',');
                }

                params.node = typeof data.wf_map_tp === 'string' ? JSON.parse(data.wf_map_tp) : data.wf_map_tp;
                params.node[0].children = params.node.splice(1);
                state.wfName = data.wf_name;
                state.formId = data.map_data_code;
                state.tableContent = data.wf_body_tp;
                state.wfAuthType = data.wf_auth_type;
                await dispatch(MUT_TYPES.WF_FORM_SELECT, { id: state.formId, reset: false });
            }

            commit(MUT_TYPES.WF_NODE_INIT, params);
            state.loading = false;
            state.initializing = false;
        },
        async [MUT_TYPES.WF_FORM_SELECT]({ state, getters, commit }, { id, reset = true }) {
            try {
                state.formName = _.find(state.formsList, { node_name: id }).node_display;
            } catch (error) {

            }
            state.loading = true;
            if (reset) {
                state.node[0].children = [];
            }

            const ret = await API.formsCfg({ data: { id }, method: "get" });
            state.formStore = new FormStore(ret.data);
            state.fieldsOptions = state.formStore.search({
                options: { db: true },
                onlyMain: true,
                onlyData: true,
                beforePush: (item) => {
                    item.data.displayName = `[${item.CPNT.name}]${item.data._fieldName}`;
                    return true;
                },
            });
            state.loading = false;
        }
    },
    getters: {
        [MUT_TYPES.WF_FIND_NODE]: (state, getters) => ({ options = {}, cb, opType = 'and', beforePush }) => {
            const list = [];
            (function traverse(item, parent, index) {
                cb && cb(item);

                let searchTag = opType === 'and';
                for (let key in options) {

                    if (opType === 'and') {
                        if (options[key] !== item[key]) {
                            searchTag = false;
                            break;
                        }
                    } else {
                        if (options[key] === item[key]) {
                            searchTag = true;
                            break;
                        }
                    }
                }

                if (searchTag && typeof beforePush === 'function') searchTag = beforePush(item);

                if (searchTag) list.push({ target: item, parent, index })

                if (item.children && item.children.length) {
                    item.children.forEach((chd, i) => traverse(chd, item, i))
                }
            })(state.node[0]);

            if (options.nid) {
                return list.length ? list[0] : {}
            }

            return list;
        }
    }
}

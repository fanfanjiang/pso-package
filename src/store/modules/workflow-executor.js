import MUT_TYPES from '../mutation-types';
import API from "../../service/api.js";
import { REVIEW_OP_TYPE, REVIEW_OP_APPEND } from "../../const/workflow";

const STATE = {
  activeExtendTab: "data",
  loading: false,
  steping: false,
  curStep: null,
  appointStep: null,
  readLevel: 0,
  formStore: null,
  copy: false,
  extend: {}, //提交流程时从外部传入的参数
  userOp: {
    users: [],
    appendType: '',
    text: ''
  },
  data: {
    instanceId: '',
    fileCode: "",
    creator: "",
    ctime: "",
    step: "",
    name: '',
    urgent: '',
    import: '',
    secret: '',
    filetype: '',
    opinion: '',
    d_tag: '',
    msg_tag: '',
    creator_name: '',
    attach: {
      _fieldName: "附件",
      _val: ''
    }
  },
  log: [],
  cfg: {
    wf_name: "",
    wf_code: "",
    wf_map_tp: "",
    wf_body_tp: "",
    wf_status: "",
    wf_table_id: "",
    selectedFileTypes: []
  }
}

export default {
  state: _.cloneDeep(STATE),
  mutations: {
    [MUT_TYPES.WFINS_DATA_RESET](state) {
      Object.assign(state, _.cloneDeep(STATE))
    }
  },
  actions: {
    async  [MUT_TYPES.WFINS_DATA_GET]({ state, getters, commit, dispatch }, { cfgId, readLevel, copy = false, extend }) {
      //只读模式，暂定为有只读等级，也许没有
      state.readLevel = readLevel || 0;
      state.copy = copy;

      if (extend && typeof extend === 'object') {
        state.extend = extend;
      }

      state.loading = true;
      let ret = await API.workflowcfg({ data: { node_id: cfgId } });
      if (ret.success && ret.data) {

        //设置流程图参数
        let node = JSON.parse(ret.data.wf_map_tp);
        let startChildren = node.splice(1);
        node[0].children = startChildren;
        ret.data.wf_map_tp = {
          wfName: ret.data.wf_name,
          formName: "",
          selectedNode: { nid: '' }, //当前执行人所在的流程节点
          clickedNode: { nid: '' }, //流程图操作中选择的节点
          executingNodes: [], //流程正在执行中的节点集合,仅仅为了展示
          node
        }
        state.cfg = ret.data;
      }
      state.loading = false;

      await dispatch(MUT_TYPES.WFINS_INSTANCE_GET);

      //如果是复制
      if (copy) {
        state.data.instanceId = "";
        await dispatch(MUT_TYPES.WFINS_INSTANCE_GET);
        state.data.fileCode = "";
        state.data.creator = "";
        state.data.creator_name = "";
        state.data.ctime = "";
        state.log = [];
      }
    },
    async  [MUT_TYPES.WFINS_INSTANCE_GET]({ state, getters, commit, dispatch }) {

      if (state.data.instanceId) {
        //获取实例的其他参数
        const instanceRet = await API.workflow({ data: { instanceId: state.data.instanceId }, method: "get" });
        if (!instanceRet.success) return;

        //设置基本实例参数
        await dispatch(MUT_TYPES.WFINS_INSTANCE_SET, instanceRet.data.instance);

        //设置步骤参数
        if (instanceRet.data.steps.length) {
          state.cfg.wf_map_tp.executingNodes = instanceRet.data.steps;
        }

        const { target } = getters[MUT_TYPES.WFINS_NODE_GET]({
          nid: state.data.step, cb: tiem => tiem.done = true
        })

        if (target) {
          state.curStep = target;
          state.cfg.wf_map_tp.selectedNode = state.curStep;
        }

        //设置附件
        if (instanceRet.data.file && instanceRet.data.file.length) {
          state.data.attach._val = _.map(instanceRet.data.file, 'res_id').join(',');
        }

        //设置日志
        if (instanceRet.data.log) {
          state.log = instanceRet.data.log;
        }
      } else {
        state.curStep = state.cfg.wf_map_tp.node[0];
        state.cfg.wf_map_tp.selectedNode = state.curStep;
      }
    },
    async  [MUT_TYPES.WFINS_INSTANCE_SET]({ state, getters, commit }, instance = {}) {

      let { instanceId, instanceName = '', fileType = '' } = instance;
      if (instanceId) {
        Object.keys(instance).forEach(key => (state.data.hasOwnProperty(key) && (state.data[key] = instance[key])))
        state.data.filetype = state.data.filetype || fileType;
        state.data.name = state.data.name || instanceName;
      } else {
        // 重新初始化
        Object.assign(state.data, _.cloneDeep(STATE.data));
        Object.assign(state.userOp, _.cloneDeep(STATE.userOp));
        state.curStep = null;
        state.appointStep = null;
      }
    },
    async  [MUT_TYPES.WFINS_NEXTSETP]({ state, getters, commit, dispatch }, { optype, formData }) {
      if (state.loading || state.steping) return;
      state.steping = true;

      if (state.data.instanceId) {
        if (!optype || !state.curStep.nid) {
          state.steping = false;
          throw new Error('参数错误');
        }

        const data = {
          ...state.extend,
          instanceId: state.data.instanceId,
          note: state.data.opinion,
          stepid: state.curStep.nid,
          optype
        }

        //指定操作
        if (optype === REVIEW_OP_TYPE.pickreject.type) {
          if (!state.appointStep || !state.appointStep.nid) {
            state.steping = false;
            throw new Error('请选择指定节点');
          }
          data.newstepid = state.appointStep.nid;
        }

        //用户添加操作
        if (optype === REVIEW_OP_APPEND) {
          if (!state.userOp.appendType || !state.userOp.users.length) {
            state.steping = false;
            throw new Error('请先选择用户');
          }

          data.appendType = state.userOp.appendType;
          data.users = state.userOp.users.map(u => u.user_id).join(',');
        }

        //下一步时有修改表单的需求
        if (formData) {
          if (state.curStep.update && state.curStep.update.length) {
            const updates = state.curStep.update;
            const upData = formData.dataArr[0];

            for (let update of updates) {
              if (!update.fid) continue;
              const cpnt = state.formStore.search({ options: { fid: update.fid } });
              if (cpnt && cpnt.fid) {

                if (update.type === 1) {
                  upData[cpnt.data._fieldValue] = update.value;
                } else {
                  const targetCpnt = state.formStore.search({ options: { fid: update.value } });
                  if (targetCpnt && targetCpnt.fid) {
                    upData[cpnt.data._fieldValue] = upData[targetCpnt.data._fieldValue];
                  }
                }
              }
            }
          }
          data.formData = formData;
        }

        return await API.workflow({ data, method: "put" });
      } else {
        //生成流程
        return await dispatch(MUT_TYPES.WFINS_ADD, { nextStep: true, formData })
      }
    },
    async  [MUT_TYPES.WFINS_SAVE]({ state, getters, commit, dispatch }, { formData }) {
      formData.is_matter = 0;

      //添加扩展参数
      Object.assign(formData, state.extend);

      if (state.data.instanceId) {
        //只保存表单
        return await API.form({ data: { leaf_id: state.data.instanceId, formData }, method: "put" });
      } else {
        //生成流程并执行下一步
        return await dispatch(MUT_TYPES.WFINS_ADD, { nextStep: false, formData })
      }
    },
    async  [MUT_TYPES.WFINS_ADD]({ state, getters, commit }, { nextStep = false, formData }) {
      //生成流程
      if (!state.data.filetype) throw new Error('请选择文号');
      if (!state.data.urgent) throw new Error('请选择紧急程度');
      if (!state.data.import) throw new Error('请选择重要等级');
      if (!state.data.secret) throw new Error('请选择秘密等级');

      const data = {
        filetype: state.data.filetype,
        wfid: state.cfg.wf_code,
        name: state.data.name,
        urgent: state.data.urgent,
        import: state.data.import,
        secret: state.data.secret,
        data: formData,
        stepid: state.curStep.nid,
        d_tag: state.data.d_tag,
        attids: state.data.attach._val,
        nextStep,
        ...state.extend,
      };
      return await API.workflow({ data, method: "post" });
    }
  },
  getters: {
    [MUT_TYPES.WFINS_NODE_GET]: (state, getters) => ({ nid, cb }) => {
      if (!nid) return {};
      let family = {};
      (function findEle(item, parent, index) {
        cb && cb(item);
        if (item.nid === nid) return family = { target: item, parent, index };
        if (item.children && item.children.length) {
          item.children.forEach((chd, i) => findEle(chd, item, i))
        }
      })(state.cfg.wf_map_tp.node[0]);
      return family;
    }
  }
}

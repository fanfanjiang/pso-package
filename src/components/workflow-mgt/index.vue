<template>
  <div class="pso-page">
    <div class="pso-page-body">
      <div class="pso-page__tree">
        <pso-tree-common
          ref="tree"
          :request-options="treeOptions"
          :default-node-data="defaultNodeData"
          :auto-edit="false"
          @before-node-new="handleNewNode"
          @node-click="nodeClickHandler"
        ></pso-tree-common>
      </div>
      <div class="pso-page-body__content">
        <div class="pso-page-body__wrapper" v-if="curNode" v-loading="loading">
          <div class="pso-page-body__header">
            <pso-title>流程：{{curNode.node_display}}</pso-title>
            <div class="pso-page-body__btns">
              <el-button size="small" type="primary" plain @click="handleEditWf">设计流程</el-button>
              <el-button size="small" type="primary" plain @click="handleSaveWf">保存设置</el-button>
            </div>
          </div>
          <div class="pso-page-body__tab">
            <el-tabs v-model="curTab">
              <template v-if="!!curNode.is_leaf">
                <el-tab-pane label="预览" name="preview"></el-tab-pane>
                <el-tab-pane label="签单" name="table"></el-tab-pane>
                <el-tab-pane label="代理" name="proxy"></el-tab-pane>
                <el-tab-pane label="文号" name="file"></el-tab-pane>
                <el-tab-pane label="快捷标签" name="tag"></el-tab-pane>
                <el-tab-pane label="文本" name="text"></el-tab-pane>
                <el-tab-pane label="子流程" name="subwf"></el-tab-pane>
                <el-tab-pane label="状态" name="script"></el-tab-pane>
              </template>
              <el-tab-pane label="权限" name="auth"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="pso-page-body__tabbody">
            <template v-if="!!curNode.is_leaf">
              <div class="pso-page-wf__stage" v-if="curTab==='preview'">
                <pso-wf-stage :workflow-data="wfImage" read-mode v-if="wfImage"></pso-wf-stage>
              </div>
              <pso-wf-table v-if="curTab==='table'"></pso-wf-table>
              <pso-wf-agent v-if="curTab==='proxy'" :node="curNode"></pso-wf-agent>
              <pso-wf-autoid v-if="curTab==='file'" :node="curNode"></pso-wf-autoid>
              <pso-wf-tag v-if="curTab==='tag'" :data="tagData"></pso-wf-tag>
              <pso-wf-text v-if="curTab==='text'" :data="textData"></pso-wf-text>
              <pso-wf-subwf v-if="curTab==='subwf'" :data="subWfData"></pso-wf-subwf>
              <pso-wf-script v-if="curTab==='script'" :data="script"></pso-wf-script>
            </template>
            <pso-nodeauth v-if="curTab==='auth'" :node="curNode" :leaf-authcfg="leafAuthcfg"></pso-nodeauth>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PsoWfStage from "../workflow-designer/stage";
import PsoTypebar from "../type-bar";
import PsoWfTable from "../workflow-designer/table-editor";
import { WF_INIT, WF_RESET } from "../../store/mutation-types";
import { mapState } from "vuex";
import PsoWfTageditor from "./tag-editor";
import PsoWfAgent from "./agent";
import PsoWfTag from "./tag";
import PsoWfText from "./text";
import PsoWfSubwf from "./wf-sub";
import PsoWfAutoid from "./autoid";
import PsoWfScript from "./script";

const _DATA = {
  tagData: [
    {
      tagType: "通过",
      showTag: false,
      tagVal: ["通过", "同意", "没问题"]
    },
    {
      tagType: "退回",
      showTag: false,
      tagVal: ["不同意", "请完善"]
    }
  ],
  textData: [
    {
      type: "提交按钮",
      value: "提交",
      id: "submit",
      show: true
    },
    {
      type: "下一步按钮",
      value: "通过",
      id: "next",
      show: true
    },
    {
      type: "文件编号",
      value: "文件编号",
      id: "file",
      show: false
    },
    {
      type: "重要等级",
      value: "重要等级",
      id: "import",
      show: false
    },
    {
      type: "秘密等级",
      value: "秘密等级",
      id: "secret",
      show: false
    },
    {
      type: "加急程度",
      value: "加急程度",
      id: "urgent",
      show: false
    }
  ],
  subWfData: [],
  script: []
};

export default {
  components: { PsoWfStage, PsoTypebar, PsoWfTable, PsoWfTageditor, PsoWfAgent, PsoWfTag, PsoWfText, PsoWfSubwf, PsoWfAutoid, PsoWfScript },
  props: {
    params: {
      type: Object,
      default: () => {
        data_type: "";
      }
    }
  },
  data() {
    return {
      loading: false,
      curNode: {},
      wfCfg: {},
      curTab: "preview",
      leafAuthcfg: [
        { n: "新增", v: 1 },
        { n: "更改", v: 2 },
        { n: "导出", v: 4 },
        { n: "撤销", v: 8 },
        { n: "归档", v: 16 }
      ],
      ..._DATA
    };
  },
  computed: {
    ...mapState(["wfDesigner"]),
    treeOptions() {
      return {
        dimen: 7,
        data_type: this.params.data_type
      };
    },
    defaultNodeData() {
      return {
        node_dimen: 7
      };
    },
    wfImage() {
      return this.wfCfg.wf_map_tp;
    }
  },
  destroyed() {
    this.$store.commit(WF_RESET);
  },
  methods: {
    async nodeClickHandler(node) {
      if (node.is_leaf) {
        if (this.loading) return;
        this.loading = true;
        this.reset();
        await this.getBaseInfo(node);
        this.$store.commit(WF_RESET);
        await this.getWfCfg(node);
        this.loading = false;
      } else {
        this.curTab = "auth";
      }
      this.curNode = node;
    },
    reset() {
      Object.assign(this.$data, _.cloneDeep(_DATA));
    },
    async getBaseInfo(node) {
      const ret = await this.API.getTreeNode({ code: node.node_name });
      //赋值
      if (ret.success) {
        const cfg = ret.data.data;
        if (cfg.wf_list_column) {
          const text = JSON.parse(cfg.wf_list_column);
          const tempText = [];
          _DATA.textData.forEach(item => {
            const exist = _.find(text, { id: item.id }) || item;
            tempText.push({ ...item, ...exist });
          });
          this.textData = tempText;
        }

        if (cfg.wf_auth_tag) {
          this.tagData = JSON.parse(cfg.wf_auth_tag);
        }

        if (cfg.wf_leaf_setting) {
          this.subWfData = JSON.parse(cfg.wf_leaf_setting);
        }

        if (cfg.wf_sql_setting) {
          this.script = JSON.parse(cfg.wf_sql_setting);
        }
      }
    },
    handleNewNode(payload) {
      if (this.defaultNodeData.data_type === "flowtp") {
        this.goDesigner({});
      } else {
        this.goDesigner({ pid: payload.parent.data.node_id });
      }
    },
    handleEditWf() {
      if (this.curNode.data_type === "flowtp") {
        this.goDesigner({ templateId: this.curNode.node_id });
      } else {
        this.goDesigner({ node_id: this.curNode.node_id });
      }
    },
    goDesigner(query) {
      this.$emit("designer", query);
    },
    async getWfCfg(sourceNode) {
      const ret = await this.API.workflowcfg({ data: { node_id: sourceNode.node_id } });

      //初始化流程设计器
      const node = JSON.parse(ret.data.wf_map_tp);
      node[0].children = node.splice(1);
      ret.data.wf_map_tp = { wfName: ret.data.wf_name, formName: "", node };
      this.wfCfg = ret.data;
      await this.$store.dispatch(WF_INIT, { node_id: sourceNode.node_id });

      if (this.wfDesigner.formStore) {
        const subWfs = this.wfDesigner.formStore.search({ options: { componentid: "asstable" }, onlyData: true });
        subWfs.forEach(item => {
          const isExist = _.find(this.subWfData, { subCode: item._option });
          if (!isExist) {
            this.subWfData.push({
              subForm: item._fieldName,
              subCode: item._option,
              subWf: ""
            });
          }
        });
      }
    },
    async handleSaveWf() {
      this.loading = true;
      const ret = await this.API.trees({
        data: {
          node_id: this.curNode.node_id,
          code: this.curNode.node_name,
          wf_list_column: JSON.stringify(this.textData),
          wf_auth_tag: JSON.stringify(this.tagData),
          wf_leaf_setting: JSON.stringify(this.subWfData),
          wf_sql_setting: JSON.stringify(this.script)
        },
        method: "put"
      });
      this.ResultNotify(ret);
      this.loading = false;
    }
  }
};
</script>
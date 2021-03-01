<template>
  <div :class="viewClass">
    <div class="pso-view-extend">
      <pso-tree-common
        ref="tree"
        :request-options="treeOptions"
        :default-node-data="defaultNodeData"
        :auto-edit="false"
        @before-node-new="handleNewNode"
        @node-click="nodeClickHandler"
      ></pso-tree-common>
    </div>
    <div class="pso-view-body" v-loading="loading">
      <template v-if="curNode">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-document"></i>
              <span>流程：{{ curNode.node_display }}</span>
            </div>
          </div>
          <div class="pso-view-header__r">
            <el-button size="mini" type="primary" plain @click="handleEditWf">设计流程</el-button>
            <el-button size="mini" type="primary" @click="handleSaveWf">保存设置</el-button>
          </div>
        </div>
        <div class="pso-view-viewtab">
          <button-tabs v-if="!!curNode.is_leaf" v-model="curTab" :data="TABS" :indexed="false"></button-tabs>
          <button-tabs v-else v-model="curTab" :data="TABS_FOLDER" :indexed="false"></button-tabs>
        </div>
        <div class="pso-view-table" :style="{ overflow: curTab === 'preview' ? 'hidden' : 'auto' }">
          <template v-if="!!curNode.is_leaf && !loading">
            <div class="pso-page-wf__stage" style="margin-top: 20px" v-if="curTab === 'preview'">
              <pso-wf-stage :workflow-data="wfImage" read-mode v-if="wfImage"></pso-wf-stage>
            </div>
            <pso-wf-agent v-if="curTab === 'proxy'" :node="curNode"></pso-wf-agent>
            <pso-wf-autoid v-if="curTab === 'file'" :node="curNode"></pso-wf-autoid>
            <pso-wf-tag v-if="curTab === 'tag'" :data="tagData"></pso-wf-tag>
            <pso-wf-text v-if="curTab === 'text'" :data="textData"></pso-wf-text>
            <pso-wf-subwf v-if="curTab === 'subwf'" :data="subWfData"></pso-wf-subwf>
            <pso-wf-script
              v-if="curTab === 'script'"
              :data="script"
              :fields="formFields"
              :code="wfDesigner.formStore.data_code"
            ></pso-wf-script>
          </template>
          <div v-if="curTab === 'auth'" style="padding-top: 20px">
            <pso-nodeauth :node="curNode" :leaf-authcfg="leafAuthcfg"></pso-nodeauth>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { WF_INIT, WF_RESET } from "../../store/mutation-types";
import { mapState } from "vuex";

import PsoWfStage from "../workflow-designer/stage";
import PsoTypebar from "../type-bar";
import PsoWfTageditor from "./tag-editor";
import PsoWfAgent from "./agent";
import PsoWfTag from "./tag";
import PsoWfText from "./text";
import PsoWfSubwf from "./wf-sub";
import PsoWfAutoid from "./autoid";
import PsoWfScript from "./script";

import ButtonTabs from "../button-tabs";

import { REVIEW_STATUS } from "../../const/workflow";
import { MgtMixin } from "../../mixin/view";
const TABS = [
  { label: "预览", id: "preview", icon: "el-icon-picture" },
  { label: "状态", id: "script", icon: "el-icon-s-help" },
  { label: "文本", id: "text", icon: "el-icon-s-operation" },
  { label: "文号", id: "file", icon: "el-icon-s-promotion" },
  { label: "快捷标签", id: "tag", icon: "el-icon-document-add" },
  { label: "代理", id: "proxy", icon: "el-icon-s-custom" },
  { label: "子流程", id: "subwf", icon: "el-icon-share" },
  { label: "权限", id: "auth", icon: "el-icon-key" },
];
const TABS_FOLDER = [{ label: "权限", id: "auth", icon: "el-icon-key" }];

const _DATA = {
  tagData: [
    {
      tagType: "通过",
      showTag: false,
      tagVal: ["通过", "同意", "没问题"],
    },
    {
      tagType: "退回",
      showTag: false,
      tagVal: ["不同意", "请完善"],
    },
  ],
  textData: [
    {
      type: "提交按钮",
      value: "提交",
      id: "submit",
      show: true,
    },
    {
      type: "下一步按钮",
      value: "通过",
      id: "next",
      show: true,
    },
    {
      type: "文件编号",
      value: "文件编号",
      id: "file",
      show: false,
    },
    {
      type: "重要等级",
      value: "重要等级",
      id: "import",
      show: false,
    },
    {
      type: "秘密等级",
      value: "秘密等级",
      id: "secret",
      show: false,
    },
    {
      type: "加急程度",
      value: "加急程度",
      id: "urgent",
      show: false,
    },
    ...Object.values(_.cloneDeep(REVIEW_STATUS)).map(({ id, name }) => {
      return {
        type: name,
        value: "",
        id,
        show: true,
      };
    }),
  ],
  subWfData: [],
  script: [],
};

export default {
  components: { ButtonTabs, PsoWfStage, PsoTypebar, PsoWfTageditor, PsoWfAgent, PsoWfTag, PsoWfText, PsoWfSubwf, PsoWfAutoid, PsoWfScript },
  mixins: [MgtMixin],
  props: {
    params: {
      type: Object,
    },
  },
  data() {
    this.TABS = TABS;
    this.TABS_FOLDER = TABS_FOLDER;
    return {
      loading: false,
      curNode: {},
      wfCfg: {},
      curTab: "preview",
      formFields: [],
      leafAuthcfg: [
        { n: "新增", v: 1 },
        { n: "更改", v: 2 },
        { n: "导出", v: 4 },
        { n: "撤销", v: 8 },
        { n: "归档", v: 16 },
      ],
      ..._DATA,
    };
  },
  computed: {
    ...mapState(["wfDesigner"]),
    treeOptions() {
      return {
        dimen: 7,
        data_type: "",
      };
    },
    defaultNodeData() {
      return {
        node_dimen: 7,
      };
    },
    wfImage() {
      return this.wfCfg.wf_map_tp;
    },
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
          _DATA.textData.forEach((item) => {
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
        //获取全字段
        const fieldsRet = await this.API.getFormDict({ data_code: this.wfDesigner.formStore.data_code });
        if (!fieldsRet.success) return;
        this.formFields = fieldsRet.data;
        this.formFields.forEach((item) => {
          const field = this.wfDesigner.formStore.searchByField(item.field_name, true);
          item.field_display = field ? `[${field._fieldName}]${item.field_name}` : `[系统字段]${item.field_name}`;
        });

        const subWfs = this.wfDesigner.formStore.search({ options: { componentid: "asstable" }, onlyData: true });
        subWfs.forEach((item) => {
          const isExist = _.find(this.subWfData, { subCode: item._option });
          if (!isExist) {
            this.subWfData.push({
              subForm: item._fieldName,
              subCode: item._option,
              subWf: "",
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
          wf_sql_setting: JSON.stringify(this.script),
        },
        method: "put",
      });
      this.ResultNotify(ret);
      this.loading = false;
    },
  },
};
</script>
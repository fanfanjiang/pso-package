<template>
  <div :class="viewClass">
    <div class="pso-view-extend">
      <pso-tree-common
        ref="tree"
        :request-options="treeOptions"
        :default-node-data="defaultNodeData"
        :default-nodeid="params.designedFormId"
        :auto-edit="false"
        @before-node-new="newSheet"
        @after-node-new="handleAfterNewdNode"
        @node-click="nodeClickHandler"
      ></pso-tree-common>
    </div>
    <div class="pso-view-body" v-loading="initializing">
      <template v-if="curNode && !initializing">
        <div class="pso-view-header">
          <div class="pso-view-header__l" v-if="!params.hideTitle">
            <div class="pso-view-title">
              <i class="el-icon-document"></i>
              <span>工作表：{{ curNode.node_display }}({{ curNode.node_name }})</span>
            </div>
          </div>
          <div class="pso-view-header__r">
            <el-button size="mini" type="primary" plain @click="saveConfig">保存设置</el-button>
            <el-button size="mini" type="primary" plain @click="goPrinterDeisgner">打印设计</el-button>
            <el-button size="mini" type="primary" plain @click="handleEditForm">表单设计</el-button>
          </div>
        </div>
        <div class="pso-view-viewtab">
          <el-tabs v-model="curTab" type="card">
            <template v-if="!!curNode.is_leaf">
              <el-tab-pane label="数据" name="preview"></el-tab-pane>
              <el-tab-pane label="字段" name="field"></el-tab-pane>
              <el-tab-pane label="列表" name="list"></el-tab-pane>
              <el-tab-pane label="状态" name="status"></el-tab-pane>
              <el-tab-pane label="发布" name="publish"></el-tab-pane>
              <el-tab-pane label="上传" name="upload"></el-tab-pane>
              <el-tab-pane label="显示" name="rule"></el-tab-pane>
              <el-tab-pane label="提交" name="submit"></el-tab-pane>
              <el-tab-pane label="阶段" name="stage"></el-tab-pane>
              <el-tab-pane label="子表" name="asstable"></el-tab-pane>
              <el-tab-pane label="内部API" name="innerapi"></el-tab-pane>
              <el-tab-pane label="外部API" name="outerapi"></el-tab-pane>
            </template>
            <el-tab-pane label="权限" name="auth"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="pso-view-table" v-loading="saving">
          <template v-if="!!curNode.is_leaf">
            <pso-form-view v-show="curTab === 'preview'" :key="curNode.node_id" :cfg-id="curNode.node_name" :view-auth="4"></pso-form-view>
            <form-field v-if="curTab === 'field'" :data="tableData" :code="curNode.node_name"></form-field>
            <form-column v-if="curTab === 'list'" :data="colCfg" :def-col="colData"></form-column>
            <form-status
              v-if="curTab === 'status' && formStore"
              :code="formStore.data_code"
              :data="staData"
              :fields="tableData"
            ></form-status>
            <form-status
              v-if="curTab === 'stage' && formStore"
              :code="formStore.data_code"
              :data="stageData"
              :fields="tableData"
            ></form-status>
            <form-publish
              v-if="curTab === 'publish' && formStore"
              :data="pubCfg"
              :node="curNode"
              :store="formStore"
              @save="saveConfig"
            ></form-publish>
            <form-upload v-if="curTab === 'upload' && formStore" :data="upload" :code="curNode.node_name" :store="formStore"></form-upload>
            <form-rule v-if="curTab === 'rule' && formStore" :store="formStore" :rules="rules"></form-rule>
            <form-submit v-if="curTab === 'submit'" :data="subCfg" :fields="tableData"></form-submit>
            <form-asstable v-if="curTab === 'asstable' && formStore" :store="formStore" :data="asstable"></form-asstable>
            <form-iapicfg v-if="curTab === 'innerapi'" :data="inner_api" :fields="tableData" :code="formStore.data_code"></form-iapicfg>
            <form-oapicfg v-if="curTab === 'outerapi'"></form-oapicfg>
          </template>
          <pso-nodeauth v-if="curTab === 'auth'" :node="curNode" :leaf-authcfg="leafAuthcfg"></pso-nodeauth>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { formOp } from "../form-designer/mixin.js";
import PsoNodeauth from "../node-auth";
import PsoTitle from "../title";
import PsoFormAttach from "../form-interpreter/components/attachment";

import FormField from "./form-field";
import FormColumn from "./form-column";
import FormStatus from "./form-status";
import FormPublish from "./form-publish";
import FormRule from "./form-rule";
import FormSubmit from "./form-submit";
import FormAsstable from "./form-asstable";
import FormUpload from "./form-upload";
import FormIapicfg from "./form-iapicfg";
import FormOapicfg from "./form-oapicfg";
import { FORM_COLUMN_FIELDS } from "../../const/sys";
import { formatJSONList } from "../../utils/util";
import { MgtMixin } from "../../mixin/view";

const _DATA = {
  tableData: [],
  colData: [],
  colCfg: {
    def: "",
    column: [],
  },
  staData: [],
  pubCfg: {
    isPublic: false,
    attach: "",
    name: "",
    subBtnText: "",
    doneText: "",
    qrList: [],
    rules: [],
    submitable: true,
    formLabelPosition: "top",
    formLabelWith: "",
  },
  upload: [],
  rules: [],
  subCfg: [],
  stageData: [],
  asstable: [],
  inner_api: {
    inner_type: "",
    async_type: "",
    async_stime: "",
    async_etime: "",
    inner_return: [],
    inner_params: {},
    field_config: {},
    api_tag: "",
    return_tag: "",
    incre_type: "",
    incre_field: "",
  },
  outer_api: {},
};

export default {
  mixins: [formOp, MgtMixin],
  components: {
    FormField,
    PsoNodeauth,
    PsoTitle,
    PsoFormAttach,
    FormColumn,
    FormStatus,
    FormPublish,
    FormRule,
    FormSubmit,
    FormAsstable,
    FormUpload,
    FormIapicfg,
    FormOapicfg,
  },
  props: {
    params: {
      type: Object,
      default: () => {
        data_type: "";
      },
    },
  },
  data() {
    return {
      initializing: true,
      appid: "Main",
      key: 0,
      treeOptions: {
        dimen: 3,
        data_type: this.params.data_type,
      },
      defaultNodeData: {
        node_dimen: 3,
      },
      curNode: null,
      curTab: "preview",
      saving: false,
      formStore: null,
      leafAuthcfg: [
        { n: "新增", v: 1 },
        { n: "更改", v: 2 },
        { n: "导出", v: 4 },
        { n: "更改阶段", v: 8 },
      ],
      ..._DATA,
    };
  },
  methods: {
    reset() {
      Object.assign(this.$data, _.cloneDeep(_DATA));
    },
    async newSheet() {
      this.goForm({ pid: this.$refs.tree.nodePayload.parent.data.node_id });
    },
    async setSelect(data, tab = "preview") {
      this.initializing = true;
      this.reset();
      if (!data.is_leaf) tab = "auth";

      this.curTab = tab;
      this.curNode = data;

      if (data.is_leaf) {
        const formStore = await this.makeFormStore(this.curNode.node_name);
        this.formStore = formStore;

        await this.getListTableData(formStore);
        await this.getFields(formStore);
        await this.getFormInfo();
      }
      this.initializing = false;
    },
    compareCol(list) {
      const l = [];
      for (let i of this.colData) {
        const exist = _.find(list, { field_name: i.field_name }) || {};
        l.push({ ...i, ...exist });
      }
      formatJSONList(l, FORM_COLUMN_FIELDS, false);
      return l;
    },
    async getFormInfo() {
      const ret = await this.API.getTreeNode({ code: this.curNode.node_name });

      //赋值
      if (ret.success) {
        const cfg = ret.data.data;
        if (cfg.pub_config) {
          this.pubCfg = Object.assign(this.pubCfg, JSON.parse(cfg.pub_config));
        }

        if (cfg.status_config) {
          this.staData = JSON.parse(cfg.status_config);
        }

        if (cfg.stage_config) {
          this.stageData = JSON.parse(cfg.stage_config);
        }

        if (cfg.display_columns) {
          const colCfg = JSON.parse(cfg.display_columns);
          if (Array.isArray(colCfg)) {
            if (colCfg.length) {
              this.colCfg.def = "默认";
              this.colCfg.column.push({
                name: "默认",
                data: this.compareCol(colCfg, FORM_COLUMN_FIELDS),
              });
            }
          } else {
            colCfg.column.forEach((c) => {
              c.data = this.compareCol(c.data);
            });
            this.colCfg = colCfg;
          }
        }

        if (cfg.rule_config) {
          this.rules = JSON.parse(cfg.rule_config);
        }

        if (cfg.submit_config) {
          this.subCfg = JSON.parse(cfg.submit_config);
        }

        if (cfg.sub_config) {
          this.asstable = JSON.parse(cfg.sub_config);
        }

        if (cfg.export_config) {
          this.upload = JSON.parse(cfg.export_config);
        }

        if (cfg.inner_api) {
          Object.assign(this.inner_api, JSON.parse(cfg.inner_api));
        }
      }
    },
    nodeClickHandler(data) {
      this.setSelect(data);
    },
    handleAfterNewdNode(data) {
      this.setSelect(data, "field");
    },
    handleEditForm() {
      this.goForm({ id: this.curNode.node_name });
    },
    goPrinterDeisgner() {
      window.open(`/printer-designer/${this.curNode.node_name}`, "_blank");
    },
    goForm({ pid = "", id = "" }) {
      this.$router.push({ name: "formDesigner", params: { appid: this.appid }, query: { pid, id, appid: this.appid } });
    },
    async getFields(formStore) {
      let ret = await this.API.getFormDict({ data_code: this.curNode.node_name });
      if (!ret.success) return;
      this.tableData = ret.data;
      this.tableData.forEach((item) => {
        const field = formStore.searchByField(item.field_name, true);
        item.field_display = field ? `${field._fieldName}[${item.field_name}]` : `系统字段[${item.field_name}]`;
      });
    },
    async getListTableData(formStore) {
      const ret = await this.API.getFormDict({ data_code: this.curNode.node_name });
      if (!ret.success) return;
      ret.data.forEach((item) => {
        if (item) {
          const field = formStore.searchByField(item.field_name, true);
          item.display = item.display_name || (field ? field._fieldName : "");
          this.colData.push(item);
        }
      });
    },
    async saveConfig() {
      this.saving = true;

      //提取规则参数
      const rules = [];
      this.rules.forEach((item) => {
        const rule = {
          controlType: item.controlType,
          controlIds: item.controlIds,
          filters: [],
          type: item.type,
        };
        item.filters.forEach((fitem) => {
          rule.filters.push({
            id: fitem.id,
            name: fitem.name,
            cid: fitem.cid,
            op: fitem.op,
            val: fitem.val,
          });
        });
        rules.push(rule);
      });

      //发布规则
      const pubdata = {
        isPublic: this.pubCfg.isPublic,
        attach: this.pubCfg.attach,
        name: this.pubCfg.name,
        subBtnText: this.pubCfg.subBtnText,
        doneText: this.pubCfg.doneText,
        qrList: this.pubCfg.qrList,
        submitable: this.pubCfg.submitable,
        formLabelPosition: this.pubCfg.formLabelPosition,
        formLabelWith: this.pubCfg.formLabelWith,
        rules: [],
      };

      this.pubCfg.rules.forEach((item) => {
        pubdata.rules.push({
          id: item.id,
          name: item.name,
          cid: item.cid,
          val: item.val,
        });
      });

      //提交规则
      const subCfgData = [];
      this.subCfg.forEach((item) => {
        subCfgData.push({ ...item, params: item.param.join(",") });
      });
      const ret = await this.API.updateFormTree({
        data_code: this.curNode.node_name,
        display_columns: JSON.stringify(this.colCfg),
        status_config: JSON.stringify(this.staData),
        pub_config: JSON.stringify(pubdata),
        rule_config: JSON.stringify(rules),
        submit_config: JSON.stringify(subCfgData),
        stage_config: JSON.stringify(this.stageData),
        sub_config: JSON.stringify(this.asstable),
        export_config: JSON.stringify(this.upload),
        inner_api: JSON.stringify(this.inner_api),
      });

      this.saving = false;
      this.$notify({ title: ret.success ? "保存成功" : "保存失败", type: ret.success ? "success" : "warning" });
    },
  },
};
</script>

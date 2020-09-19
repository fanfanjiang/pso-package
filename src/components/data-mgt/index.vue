<template>
  <div class="pso-data-mgmt">
    <div class="pso-data-mgmt__tree">
      <pso-tree-common
        ref="tree"
        :request-options="treeOptions"
        :default-node-data="defaultNodeData"
        :default-nodeid="params.designedFormId"
        :auto-edit="false"
        @before-node-new="showWorksheetSelector=true"
        @after-node-new="handleAfterNewdNode"
        @node-click="nodeClickHandler"
      ></pso-tree-common>
    </div>
    <div class="pso-data-mgmt__content" v-loading="initializing">
      <div class="pso-dd" v-if="curNode&&!initializing">
        <div class="pso-dd-header">
          <pso-title>工作表：{{curNode.node_display}}({{curNode.node_name}})</pso-title>
          <div class="pso-dd-header__btns">
            <el-button size="mini" type="primary" plain @click="saveConfig">保存设置</el-button>
            <el-button size="mini" type="primary" plain @click="handleEditForm">设计表单</el-button>
            <el-button size="mini" type="primary" plain @click="changeAllFormCol">转换所有列表配置</el-button>
          </div>
        </div>
        <div class="pso-dd-tab">
          <el-tabs v-model="curTab">
            <template v-if="!!curNode.is_leaf">
              <el-tab-pane label="数据" name="preview"></el-tab-pane>
              <el-tab-pane label="字段" name="field"></el-tab-pane>
              <el-tab-pane label="列表" name="list"></el-tab-pane>
              <el-tab-pane label="状态" name="status"></el-tab-pane>
              <el-tab-pane label="发布" name="publish"></el-tab-pane>
              <!-- <el-tab-pane label="属性" name="property"></el-tab-pane> -->
              <el-tab-pane label="显示" name="rule"></el-tab-pane>
              <el-tab-pane label="提交" name="submit"></el-tab-pane>
              <el-tab-pane label="阶段" name="stage"></el-tab-pane>
              <el-tab-pane label="子表" name="asstable"></el-tab-pane>
            </template>
            <el-tab-pane label="权限" name="auth"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="pso-dd-body" v-loading="saving">
          <template v-if="!!curNode.is_leaf">
            <pso-form-view
              v-show="curTab==='preview'"
              :cfg-id="curNode.node_name"
              :auto-submit="true"
              :read-only="false"
              :key="curNode.node_id"
            ></pso-form-view>
            <form-field v-if="curTab==='field'" :data="tableData" :code="curNode.node_name"></form-field>
            <form-column v-if="curTab==='list'" :data="colCfg" :def-col="colData"></form-column>
            <form-status
              v-if="curTab==='status'"
              :data="staData"
              :fields="tableData"
              @save="saveConfig"
            ></form-status>
            <form-stage v-if="curTab==='stage'" :data="stageData" @save="saveConfig"></form-stage>
            <form-publish
              v-if="curTab==='publish'&&formStore"
              :data="pubCfg"
              :node="curNode"
              :store="formStore"
              @save="saveConfig"
            ></form-publish>
            <!-- <form-property
              v-if="curTab==='property'"
              :data="property"
              :fields="colData"
              :store="formStore"
              @save="saveConfig"
            ></form-property>-->
            <form-rule v-if="curTab==='rule'&&formStore" :store="formStore" :rules="rules"></form-rule>
            <form-submit v-if="curTab==='submit'" :data="subCfg" :fields="tableData"></form-submit>
            <form-asstable
              v-if="curTab==='asstable'&&formStore"
              :store="formStore"
              :data="asstable"
            ></form-asstable>
          </template>
          <pso-nodeauth v-if="curTab==='auth'" :node="curNode" :leaf-authcfg="leafAuthcfg"></pso-nodeauth>
        </div>
      </div>
    </div>
    <el-dialog
      title="选择工作表类型"
      width="30%"
      custom-class="worksheet-dialog"
      :append-to-body="true"
      :center="true"
      :visible.sync="showWorksheetSelector"
    >
      <div class="pso-worksheet-menu">
        <div class="pso-worksheet-menu__tip">{{curWsMenu.tip}}</div>
        <div class="pso-worksheet-menu__list">
          <div
            :class="[{'pso-worksheet-menu__item':true,'active':curWsMenu===item}]"
            @mouseenter="curWsMenu=item"
            @mouseleave="curWsMenu={}"
            @click="newSheet(item)"
            v-for="(item,index) in worksheetMenu"
            :key="index"
          >
            <img :src="curWsMenu===item?item.icon[1]:item.icon[0]" :alt="item.name" />
            <span>{{item.name}}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { SHEET_MENU } from "./const.js";
import { formOp } from "../form-designer/mixin.js";
import PsoNodeauth from "../node-auth";
import PsoTitle from "../title";
import PsoFormAttach from "../form-interpreter/components/attachment";

import FormField from "./form-field";
import FormColumn from "./form-column";
import FormStatus from "./form-status";
import FormPublish from "./form-publish";
import FormProperty from "./form-property";
import FormRule from "./form-rule";
import FormSubmit from "./form-submit";
import FormStage from "./form-stage";
import FormAsstable from "./form-asstable";
import { FORM_COLUMN_FIELDS } from "../../const/sys";
import { formatJSONList } from "../../utils/util";

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
  },
  property: {
    cal_mark: 0,
    cal_amount_field: "",
    cal_tag_field: "",
    cal_unit_field: "",
    cal_parent_tag: "",
    cal_source_main_form: "",
    cal_source_leaf_form: "",
    cal_end_leaf_form: "",
  },
  rules: [],
  subCfg: [],
  stageData: [],
  asstable: [],
};

export default {
  mixins: [formOp],
  components: {
    FormField,
    PsoNodeauth,
    PsoTitle,
    PsoFormAttach,
    FormColumn,
    FormStatus,
    FormPublish,
    FormProperty,
    FormRule,
    FormSubmit,
    FormStage,
    FormAsstable,
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
      worksheetMenu: SHEET_MENU,
      showWorksheetSelector: false,
      curWsMenu: {},
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
    async newSheet({ id }) {
      if (id === "form") {
        this.goForm({ pid: this.$refs.tree.nodePayload.parent.data.node_id });
      }
      if (id === "excel" || id === "xml") {
        this.$refs.tree.nodePayload.showForm = true;
      }
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
    async changeAllFormCol() {
      this.saving = true;
      const trees = await this.API.getFormTree();
      for (let tr of trees) {
        const ret = await this.API.getTreeNode({ code: tr.node_name });
        const cfg = ret.data.data;
        if (cfg.display_columns) {
          const colCfg = JSON.parse(cfg.display_columns);
          if (Array.isArray(colCfg)) {
            if (colCfg.length) {
              await this.API.updateFormTree({
                data_code: tr.node_name,
                display_columns: JSON.stringify({
                  def: "默认",
                  column: [
                    {
                      name: "默认",
                      data: this.compareCol(colCfg, FORM_COLUMN_FIELDS),
                    },
                  ],
                }),
              });
            } else {
              await this.API.updateFormTree({
                data_code: tr.node_name,
                display_columns: "",
              });
            }
          }
        }
      }
      this.saving = false;
      this.$message.error("完成");
    },
    compareCol(list) {
      const l = [];
      for (let i of this.colData) {
        const exist = _.find(list, { field_name: i.field_name }) || {};
        l.push({ ...i, ...exist });
      }
      formatJSONList(l, FORM_COLUMN_FIELDS);
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
      }
    },
    nodeClickHandler(data) {
      this.setSelect(data);
    },
    handleAfterNewdNode(data) {
      this.setSelect(data, "field");
      this.showWorksheetSelector = false;
    },
    handleEditForm() {
      this.goForm({ id: this.curNode.node_name });
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
        item.field_display = field ? `[${field._fieldName}]${item.field_name}` : `[系统字段]${item.field_name}`;
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
        ...this.property,
      });
      this.saving = false;
      this.$notify({ title: ret.success ? "保存成功" : "保存失败", type: ret.success ? "success" : "warning" });
    },
  },
};
</script>

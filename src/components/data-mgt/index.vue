<template>
  <div class="pso-data-mgmt">
    <div class="pso-data-mgmt__tree" v-bar>
      <div>
        <pso-tree-common
          ref="tree"
          :request-options="treeOptions"
          :default-node-data="defaultNodeData"
          :auto-edit="false"
          @before-node-new="showWorksheetSelector=true"
          @after-node-new="handleAfterNewdNode"
          @node-click="nodeClickHandler"
        ></pso-tree-common>
      </div>
    </div>
    <div class="pso-data-mgmt__content" v-bar>
      <div>
        <div class="pso-dd" v-if="curNode">
          <div class="pso-dd-header">
            <pso-title>工作表：{{curNode.node_display}}</pso-title>
            <div class="pso-dd-header__btns">
              <el-button size="small" type="primary" plain @click="handleEditForm">设计表单</el-button>
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
                <el-tab-pane label="属性" name="property"></el-tab-pane>
              </template>
              <el-tab-pane label="权限" name="auth"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="pso-dd-body" v-loading="saving">
            <template v-if="!!curNode.is_leaf">
              <pso-form-table
                v-if="curTab==='preview'"
                :cfg-id="curNode.node_name"
                :auto-submit="true"
                :read-only="false"
              ></pso-form-table>
              <form-field v-if="curTab==='field'" :data="tableData" :code="curNode.node_name"></form-field>
              <form-column v-if="curTab==='list'" :data="colData" @save="saveConfig"></form-column>
              <form-status v-if="curTab==='status'" :data="staData" @save="saveConfig"></form-status>
              <form-publish
                v-if="curTab==='publish'"
                :data="pubCfg"
                :node="curNode"
                @save="saveConfig"
              ></form-publish>
              <form-property
                v-if="curTab==='property'"
                :data="property"
                :fields="colData"
                :store="formStore"
                @save="saveConfig"
              ></form-property>
            </template>
            <pso-nodeauth v-if="curTab==='auth'" :node="curNode"></pso-nodeauth>
          </div>
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
import PsoFormTable from "../form-table";
import { formOp } from "../form-designer/mixin.js";
import PsoNodeauth from "../node-auth";
import PsoTitle from "../title";
import PsoFormAttach from "../form-interpreter/components/attachment";

import FormField from "./form-field";
import FormColumn from "./form-column";
import FormStatus from "./form-status";
import FormPublish from "./form-publish";
import FormProperty from "./form-property";

const _DATA = {
  tableData: [],
  colData: [],
  staData: [],
  pubCfg: {
    isPublic: false,
    attach: {
      _fieldName: "附件",
      _val: ""
    },
    name: "",
    subBtnText: "",
    doneText: ""
  },
  property: {
    cal_mark: 0,
    cal_amount_field: "",
    cal_tag_field: "",
    cal_unit_field: "",
    cal_parent_tag: "",
    cal_source_main_form: "",
    cal_source_leaf_form: "",
    cal_end_leaf_form: ""
  }
};

export default {
  mixins: [formOp],
  components: { PsoFormTable, FormField, PsoNodeauth, PsoTitle, PsoFormAttach, FormColumn, FormStatus, FormPublish, FormProperty },
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
      appid: "Main",
      key: 0,
      worksheetMenu: SHEET_MENU,
      showWorksheetSelector: false,
      curWsMenu: {},
      treeOptions: {
        dimen: 3,
        data_type: this.params.data_type
      },
      defaultNodeData: {
        node_dimen: 3
      },
      curNode: null,
      curTab: "preview",
      saving: false,
      formStore: null,
      ..._DATA
    };
  },
  computed: {},
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

        if (cfg.display_columns) {
          const columns = JSON.parse(cfg.display_columns);
          this.colData.forEach(item => {
            const col = _.find(columns, { field_name: item.field_name });
            if (col) {
              item = Object.assign(item, col);
              console.log(item);
            }
          });
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
      let ret = await this.API.dict({ data: { data_code: this.curNode.node_name, app_id: this.appid } });
      if (!ret.success) return;
      this.tableData = ret.data;
      this.tableData.forEach(item => {
        const field = formStore.search({ options: { fid: item.field_name }, onlyData: true });
        item.field_display = field ? field._fieldName : "系统字段";
      });
    },
    async getListTableData(formStore) {
      const ret = await this.API.getFormDict({ data_code: this.curNode.node_name });
      if (!ret.success) return;
      let number = 0;
      ret.data.forEach(item => {
        if (item) {
          const field = formStore.search({ options: { fid: item.field_name }, onlyData: true });
          item.display_name = item.display_name || (field ? field._fieldName : "");
          this.colData.push({ ...item, width: "", using: "1", is_show: "1", align: "left", number });
          number++;
        }
      });
    },
    async saveConfig() {
      this.saving = true;
      const ret = await this.API.updateFormTree({
        data_code: this.curNode.node_name,
        display_columns: JSON.stringify(this.colData),
        status_config: JSON.stringify(this.staData),
        pub_config: JSON.stringify(this.pubCfg),
        ...this.property
      });
      this.saving = false;
      this.$notify({ title: ret.success ? "保存成功" : "保存失败", type: ret.success ? "success" : "warning" });
    }
  }
};
</script>

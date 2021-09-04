<template>
  <div :class="viewClass">
    <div class="pso-view-extend">
      <pso-tree-common
        ref="tree"
        :request-options="treeOptions"
        :default-node-data="defaultNodeData"
        :default-nodeid="$store.state.base.designedForm"
        :auto-edit="false"
        @before-node-new="newSheet"
        @after-node-new="handleAfterNewdNode"
        @node-click="nodeClickHandler"
      ></pso-tree-common>
    </div>
    <div class="pso-view-body" v-loading="initializing">
      <template v-if="curNode && !initializing">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-document"></i>
              <span>设计器</span>
            </div>
          </div>
          <div class="pso-view-header__r">
            <el-button size="mini" type="primary">保存</el-button>
            <el-button size="mini" type="primary">发布</el-button>
          </div>
        </div>
        <div class="pso-view-viewtab">
          <button-tabs v-if="!!curNode.is_leaf" v-model="curTab" :data="TABS" :indexed="false"></button-tabs>
        </div>
        <div class="pso-view-table" v-loading="saving">
          <template v-if="!!curNode.is_leaf">
            <plugin-stats v-if="curTab === 'shit'" :config="{}" :node="curNode" :header="[]" :column="[]" :headerable="false"></plugin-stats>
            <pso-form-view v-show="curTab === 'preview'" :cfg-id="curNode.node_name" :view-auth="4" wipeable wipeallable> </pso-form-view>
            <form-column v-if="curTab === 'list'" :data="colCfg" :def-col="colData" :actions="actions" :store="formStore"></form-column>
            <ophis v-show="curTab === 'ophis'"></ophis>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { formOp } from "../../form-designer/mixin.js";

import FormColumn from "../../form-mgt/form-column";
import PluginStats from "../../plugin-mgt/stats";

import ButtonTabs from "../../button-tabs";

import Uphis from "../uphis";
import Ophis from "../ophis";

import { ATUH_LEAF_FORM } from "../../../const/sys";
import { FORM_COLUMN_FIELDS } from "../../../const/sys";
import { formatJSONList, assignJSONDB } from "../../../utils/util";
import { MgtMixin } from "../../../mixin/view";
import { _DATA } from "../../form-mgt/const";

const TABS = [
  { label: "脚本设计", id: "shit", icon: "el-icon-picture" },
  { label: "表设计", id: "list", icon: "el-icon-picture" },
  { label: "数据预览", id: "preview", icon: "el-icon-coin" },
  { label: "操作记录", id: "ophis", icon: "el-icon-coin" },
];

export default {
  mixins: [formOp, MgtMixin],
  components: {
    FormColumn,
    ButtonTabs,
    Uphis,
    Ophis,
    PluginStats,
  },
  props: {
    params: {
      type: Object,
    },
  },
  data() {
    this.TABS = TABS;
    return {
      initializing: true,
      appid: "",
      key: 0,
      treeOptions: {
        dimen: 3,
      },
      defaultNodeData: {
        node_dimen: 3,
      },
      curNode: null,
      curTab: "shit",
      saving: false,
      formStore: null,
      leafAuthcfg: ATUH_LEAF_FORM,
      showCodeEditor: false,
      code: "",
      ..._.cloneDeep(_DATA),
    };
  },
  methods: {
    reset() {
      Object.assign(this.$data, _.cloneDeep(_DATA));
    },
    async newSheet() {
      this.goForm({ pid: this.$refs.tree.nodePayload.parent.data.node_id });
    },
    async setSelect(data, tab = "shit") {
      if (!data.is_leaf) return;
      this.initializing = true;
      this.reset();

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
          this.pubCfg = JSON.parse(cfg.pub_config);
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
          const uploadCfg = JSON.parse(cfg.export_config);
          if (Array.isArray(uploadCfg)) {
            this.upload.mainfields = uploadCfg;
          } else {
            this.upload = uploadCfg;
          }
        }

        if (cfg.inner_api) {
          Object.assign(this.inner_api, JSON.parse(cfg.inner_api));
        }

        if (cfg.data_button) {
          this.actions = JSON.parse(cfg.data_button);
        }

        if (cfg.ext_config) {
          this.ext_config = JSON.parse(cfg.ext_config);
          assignJSONDB(this.ext_config, _DATA.ext_config);
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
      this.$store.state.base.designedForm = this.curNode.node_name;
      this.goForm({ id: this.curNode.node_name });
    },
    goForm({ pid = "", id = "" }) {
      this.$router.push({ name: "formDesigner", query: { pid, id } });
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

      const ret = await this.API.updateFormTree({
        data_code: this.curNode.node_name,
        display_columns: JSON.stringify(this.colCfg),
        status_config: JSON.stringify(this.staData),
        pub_config: JSON.stringify(this.pubCfg),
        rule_config: JSON.stringify(rules),
        submit_config: JSON.stringify(this.subCfg),
        stage_config: JSON.stringify(this.stageData),
        sub_config: JSON.stringify(this.asstable),
        export_config: JSON.stringify(this.upload),
        inner_api: JSON.stringify(this.inner_api),
        data_button: JSON.stringify(this.actions),
        ext_config: JSON.stringify(this.ext_config),
      });

      this.saving = false;
      this.$notify({ title: ret.success ? "保存成功" : "保存失败", type: ret.success ? "success" : "warning" });
    },
    async editCode() {
      if (!this.code) return;
      this.showCodeEditor = false;
      const ret = await this.API.updateFormCode({ data_code: this.curNode.node_name, change_code: this.code });
      this.ResultNotify(ret);
    },
  },
};
</script>

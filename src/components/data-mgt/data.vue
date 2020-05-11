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
            <div class="pso-dd-header__title">工作表：{{curNode.node_name}}</div>
            <div class="pso-dd-header__btns">
              <el-button size="small" type="primary" plain @click="handleEditForm">编辑表单</el-button>
            </div>
          </div>
          <div class="pso-dd-tab">
            <el-tabs v-model="curTab" @tab-click="handleTabClick">
              <el-tab-pane label="数据预览" name="preview"></el-tab-pane>
              <el-tab-pane label="字段预览" name="field"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="pso-dd-body">
            <div v-if="curTab==='preview'">
              <pso-form-table :cfg-id="curNode.data_code" :auto-submit="true" :read-only="false"></pso-form-table>
            </div>
            <div v-if="curTab==='field'">
              <el-table v-loading="tableLoading" :data="tableData" style="width: 100%">
                <el-table-column prop="field_display" label="字段名" width="180"></el-table-column>
                <el-table-column prop="field_name" label="字段字典名" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作"></el-table-column>
              </el-table>
            </div>
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

export default {
  components: { PsoFormTable },
  props: {
    appid: {
      type: String,
      default: "3"
    },
    treeOptions: Object
  },
  data() {
    return {
      key: 0,
      worksheetMenu: SHEET_MENU,
      showWorksheetSelector: false,
      curWsMenu: {},
      defaultNodeData: {
        data_type: this.treeOptions.data_type,
        node_dimen: this.treeOptions.node_dimen
      },
      curNode: null,
      curTab: "preview",
      tableData: [],
      tableLoading: false
    };
  },
  methods: {
    async newSheet({ id }) {
      if (id === "form") {
        this.goForm({ pid: this.$refs.tree.nodePayload.parent.data.node_id });
      }
      if (id === "excel" || id === "xml") {
        this.$refs.tree.nodePayload.showForm = true;
      }
    },
    setSelect(data, tab = "preview") {
      this.curTab = tab;
      this.curNode = data;
      this.getFields();
    },
    nodeClickHandler(data) {
      data.is_leaf && this.setSelect(data);
    },
    handleAfterNewdNode(data) {
      this.setSelect(data, "field");
      this.showWorksheetSelector = false;
    },
    handleEditForm() {
      this.goForm({ id: this.curNode.data_code });
    },
    goForm({ pid = "", id = "" }) {
      this.$router.push({ name: "formDesigner", query: { pid, id, appid: this.appid } });
    },
    async getFields() {
      this.tableLoading = true;
      let ret = await this.API.dict({ data: { data_code: this.curNode.data_code, app_id: this.appid } });
      if (!ret.success) return;
      this.tableLoading = false;
      this.tableData = ret.data;
    }
  }
};
</script>
<style lang="less">
@import "../../assets/less/component/data-mgmt.less";
</style>
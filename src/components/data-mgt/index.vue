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
              <el-tab-pane label="数据预览" name="preview"></el-tab-pane>
              <el-tab-pane label="字段预览" name="field"></el-tab-pane>
              <el-tab-pane label="列表设置" name="list"></el-tab-pane>
              <el-tab-pane label="状态设置" name="status"></el-tab-pane>
              <el-tab-pane label="权限设置" name="auth"></el-tab-pane>
              <el-tab-pane label="发布设置" name="publish"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="pso-dd-body">
            <div v-if="curTab==='preview'">
              <pso-form-table :cfg-id="curNode.node_name" :auto-submit="true" :read-only="false"></pso-form-table>
            </div>
            <div v-if="curTab==='field'">
              <el-table key="field" v-loading="tableLoading" :data="tableData" style="width: 100%">
                <el-table-column type="index" :index="1"></el-table-column>
                <el-table-column prop="field_name" label="字段" width="180"></el-table-column>
                <el-table-column prop="field_display" label="显示名称" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作">
                  <template slot-scope="scope" v-if="scope.row.field_name">
                    <pso-field-auth
                      :field_name="scope.row.field_name"
                      :data_code="curNode.node_name"
                    ></pso-field-auth>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-if="curTab==='list'">
              <el-button
                size="small"
                :disabled="listCfgSaving"
                :loading="listCfgSaving"
                plain
                @click="saveConfig"
              >保存列表配置</el-button>
              <el-table
                key="list"
                v-loading="listCfgLoading"
                :data="listCfgData"
                style="width: 100%"
              >
                <el-table-column type="index" :index="1"></el-table-column>
                <el-table-column prop="field_name" label="字段" width="180"></el-table-column>
                <el-table-column label="显示名名称">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row.display_name" placeholder></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="列宽">
                  <template slot-scope="scope">
                    <el-input-number
                      size="small"
                      v-model="scope.row.width"
                      controls-position="right"
                      :min="0"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="启用" width="100">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.using" active-value="1" inactive-value="0"></el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="隐藏" width="100">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.is_show" active-value="1" inactive-value="0"></el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="对齐方式">
                  <template slot-scope="scope">
                    <el-select size="small" v-model="scope.row.align">
                      <el-option label="居中" value="center"></el-option>
                      <el-option label="居左" value="left"></el-option>
                      <el-option label="居右" value="right"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="顺序">
                  <template slot-scope="scope">
                    <el-input-number
                      size="small"
                      v-model="scope.row.number"
                      controls-position="right"
                      :min="0"
                    ></el-input-number>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-if="curTab==='status'">
              <el-button size="small" type="primary" plain @click="addStatusCfgItem">添加属性</el-button>
              <el-table key="status" :data="statusCfgData" style="width: 100%">
                <el-table-column label="状态值" width="200">
                  <template slot-scope="scope">
                    <el-input-number
                      size="small"
                      v-model="scope.row.value"
                      controls-position="right"
                      :min="0"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="显示名称">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row.name" placeholder></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="显示颜色" align="center">
                  <template slot-scope="scope">
                    <el-color-picker size="small" v-model="scope.row.color"></el-color-picker>
                  </template>
                </el-table-column>
                <el-table-column label="显示方式">
                  <template slot-scope="scope">
                    <el-select size="small" v-model="scope.row.display">
                      <el-option label="仅自身文字" value="1"></el-option>
                      <el-option label="整行文字" value="2"></el-option>
                      <el-option label="整行背景色" value="3"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-if="curTab==='auth'">
              <pso-nodeauth :node="curNode"></pso-nodeauth>
            </div>
            <div v-if="curTab==='publish'">
              <div>
                <span>是否对外开放</span>
                <el-switch v-model="isPublic"></el-switch>
              </div>
              <div v-if="isPublic" class="pso-dd-public">
                <pso-title>对外配置</pso-title>
                <el-form ref="form" label-width="80px" label-position="left">
                  <el-form-item label="LOGO">
                    <pso-form-attach :cpnt="{data:publicCig.attach}">
                      <el-button icon="el-icon-paperclip" plain size="small">上传LOGO</el-button>
                    </pso-form-attach>
                  </el-form-item>
                  <el-form-item label="标题">
                    <el-input v-model="publicCig.name"></el-input>
                  </el-form-item>
                  <el-form-item label="提交文本">
                    <el-input v-model="publicCig.subBtnText"></el-input>
                  </el-form-item>
                  <el-form-item label="完成文本">
                    <el-input v-model="publicCig.doneText"></el-input>
                  </el-form-item>
                </el-form>
                <pso-title>表单链接</pso-title>
                http://tongjihbzx.pusiou.com.cn/m/form/{{curNode.node_name}}
                <pso-title>链接二维码</pso-title>
              </div>
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
import { formOp } from "../form-designer/mixin.js";
import PsoFieldAuth from "./field-auth";
import PsoNodeauth from "../node-auth";
import PsoTitle from "../title";
import PsoFormAttach from "../form-interpreter/components/attachment";

export default {
  mixins: [formOp],
  components: { PsoFormTable, PsoFieldAuth, PsoNodeauth, PsoTitle, PsoFormAttach },
  props: {
    appid: {
      type: String,
      default: "3"
    }
  },
  data() {
    return {
      key: 0,
      worksheetMenu: SHEET_MENU,
      showWorksheetSelector: false,
      curWsMenu: {},
      treeOptions: {
        dimen: 3
      },
      defaultNodeData: {
        node_dimen: 3
      },
      curNode: null,
      curTab: "preview",
      tableData: [],
      tableLoading: false,
      listCfgData: [],
      listCfgLoading: false,
      listCfgSaving: false,
      statusCfgData: [],
      isPublic: false,
      publicCig: {
        attach: {
          _fieldName: "附件",
          _val: ""
        },
        name: "",
        subBtnText: "",
        doneText: ""
      }
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
    async setSelect(data, tab = "preview") {
      this.curTab = tab;
      this.curNode = data;
      const formStore = await this.makeFormStore(this.curNode.node_name);
      await this.getFields(formStore);
      await this.getListTableData(formStore);
    },
    nodeClickHandler(data) {
      data.is_leaf && this.setSelect(data);
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
      this.tableLoading = true;
      let ret = await this.API.dict({ data: { data_code: this.curNode.node_name, app_id: this.appid } });
      if (!ret.success) return;
      this.tableLoading = false;
      this.tableData = ret.data;
      this.tableData.forEach(item => {
        const field = formStore.search({ options: { fid: item.field_name }, onlyData: true });
        item.field_display = field ? field._fieldName : "系统字段";
      });
    },
    async getListTableData(formStore) {
      this.listCfgLoading = true;
      const ret = await this.API.getFormDict({ data_code: this.curNode.node_name });
      if (!ret.success) return;
      this.listCfgLoading = false;
      this.listCfgData = ret.data;
      this.listCfgData.forEach(item => {
        const field = formStore.search({ options: { fid: item.field_name }, onlyData: true });
        item.display_name = item.display_name || (field ? field._fieldName : "");
      });
    },
    async saveConfig() {
      this.listCfgSaving = true;
      const ret = await this.API.updateFormTree({ ...this.curNode, display_columns: JSON.stringify(this.listCfgData) });
      this.listCfgSaving = false;
      this.$notify({ title: ret.success ? "保存成功" : "保存失败", type: ret.success ? "success" : "warning" });
    },
    addStatusCfgItem() {
      this.statusCfgData.push({ status_val: "", display_name: "" });
    }
  }
};
</script>

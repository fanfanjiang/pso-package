<template>
  <div class="pso-wf-wrapper">
    <div class="pso-wf" v-if="!wfDesigner.initializing" v-loading="wfDesigner.loading">
      <div class="pso-wf-header">
        <pso-header @back="$emit('back')" @save="saveWorkflow" title="流程设计">
          <div class="pso-wf-tab">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="流程配置" name="wf"></el-tab-pane>
              <el-tab-pane label="流程单据" name="page"></el-tab-pane>
            </el-tabs>
          </div>
          <template v-slot:btn>
            <el-popconfirm v-if="wfDesigner.node_id" title="你确定要发布吗？" @confirm="saveWorkflow('1')">
              <el-button slot="reference" type="primary" size="small">发布流程</el-button>
            </el-popconfirm>
            <el-button slot="reference" size="small" @click="saveWorkflow('0')">保存</el-button>
            <el-dropdown class="pso-wf__more" trigger="click" :hide-on-click="false" @command="handleCommand">
              <span class="el-dropdown-link">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="auth">添加权限项</el-dropdown-item>
                <el-dropdown-item command="saveTemp">保存为模板</el-dropdown-item>
                <el-dropdown-item command="updateTemp" v-if="wfDesigner.templateId">更新模板</el-dropdown-item>
                <el-dropdown-item>
                  <pso-picker-resource @confirm="handleTempSelection" source="table" :options="importTreeOption">
                    <el-button type="text">导入模板</el-button>
                  </pso-picker-resource>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </pso-header>
      </div>
      <wf-stage v-show="activeTab === 'wf'"></wf-stage>
      <div class="pso-wf-stage-wrapper" v-show="activeTab === 'page'">
        <div class="pso-wf-stage-body" v-bar>
          <div>
            <rich-designer
              ref="tableEditor"
              :reviews="reviewList"
              :options="options"
              :content="wfDesigner.tableContent"
              @save="saveHandler"
            ></rich-designer>
          </div>
        </div>
      </div>
      <pso-drawer
        size="100%"
        :modal="false"
        :visible="wfDesigner.nodePanelVisible"
        :title="panelName"
        :icon="panelIcon"
        :destroy="true"
        customclass="pso-wf-panel-drawer withoutmodel"
        @close="closePanel"
      >
        <wf-panel-el></wf-panel-el>
      </pso-drawer>
      <auth-editor :key="authEditorKey" :show="showAuthEditor" @cancel="showAuthEditor = false" @saved="savedAuth"></auth-editor>
      <el-dialog width="30%" title="保存模板" :visible.sync="showTempPop">
        <el-form size="mini" label-position="right">
          <el-form-item label="模板名称" label-width="80px">
            <el-input v-model="tempName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="保存位置" label-width="80px">
            <div class="tag-list" v-if="resource.list.length">
              <el-tag v-for="item in resource.list" :key="item.node_id" closable @close="handleDelSelection(item)">
                {{item.node_name}}
                </el-tag>
            </div>
            <pso-picker-tree
              rootable
              :filter="newTempFilter"
              :request-options="treeOptions"
              btn-text="选择文件夹"
              @confirm="handleAddSelection"
            ></pso-picker-tree>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="showTempPop = false">取 消</el-button>
          <el-button size="mini" type="primary" :loading="savingCfg" :disabled="savingCfg" @click="prepareTempData">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-else class="pso-wf-loading">
      <pso-skeleton :lines="10"></pso-skeleton>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { WF_NODE_PANEL_SET, WF_INIT, WF_CONDITION_MAKE, WF_SAVE, WF_RESET, WF_FORM_SELECT, WF_FIND_NODE } from "../../store/mutation-types";
import { genComponentData } from "../form-designer/helper/index.js";

import PsoHeader from "../header";

import WfStage from "./stage";

import WfPanelEl from "./panel-el";
import RichDesigner from "../rich-designer";

import FreeDrag from "../../mixin/free-drag";
import NodeType from "./node-type";
import AuthEditor from "../auth-editor";
import { pickerMixin } from "../../mixin/picker";
import shortid from "shortid";

export default {
  mixins: [pickerMixin({ baseObjName: "resource", dataListName: "list", typeName: "type", idName: "node_id" })],
  components: { AuthEditor, RichDesigner, WfStage, PsoHeader, WfPanelEl },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      activeTab: "wf",
      showAuthEditor: false,
      authEditorKey: 1,
      showTempPop: false,
      tempName: "",
      savingCfg: false,
      treeOptions: {
        dimen: 6,
        // data_type: "flowtp",
        // resource_type: this.params.resource_type || "public",
        // searchtype: "Resource"
      },
      importTreeOption: {
        dimen: 6,
        // data_type: "flowtp",
        // resource_type: this.params.resource_type || "public",
        // searchtype: "Resource"
      },
      resource: {
        list: [],
        type: "radio",
      },
    };
  },
  computed: {
    ...mapState(["wfDesigner"]),
    panelName() {
      return this.wfDesigner.selectedNode ? NodeType[this.wfDesigner.selectedNode.tid].name : "";
    },
    panelIcon() {
      return this.wfDesigner.selectedNode ? NodeType[this.wfDesigner.selectedNode.tid].icon : "";
    },
    reviewList() {
      const formStore = this.wfDesigner.formStore;
      if (formStore && formStore.search) {
        return this.$store.getters[WF_FIND_NODE]({ options: { tid: "review" } });
      }
      return [];
    },
    options() {
      const formStore = this.wfDesigner.formStore;
      let list = [];
      if (formStore && formStore.search) {
        const formRet = formStore.search({
          onlyData: true,
          onlyMain: true,
          options: { db: true },
          beforePush: (item) => {
            item.data.displayName = `[${item.CPNT.name}]${item.data._fieldName}`;
            return true;
          },
        });
        list = list.concat(formRet);
      }

      //添加系统字段
      list = list.concat([
        genComponentData({ _fieldValue: "wf_ctime", _fieldName: "[系统]创建时间", componentid: "time" }),
        genComponentData({ _fieldValue: "wf_creator", _fieldName: "[系统]创建人", componentid: "text" }),
        genComponentData({ _fieldValue: "wf_fileCode", _fieldName: "[系统]流程编号", componentid: "text" }),
        genComponentData({ _fieldValue: "wf_import", _fieldName: "[系统]重要等级", componentid: "text" }),
        genComponentData({ _fieldValue: "wf_secret", _fieldName: "[系统]秘密等级", componentid: "text" }),
        genComponentData({ _fieldValue: "wf_urgent", _fieldName: "[系统]加急程度", componentid: "text" }),
        genComponentData({ _fieldValue: "wf_logs", _fieldName: "[系统]审批过程", componentid: "text" }),
      ]);

      this.reviewList.forEach(({ target }) => {
        list.push(genComponentData({ _fieldValue: target.nid, _fieldName: `[审核意见]${target.name}`, componentid: "text" }));
      });

      return list;
    },
  },
  created() {
    this.$store.dispatch(WF_INIT, this.params);
  },
  watch: {
    activeTab(tab) {
      if (tab === "page") {
        this.wfDesigner.nodePanelVisible = false;
        this.wfDesigner.selectedNode = null;
      }
    },
  },
  destroyed() {
    this.$store.commit(WF_RESET);
  },
  methods: {
    ...mapMutations([WF_NODE_PANEL_SET]),
    closePanel() {
      this[WF_NODE_PANEL_SET](false);
    },
    async saveWorkflow(is_pub = "0") {
      const data = await this.prepareData();
      if (!data) return;

      data.is_pub = is_pub;

      this.wfDesigner.loading = true;
      const ret = await this.API.workflowcfg({ data, method: data.node_id ? "put" : "post" });

      if (ret.success) {
        //如果是新增，则新增后将数据替换
        if (!data.node_id) {
          const { node_id, node_name } = ret.data;
          this.wfDesigner.node_id = node_id;
          this.wfDesigner.wfCode = node_name;
          this.wfDesigner.pid = "";
        }

        this.$notify({ title: "保存成功", type: "success" });
      }
      this.wfDesigner.loading = false;
    },
    savedAuth(data) {
      this.authEditorKey++;
      this.showAuthEditor = false;
      this.wfDesigner.permissionEntries.push(data);
    },
    async handleCommand(command) {
      if (command === "auth") {
        this.showAuthEditor = true;
      } else if (command === "saveTemp") {
        this.tempName = this.tempName || this.wfDesigner.wfName;
        this.showTempPop = true;
      } else if (command === "updateTemp") {
        this.tempSaveHandler({ leaf_id: this.wfDesigner.templateId });
      }
    },
    async prepareData() {
      try {
        this.$store.commit(WF_CONDITION_MAKE);
        const data = await this.$store.dispatch(WF_SAVE);
        data.wf_body_tp = this.$refs.tableEditor.exportHtml();
        return data;
      } catch (error) {
        this.$message({ message: error.message, type: "warning" });
        return;
      }
    },
    prepareTempData() {
      if (!this.resource.list.length) {
        return this.$message({ message: "请选择文件夹", type: "warning" });
      }
      this.tempSaveHandler({ node_id: this.resource.list[0].node_id, r_name: this.tempName });
    },
    async tempSaveHandler(data) {
      data.r_name = data.r_name || this.wfDesigner.wfName;
      if (!data.r_name) {
        return this.$message({ message: "请输入模板名称", type: "warning" });
      }

      const r_data = await this.prepareData();
      if (!r_data) return;
      delete r_data.pid;
      delete r_data.node_id;
      delete r_data.wf_code;

      data.map_key = data.map_key || shortid.generate();

      this.savingCfg = true;
      const ret = await this.API.resource({ data: { ...data, r_data }, method: data.leaf_id ? "put" : "post" });
      if (ret.success) this.$notify({ title: "保存成功", type: "success" });
      this.savingCfg = false;
      this.showTempPop = false;
    },
    async handleTempSelection(data) {
      if (!data.length) return;
      this.$store.dispatch(WF_INIT, { templateId: data[0].leaf_id, node_id: this.wfDesigner.node_id, pid: this.wfDesigner.pid });
    },
    newTempFilter(nodes) {
      return nodes.filter((node) => node.is_leaf);
    },
    async saveHandler(wf_body_tp) {
      const ret = await this.API.updateWfTable({ wf_code: this.wfDesigner.wfCode, wf_body_tp });
      this.ResultNotify(ret);
    },
  },
};
</script>
<style lang="less">
@import "../../assets/less/component/wf-designer.less";
</style>
<style lang="less" scoped>
@import "../../assets/less/variable";
.tag-list {
  margin-bottom: 5px;
}
.pso-wf-loading {
  padding: 20px;
}
.pso-wf-header {
  @{deep} {
    .el-button {
      margin-left: 10px;
    }
  }
}
@{deep} {
  .el-tabs__header {
    margin: 0;
  }

  .el-tabs__nav-wrap {
    &::after {
      background-color: #fff;
    }
    div {
      box-shadow: none !important;
    }
  }
  .pso-wf__more {
    margin-left: 10px;
    .el-dropdown-link {
      cursor: pointer;
      color: #fd8647;
    }
  }
}
</style>
<template>
  <div class="pso-page">
    <div class="pso-page-body">
      <div class="pso-page__tree">
        <pso-tree-common
          ref="tree"
          :request-options="treeOptions"
          :default-node-data="defaultNodeData"
          :auto-edit="true"
          @node-click="nodeClickHandler"
          @before-edit-submit="beforeNodeUpdate"
        >
          <template v-slot:default="nodeData">
            <div v-if="nodeData.node.is_leaf">
              <el-form-item label="插件类型">
                <el-select size="small" v-model="tpType">
                  <el-option v-for="item in tpTypes" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </template>
        </pso-tree-common>
      </div>
      <div class="pso-page-body__content">
        <div class="pso-page-body__wrapper" v-if="curNode" v-loading="loading">
          <div class="pso-page-body__header">
            <pso-title>插件：{{ curNode.node_display }}</pso-title>
            <div class="pso-page-body__btns">
              <el-button size="small" type="primary" plain @click="saveTp">保存设置</el-button>
              <el-button v-if="curNode.tp_type === 2 || curNode.tp_type === 3" size="small" type="primary" plain @click="editTp"
                >编辑模板</el-button
              >
            </div>
          </div>
          <div class="pso-page-body__tab">
            <el-tabs v-model="curTab">
              <template v-if="!!curNode.is_leaf">
                <el-tab-pane label="属性" name="base"></el-tab-pane>
                <el-tab-pane label="参数" name="param"></el-tab-pane>
                <el-tab-pane label="初始文本" name="textdef"></el-tab-pane>
                <el-tab-pane label="文本" name="text"></el-tab-pane>
                <el-tab-pane v-if="curNode.tp_type === 1" label="列表" name="column"></el-tab-pane>
                <el-tab-pane v-if="curNode.tp_type === 5" label="设计" name="cms"></el-tab-pane>
              </template>
              <el-tab-pane label="权限" name="auth"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="pso-page-body__tabbody" v-if="!loading">
            <template v-if="!!curNode.is_leaf">
              <pso-tp-base v-if="curTab === 'base'" :node="curNode" :params="params"></pso-tp-base>
              <pso-tp-param v-if="curTab === 'param'" :data="paramData"></pso-tp-param>
              <pso-tp-column v-if="curTab === 'column'" :data="columnData" :header="tpHeader" @save="saveTp"></pso-tp-column>
              <pso-tp-textdef v-if="curTab === 'textdef'" :data="tpButtons"></pso-tp-textdef>
              <pso-tp-text v-if="curTab === 'text'" :data="tpText" :def-text="tpButtons"></pso-tp-text>
              <cms-designer v-if="curTab === 'cms'" :layout="columnData"></cms-designer>
            </template>
            <pso-nodeauth v-if="curTab === 'auth'" :node="curNode"></pso-nodeauth>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PsoNodeauth from "../node-auth";
import PsoTpBase from "./base";
import PsoTpParam from "./param";
import PsoTpColumn from "./column";
import PsoTpText from "./text";
import PsoTpTextdef from "./text-def";
import { TP_TYPES, STATIC_COLUMN_FIELDS } from "../../const/sys";
import { formatJSONList } from "../../utils/util";
import CmsDesigner from "../cms-designer";

const _DATA = {
  columnData: [],
  paramData: [],
  tpText: [],
  tpButtons: [],
  tpHeader: [],
};

export default {
  components: { PsoNodeauth, PsoTpBase, PsoTpParam, PsoTpColumn, PsoTpText, PsoTpTextdef, CmsDesigner },
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
      loading: false,
      curNode: null,
      curTab: "base",
      tpType: "",
      tpTypes: TP_TYPES,
      ..._DATA,
    };
  },
  computed: {
    treeOptions() {
      return {
        dimen: 4,
        data_type: this.params.data_type,
      };
    },
    defaultNodeData() {
      return {
        node_dimen: 4,
      };
    },
  },
  methods: {
    reset() {
      Object.assign(this.$data, _.cloneDeep(_DATA));
      this.curTab = "base";
    },
    async nodeClickHandler(nodeData) {
      this.reset();
      this.loading = true;
      this.curNode = nodeData;
      if (nodeData.is_leaf) {
        const ret = await this.API.getTreeNode({ code: nodeData.node_name });
        if (ret.success) {
          const cfg = ret.data.data;
          for (let key in cfg) {
            this.$set(this.curNode, key, cfg[key]);
          }

          if (this.curNode.route_setting) {
            this.paramData = JSON.parse(this.curNode.route_setting);
          }

          if (this.curNode.tp_content) {
            if (this.curNode.tp_type === 2) {
              this.columnData = formatJSONList(this.curNode.tp_content, STATIC_COLUMN_FIELDS);
            } else {
              this.columnData = JSON.parse(this.curNode.tp_content);
            }
          }

          if (cfg.tp_head) {
            this.tpHeader = JSON.parse(cfg.tp_head);
            if (!Array.isArray(this.tpHeader)) {
              this.tpHeader = [];
            }
          } else {
            this.tpHeader = [];
          }

          if (cfg.tp_buttons) {
            this.tpButtons = JSON.parse(cfg.tp_buttons);
          }

          if (cfg.tp_text) {
            const text = JSON.parse(cfg.tp_text);

            text.forEach((item) => {
              let subList = [];
              for (let i = 0; i < this.tpButtons.length; i++) {
                const exist = _.find(item.list, { id: this.tpButtons[i].id }) || this.tpButtons[i];
                subList.push({ ...this.tpButtons[i], value: exist.value || exist.name });
              }
              this.tpText.push({ list: subList, id: item.id, name: item.name });
            });
          }
        }
      } else {
        this.curTab = "auth";
      }
      this.loading = false;
    },
    async saveTp() {
      this.loading = true;
      const ret = await this.API.templates({
        data: {
          ...this.curNode,
          tp_code: this.curNode.node_name,
          route_setting: JSON.stringify(this.paramData),
          tp_content: JSON.stringify(this.columnData),
          tp_text: JSON.stringify(this.tpText),
          tp_buttons: JSON.stringify(this.tpButtons),
          tp_head: JSON.stringify(this.tpHeader),
        },
        method: "put",
      });
      this.ResultNotify(ret);
      this.loading = false;
    },
    beforeNodeUpdate(data) {
      if (data.is_leaf) {
        data.tp_type = this.tpType;
        data.tp_head = "";
        data.tp_route = TP_TYPES[this.tpType].router || "";
      }
    },
    editTp() {
      this.$emit("edit-tp", { node: this.curNode });
    },
  },
};
</script>
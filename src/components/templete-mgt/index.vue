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
                  <el-option
                    v-for="item in tpTypes"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </template>
        </pso-tree-common>
      </div>
      <div class="pso-page-body__content">
        <div class="pso-page-body__wrapper" v-if="curNode" v-loading="loading">
          <div class="pso-page-body__header">
            <pso-title>插件：{{curNode.node_display}}</pso-title>
            <div class="pso-page-body__btns">
              <el-button size="small" type="primary" plain @click="saveTp">保存设置</el-button>
            </div>
          </div>
          <div class="pso-page-body__tab">
            <el-tabs v-model="curTab">
              <template v-if="!!curNode.is_leaf">
                <el-tab-pane label="属性" name="base"></el-tab-pane>
                <el-tab-pane label="参数" name="param"></el-tab-pane>
                <el-tab-pane v-if="curNode.tp_type===1" label="列表" name="column"></el-tab-pane>
              </template>
              <el-tab-pane label="权限" name="auth"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="pso-page-body__tabbody">
            <template v-if="!!curNode.is_leaf">
              <pso-tp-base v-if="curTab==='base'" :node="curNode"></pso-tp-base>
              <pso-tp-param v-if="curTab==='param'" :data="paramData"></pso-tp-param>
              <pso-tp-column v-if="curTab==='column'" :data="columnData"></pso-tp-column>
            </template>
            <pso-nodeauth v-if="curTab==='auth'" :node="curNode"></pso-nodeauth>
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

export default {
  components: { PsoNodeauth, PsoTpBase, PsoTpParam, PsoTpColumn },
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
      curNode: null,
      curTab: "base",
      columnData: [],
      paramData: [],
      tpType: "",
      tpTypes: [
        {
          name: "页面插件",
          value: 0
        },
        {
          name: "统计插件",
          value: 1
        }
      ]
    };
  },
  computed: {
    treeOptions() {
      return {
        dimen: 4,
        data_type: this.params.data_type
      };
    },
    defaultNodeData() {
      return {
        node_dimen: 4
      };
    }
  },
  methods: {
    async nodeClickHandler(nodeData) {
      this.loading = true;
      this.curNode = nodeData;
      if (nodeData.is_leaf) {
        const ret = await this.API.templates({ data: { tp_code: nodeData.node_name }, method: "get" });
        if (ret.success) {
          for (let key in ret.data.tp) {
            this.$set(this.curNode, key, ret.data.tp[key]);
          }

          if (this.curNode.route_setting) {
            this.paramData = JSON.parse(this.curNode.route_setting);
          } else {
            this.paramData = [];
          }

          if (this.curNode.tp_content) {
            this.columnData = JSON.parse(this.curNode.tp_content);
          } else {
            this.columnData = [];
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
          tp_content: JSON.stringify(this.columnData)
        },
        method: "put"
      });
      this.$notify({ title: ret.success ? "保存成功" : "保存失败", type: ret.success ? "success" : "warning" });
      this.loading = false;
    },
    beforeNodeUpdate(data) {
      if (data.is_leaf) {
        data.tp_type = this.tpType;
      }
    }
  }
};
</script>
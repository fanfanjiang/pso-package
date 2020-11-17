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
        ></pso-tree-common>
      </div>
      <div class="pso-page-body__content">
        <div class="pso-page-body__wrapper" v-if="curNode" v-loading="loading">
          <div class="pso-page-body__header" v-if="params.mgtable==='1'">
            <pso-title>资源分类：{{curNode.node_display}}</pso-title>
            <div class="pso-page-body__btns">
              <el-button size="small" type="primary" plain @click="saveTp">保存设置</el-button>
            </div>
          </div>
          <div class="pso-page-body__tab" v-if="params.mgtable==='1'">
            <el-tabs v-model="curTab">
              <template v-if="!!curNode.is_leaf">
                <el-tab-pane label="资源" name="base"></el-tab-pane>
                <el-tab-pane v-if="curNode.tp_type===1" label="列表" name="column"></el-tab-pane>
              </template>
              <el-tab-pane label="权限" name="auth"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="pso-page-body__tabbody">
            <template v-if="!!curNode.is_leaf">
              <pso-knowl-table
                v-if="curTab==='base'"
                :node="curNode"
                :view-auth="params.viewAuth"
                :def-keys="params.defKeys"
                @go="$emit('go',$event)"
              ></pso-knowl-table>
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
import PsoKnowlTable from "./table";

export default {
  components: { PsoNodeauth, PsoKnowlTable },
  props: {
    params: {
      type: Object,
      default: () => ({ data_type: "", viewAuth: 0, mgtable: "0" })
    }
  },
  data() {
    return {
      loading: false,
      curNode: null,
      curTab: "base"
    };
  },
  computed: {
    treeOptions() {
      return {
        dimen: 6,
        data_type: this.params.data_type
      };
    },
    defaultNodeData() {
      return {
        node_dimen: 6
      };
    }
  },
  methods: {
    async nodeClickHandler(nodeData) {
      this.loading = true;
      this.curNode = nodeData;
      if (nodeData.is_leaf) {
      } else {
        this.curTab = "auth";
      }
      this.loading = false;
    },
    async saveTp() {}
  }
};
</script>
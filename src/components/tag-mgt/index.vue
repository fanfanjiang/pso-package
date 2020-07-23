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
        >
          <template v-slot:default="nodeData">
            <slot v-bind:data="nodeData"></slot>
          </template> 
        </pso-tree-common>
      </div>
      <div class="pso-page-body__content">
        <div class="pso-page-body__wrapper" v-if="curNode" v-loading="loading">
          <div class="pso-page-body__header">
            <pso-title>标签分类：{{curNode.node_display}}</pso-title>
          </div>
          <div class="pso-page-body__tab">
            <el-tabs v-model="curTab">
              <template v-if="!!curNode.is_leaf">
                <el-tab-pane label="标签" name="tag"></el-tab-pane>
              </template>
              <el-tab-pane label="权限" name="auth"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="pso-page-body__tabbody">
            <template v-if="!!curNode.is_leaf">
              <pso-tag-item v-if="curTab==='tag'" :node="curNode"></pso-tag-item>
            </template>
            <pso-nodeauth v-if="curTab==='auth'" :node="curNode" :leaf-authcfg="leafAuthcfg"></pso-nodeauth>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PsoTagItem from "./tag-item";
import PsoNodeauth from "../node-auth";
import { MENU_LEAF_AUTH } from "../../const/menu";

export default {
  components: { PsoTagItem, PsoNodeauth },
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
      curNode: {},
      curTab: "tag",
      leafAuthcfg: MENU_LEAF_AUTH
    };
  },
  computed: {
    treeOptions() {
      return {
        dimen: 5,
        data_type: this.params.data_type
      };
    },
    defaultNodeData() {
      return {
        node_dimen: 5
      };
    }
  },
  methods: {
    async nodeClickHandler(node) {
      if (!node.is_leaf) {
        this.curTab = "auth";
      }
      this.curNode = node;
    }
  }
};
</script>
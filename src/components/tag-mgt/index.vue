<template>
  <div :class="viewClass">
    <div class="pso-view-extend">
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
    <div class="pso-view-body" v-loading="loading">
      <template v-if="curNode">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-document"></i>
              <span>标签分类：{{ curNode.node_display }}</span>
            </div>
          </div>
        </div>
        <div class="pso-view-viewtab">
          <el-tabs v-model="curTab">
            <template v-if="!!curNode.is_leaf">
              <el-tab-pane label="标签" name="tag"></el-tab-pane>
            </template>
            <el-tab-pane label="权限" name="auth"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="pso-view-table">
          <template v-if="!!curNode.is_leaf">
            <pso-tag-item v-if="curTab === 'tag'" :node="curNode"></pso-tag-item>
          </template>
          <pso-nodeauth v-if="curTab === 'auth'" :node="curNode" :leaf-authcfg="leafAuthcfg"></pso-nodeauth>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import PsoTagItem from "./tag-item";
import PsoNodeauth from "../node-auth";
import { MENU_LEAF_AUTH } from "../../const/menu";
import { MgtMixin } from "../../mixin/view";

export default {
  components: { PsoTagItem, PsoNodeauth },
  mixins: [MgtMixin],
  props: {
    params: {
      type: Object,
      default: () => ({ data_type: "" }),
    },
  },
  data() {
    return {
      loading: false,
      curNode: {},
      curTab: "tag",
      leafAuthcfg: MENU_LEAF_AUTH,
    };
  },
  computed: {
    treeOptions() {
      return {
        dimen: 5,
        data_type: this.params.data_type,
      };
    },
    defaultNodeData() {
      return {
        node_dimen: 5,
      };
    },
  },
  methods: {
    async nodeClickHandler(node) {
      if (!node.is_leaf) {
        this.curTab = "auth";
      }
      this.curNode = node;
    },
  },
};
</script>
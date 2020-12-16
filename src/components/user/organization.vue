<template>
  <div class="pso-view-user" :class="viewClass">
    <div class="pso-view-extend" v-loading="initializing">
      <pso-tree-common
        ref="tree"
        :request-options="treeOptions"
        :default-node-data="defaultNodeData"
        @node-click="nodeClickHandler"
      ></pso-tree-common>
    </div>
    <div class="pso-view-body" v-loading="initializing">
      <template v-if="curNode">
        <div class="pso-view-mgt-tabs">
          <button-tabs v-model="curTab" :data="TABS"></button-tabs>
        </div>
        <div class="pso-view-table">
          <users v-if="curTab === 0" user-rel="0" :node-id="curNode.node_id"></users>
          <post-mgt v-if="curTab === 1" :node-id="curNode.node_id"></post-mgt>
          <users v-if="curTab === 2" user-rel="91" fun-type="OfficeUserPage"></users>
          <node-auth v-if="curTab === 3" key="form" type="form" :bind-id="curNode.node_id" bind-type="1"></node-auth>
          <node-auth v-if="curTab === 4" key="wf" type="wf" :bind-id="curNode.node_id" bind-type="1"></node-auth>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { MgtMixin } from "../../mixin/view";
import ButtonTabs from "../button-tabs";
import Users from "./users";
import NodeAuth from "./auth";
import PostMgt from "./post-mgt";

const TABS = [{ label: "职员" }, { label: "岗位" }, { label: "未分配" }, { label: "表单权限" }, { label: "流程权限" }];

export default {
  components: { ButtonTabs, Users, NodeAuth, PostMgt },
  mixins: [MgtMixin],
  data() {
    this.TABS = TABS;
    return {
      initializing: false,
      showEditor: false,
      curNode: null,
      curTab: 0,
      nodes: [],
      optype: "",
      data: {
        type_name: "",
        user_type: "",
      },
    };
  },
  computed: {
    treeOptions() {
      return {
        dimen: 2,
      };
    },
    defaultNodeData() {
      return {
        node_dimen: 2,
      };
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      this.initializing = true;
      const ret = await this.API.getUserType();
      this.nodes = ret.data;
      if (this.nodes.length) {
        this.curNode = this.nodes[0].user_type;
      }
      this.initializing = false;
    },
    async nodeClickHandler(node) {
      if (node.is_leaf) {
        this.curNode = node;
      }
    },
  },
};
</script>
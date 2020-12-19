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
          <users v-if="curTab === 2 || curTab === 0" ref="users" v-bind="userOptions" @adduser="bindHandler">
            <template slot="fun" slot-scope="{ selected }">
              <template v-if="curTab === 0">
                <pso-picker-user pattern="checkbox" @confirm="bindHandler">
                  <el-button size="mini" type="primary">绑定或转移</el-button>
                </pso-picker-user>
              </template>
              <el-button v-else size="mini" type="primary" :disabled="!selected.length" @click="bindHandler(selected)">绑定</el-button>
            </template>
          </users>
          <post-mgt v-if="curTab === 1" :node-id="curNode.node_id"></post-mgt>
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
import NodeAuth from "../common-auth";
import PostMgt from "./post-mgt";

const TABS = [{ label: "职员" }, { label: "岗位" }, { label: "未分配" }, { label: "表单权限" }, { label: "流程权限" }];

export default {
  components: { ButtonTabs, Users, NodeAuth, PostMgt },
  mixins: [MgtMixin],
  data() {
    this.TABS = TABS;
    return {
      initializing: false,
      operating: false,
      curNode: null,
      curTab: 0,
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
    userOptions() {
      const options = {};
      if (this.curTab === 0) {
        options.userRel = "0";
        options.nodeId = this.curNode.node_id;
      } else {
        options.userRel = "91";
        options.funType = "OfficeUserPage";
      }
      return options;
    },
  },
  methods: {
    async nodeClickHandler(node) {
      if (node.is_leaf) {
        this.curNode = node;
      }
    },
    async bindHandler(data) {
      if (!this.curNode || !data.length) return;
      const ret = await this.API.bindUser({ user_rel: "0", node_id: this.curNode.node_id, users: data.map((d) => d.user_id).join(",") });
      this.ResultNotify(ret);
      this.$refs.users.fetch();
    },
  },
};
</script>
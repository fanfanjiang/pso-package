<template>
  <div :class="viewClass">
    <div class="pso-view-extend">
      <pso-tree-common
        ref="tree"
        :request-options="treeOptions"
        :default-node-data="defaultNodeData"
        :auto-edit="true"
        @node-click="nodeClickHandler"
        @after-node-new="checkRefresh"
        @node-to-trash="checkRefresh"
      ></pso-tree-common>
    </div>
    <div class="pso-view-body">
      <template v-if="curNode">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-user-solid"></i>
              <span>组织：{{ curNode.node_display }}</span>
            </div>
          </div>
          <div class="pso-view-header__r"></div>
        </div>
        <div class="pso-view-viewtab">
          <button-tabs v-model="curTab" :data="TABS"></button-tabs>
        </div>
        <div class="pso-view-table">
          <user-view v-if="curTab === 0" ref="users" v-bind="userOptions" @adduser="bindHandler">
            <template slot="fun" slot-scope="{ selected }">
              <template v-if="curTab === 0">
                <pso-picker-user pattern="checkbox" @confirm="bindHandler">
                  <el-button size="mini" type="primary">绑定职员</el-button>
                </pso-picker-user>
              </template>
              <el-button v-else size="mini" type="primary" :disabled="!selected.length" @click="bindHandler(selected)">绑定</el-button>
            </template>
          </user-view>
          <post-mgt v-if="curTab === 1" :node-id="curNode.node_id"></post-mgt>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { MgtMixin } from "../../mixin/view";
import ButtonTabs from "../button-tabs";
import UserView from "./user-view";
import PostMgt from "./post-mgt";
const TABS = [{ label: "职员" }, { label: "岗位" }, { label: "架构图" }];

export default {
  components: { ButtonTabs, UserView, PostMgt },
  mixins: [MgtMixin],
  props: {
    nodeid: String,
  },
  data() {
    this.TABS = TABS;
    return {
      curNode: null,
      curTab: 0,
    };
  },
  computed: {
    treeOptions() {
      return { dimen: 2, data_type: "sysorgan", node_id: this.nodeid };
    },
    defaultNodeData() {
      return { node_dimen: 2 };
    },
    userOptions() { 
      const options = { defopable: true };
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
    nodeClickHandler(data) {
      if (data.is_leaf) {
        this.curNode = data;
      }
    },
    checkRefresh(data) {
      if (data.node_pid === 0) {
        this.$emit("refresh");
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
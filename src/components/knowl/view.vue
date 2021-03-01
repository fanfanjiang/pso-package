<template>
  <div :class="viewClass">
    <div class="pso-view-extend" v-if="treeable">
      <pso-tree-common
        ref="tree"
        :rootable="true"
        :edit-mode="false"
        :request-options="treeOptions"
        @node-click="nodeClickHandler"
      ></pso-tree-common>
    </div>
    <div class="pso-view-body">
      <div class="pso-view-header">
        <div class="pso-view-header__r" v-show="authViews.length">
          <div class="pso-view-authtab">
            <el-tabs v-model="activeView">
              <el-tab-pane v-for="(ah, i) in authViews" :key="i" :label="ah.n" :name="ah.v + ''"></el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <div class="pso-view-sorttag" v-if="curNode && mgtable">
        <el-tabs v-model="curTab">
          <el-tab-pane v-if="!!curNode.is_leaf" label="资源" name="data"></el-tab-pane>
          <el-tab-pane label="权限" name="auth"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="pso-view-fun">
        <div class="pso-view-fun-l">
          <div class="view-table-fun">
            <pso-search text="搜索" v-model="fetchParams.keywords"></pso-search>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" icon="el-icon-refresh" @click="fetch">刷新</el-button>
          </div>
        </div>
        <div class="pso-view-fun-r" v-if="opable">
          <div class="view-data-fun">
            <el-button type="primary" size="mini" @click="addHandler">新增</el-button>
            <el-button type="danger" size="mini" :disabled="selected.length !== 1" @click="delHandler">删除</el-button>
            <el-button v-if="selectable" type="primary" size="mini" @click="selectHandler">选择</el-button>
            <pso-picker-user pattern="radio" @confirm="share($event)">
              <el-button size="mini" type="warning" :disabled="selected.length !== 1">转发</el-button>
            </pso-picker-user>
          </div>
        </div>
      </div>
      <div class="pso-view-table" style="height: calc(100% - 50px)">
        <div class="pso-view-table__body" ref="tableRef" v-if="curTab === 'data'">
          <knowl-table
            ref="table"
            :fetching="fetching"
            :opable="opable"
            :instances="instances"
            @row-click="rowClickHandler"
            @selection-change="changeHandler"
            @collect="collect"
          ></knowl-table>
          <div class="pso-view-table__footer">
            <el-pagination
              :small="true"
              layout=" prev, next"
              :total="dataTotal"
              :page-sizes="[20, 30, 50, 100]"
              :page-size="fetchParams.limit"
              :current-page="fetchParams.start"
              @size-change="sizeChangeHandler"
              @current-change="currentChangeHandler"
              @prev-click="prevClickHandler"
              @next-click="nextClickHandler"
            ></el-pagination>
          </div>
        </div>
        <pso-nodeauth v-if="curTab === 'auth' && curNode" :node="curNode"></pso-nodeauth>
      </div>
    </div>
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>资源</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <el-form label-width="80px" v-if="showEditor">
          <el-form-item label="资源名称" required>
            <el-input size="mini" :clearable="true" v-model="curInstance.r_name"></el-input>
          </el-form-item>
          <pso-form-attach ref="attach" :cpnt="attach">
            <el-button size="mini"><i class="el-icon-paperclip el-icon--left"></i>上传</el-button>
          </pso-form-attach>
        </el-form>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import PsoNodeauth from "../node-auth";
import KnowlTable from "./table";
import { PagingMixin, AuthViewMixin } from "../../mixin/view";
import { Attach } from "../../mixin/form";
const DATA = {
  r_name: "",
  map_key: "",
};

export default {
  mixins: [PagingMixin, AuthViewMixin, Attach],
  components: { PsoNodeauth, KnowlTable },
  props: {
    data_type: {
      type: String,
    },
    treeable: {
      type: Boolean,
      default: true,
    },
    opable: {
      type: Boolean,
      default: true,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    searchType: {
      type: String,
      default: "",
    },
    selectionType: {
      type: String,
      default: "checkbox",
    },
    mgtable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showFilter: this.treeable,
      expandWider: false,
      fetching: false,
      dataTotal: 0,
      noding: false,
      curNode: null,
      instances: [],
      selected: [],
      showEditor: false,
      curInstance: { ...DATA },
      watchFun: [],
      curTab: "data",
    };
  },
  computed: {
    treeOptions() {
      return {
        dimen: 6,
        data_type: this.data_type,
      };
    },
    viewClass() {
      return {
        "pso-view__expand": this.showFilter,
        "pso-view__expand-wider": this.expandWider,
        "pso-view-mgt": true,
        "pso-view": true,
      };
    },
  },
  watch: {
    searchType() {
      this.switchPatten();
    },
  },
  async created() {
    this.fetchParams.limit = 10;
    this.startWatch();
    this.$on("load", () => {
      this.fetch();
    });
    if (!this.treeable) {
      await this.fetch();
    }
  },
  methods: {
    async nodeClickHandler(node) {
      this.noding = true;
      this.curNode = node;
      this.authViews = [];
      this.analyzeAuthView(parseInt(node.leaf_auth || 0));
      if (!this.opable) {
        this.authViews = [];
      }
      this.noding = false;
      await this.fetch();
      this.resetAuth();
      this.watchAuth();
    },
    switchPatten() {
      this.showFilter = this.treeable;
      this.resetAuth();
      if (!this.treeable) {
        this.instances = [];
        this.authViews = [];
        this.activeView = "4";
        this.curNode = null;
        this.fetch();
      } else {
        this.watchAuth();
      }
    },
    resetAuth() {
      this.watchFun.forEach((f) => f());
      this.watchFun = [];
    },
    watchAuth() {
      this.watchFun.push(
        this.$watch("activeView", () => {
          this.fetch();
        })
      );
    },
    async fetch() {
      this.fetching = true;

      const params = this.getFetchParams("r_name", this.curNode ? { node_id: { type: 1, value: this.curNode.node_id } } : {});
      params.page = params.start;
      params.leaf_auth = this.activeView;
      if (this.searchType) params.search_type = this.searchType;

      const ret = await this.API.resource({ data: params });
      if (ret.success) {
        this.instances = ret.data;
        this.dataTotal = ret.count;
      }
      this.fetching = false;
    },
    rowClickHandler(data) {
      if (!this.opable) return;
      this.curInstance = data;
      this.createCpnt(data.map_key, "附件");
      this.showEditor = true;
    },
    changeHandler(data) {
      if (this.selectionType === "radio" && data.length > 1) {
        this.$refs.table.$refs.table.clearSelection();
        this.$refs.table.$refs.table.toggleRowSelection(data[data.length - 1], true);
        data = [data[data.length - 1]];
      }
      this.selected = data;
      this.$emit("select", this.selected);
    },
    addHandler() {
      this.curInstance = { ...DATA };
      this.createCpnt("", "附件");
      this.showEditor = true;
    },
    delHandler() {
      if (!this.selected.length) return;
      this.saveHandler({ ...this.selected[0], optype: 2 });
    },
    async saveHandler(params) {
      if (this.editing) return;
      this.editing = true;
      let data = {};
      const { leaf_id } = params || this.curInstance;
      if (params) {
        data = params;
      } else {
        data = { ...this.curInstance, optype: leaf_id ? 1 : 0 };
        if (!leaf_id) {
          data.node_id = this.curNode.node_id;
        }
      }
      const ret = await this.API.resource({ data, method: leaf_id ? "put" : "post" });
      this.ResultNotify(ret);
      this.showEditor = false;
      this.fetch();
      this.editing = false;
    },
    share(users) {
      if (!this.selected.length || !users.length) return;
      const { leaf_id, map_key: res_id } = this.selected[0];
      this.saveHandler({ leaf_id, res_id, res_user: users[0].user_id, optype: 1, extendop: true });
    },
    collect(data) {
      const { map_key: res_id, auto_no } = data;
      this.$set(data, "collecting", true);
      this.saveHandler({ ...data, res_id, optype: auto_no ? 2 : 0, extendop: true });
      data.collecting = false;
    },
  },
};
</script>
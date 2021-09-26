<template>
  <div class="Lay-setting">
    <div class="header">
      <el-tabs v-model="curTab">
        <el-tab-pane label="自定义维度" name="custom"></el-tab-pane>
        <el-tab-pane label="扩展维度" name="extend"></el-tab-pane>
        <el-tab-pane label="系统维度" name="sys"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="body">
      <div style="padding: 0">
        <pso-common-view
          ref="view"
          title="维度配置"
          icon="el-icon-cpu"
          :fetch-fun="fetch"
          :fields="FIELDS"
          :slots="SLOTS"
          @dbclick="dbClickHandler"
        >
          <template #datafun>
            <el-button :disabled="selected.length !== 1" type="danger" size="mini" @click="onRemove">删除</el-button>
            <el-button type="primary" size="mini" @click="addHandler">新增</el-button>
          </template>
          <template v-slot:op="{ data }">
            <el-button v-if="data.row.node_dimen == '5'" plain type="primary" size="mini" @click="onShowTree(data.row)">
              查看维度树
            </el-button>
          </template>
        </pso-common-view>
      </div>
    </div>
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>维度编辑</span>
          </template>
          <template #action>
            <el-button type="primary" size="small" @click="saveHandler()" :disabled="editing" :loading="editing">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content" v-if="curInstance">
        <el-form label-width="100px">
          <el-form-item label="维度标签名">
            <el-input size="small" v-model="curInstance.tag_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="维度" v-if="!curInstance.dimen_tag">
            <el-select size="small" v-model="curInstance.node_dimen">
              <el-option v-for="item in DIMEN_TYPE" :key="item.n" :label="item.n" :value="item.v"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="pso-table-controller">
          <el-button size="small" type="primary" plain @click="onAddItem">添加扩展配置</el-button>
        </div>
        <el-table key="status" size="mini" border :data="proxy" style="width: 100%">
          <el-table-column label="扩展字段" width="160">
            <template slot-scope="scope">
              <el-select size="mini" v-model="scope.row.value">
                <el-option label="node_ext1" value="node_ext1"></el-option>
                <el-option label="node_ext2" value="node_ext2"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="显示名称">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.name"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="启用" width="100" align="center">
            <template slot-scope="scope">
              <el-switch size="mini" v-model="scope.row.enable"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="onRemoveItem(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </pso-dialog>
    <pso-dialog :visible="showTree" width="80%" @close="showTree = false">
      <div class="pso-dialog-content">
        <menu-view v-bind="options" :nodefun="nodefun" tagmode></menu-view>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { FetchMixin } from "../../mixin/view";
import { DIMEN_TYPE } from "../../const/tree.js";
import MenuView from "../menu-mgt/menu-view";

const CONFIG = {
  name: "",
  value: "",
  enable: true,
};

export default {
  components: { MenuView },
  mixins: [FetchMixin],
  data() {
    this.DIMEN_TYPE = DIMEN_TYPE;
    this.FIELDS = [
      { v: "tag_name", n: "维度标签名" },
      { v: "dimen_tag", n: "维度标签值", w: 200 },
      {
        v: "node_dimen",
        n: "类型",
        w: 200,
        aln: "center",
        trans: (v) => {
          const exist = _.find(DIMEN_TYPE, { v });
          return exist ? exist.n : "";
        },
      },
    ];
    this.DATA = {
      tag_name: "",
      dimen_tag: "",
      node_dimen: "",
    };
    this.SLOTS = [{ n: "操作", v: "op", w: 120, aln: "center" }];
    return {
      ID: "action_id",
      curTab: "custom",
      proxy: [],
      showTree: false,
    };
  },
  computed: {
    options() {
      return {
        dimen: 5,
        datatype: this.curInstance ? this.curInstance.dimen_tag : "",
      };
    },
  },
  watch: {
    curTab() {
      this.refresh();
    },
  },
  methods: {
    async nodefun(node) {
      return await this.API.request("/api/tag/tagmenu", { data: { tag_no: node.node_name }, method: "get" });
    },
    async fetch(data = {}) {
      switch (this.curTab) {
        case "custom":
          data.keys = { node_dimen: { type: 1, value: 5 } };
          break;
        case "extend":
          data.keys = { is_sys: { type: 1, value: 0 }, node_dimen: { type: 0, value: 5 } };
          break;
        case "sys":
          data.keys = { is_sys: { type: 1, value: 1 } };
          break;
      }
      const ret = await this.API.getTreeDimen({ ...this.getFetchParams(data), page: data.start });
      if (ret.success) {
        ret.data.data = ret.data;
        ret.data.page = ret.count;
      }
      return ret;
    },
    async addOrUpdate(data) {
      data.dimen_config = JSON.stringify(this.proxy);
      return await this.API.updateTreeDimen(data);
    },
    checkValidity(data) {
      if (!data.tag_name) {
        this.$notify({ title: "维度标签名不能为空", type: "warning" });
        return;
      }
      return true;
    },
    onAddItem() {
      this.proxy.push(_.cloneDeep(CONFIG));
    },
    onRemoveItem(index) {
      this.proxy.splice(index, 1);
    },
    onShowTree(data) {
      this.curInstance = data;
      this.showTree = true;
    },
    onRemove() {
      if (!this.selected.length || this.selected[0].is_sys == 1) return;
      this.delHandler();
    },
  },
};
</script>

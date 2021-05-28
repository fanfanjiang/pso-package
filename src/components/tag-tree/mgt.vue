<template>
  <div style="height: 100%">
    <pso-common-view
      ref="view"
      title="标签树管理"
      icon="el-icon-tickets"
      :fetch-fun="fetch"
      :fields="FIELDS"
      :slots="SLOTS"
      @dbclick="dbClickHandler"
      @select="selectHandler"
    >
      <template #tablefun> </template>
      <template #datafun>
        <el-button type="primary" size="mini" @click="addHandler">新增</el-button>
        <el-button type="danger" size="mini" @click="delHandler" :disabled="deleting" :loading="deleting">删除</el-button>
      </template>
      <template v-slot:tree="{ data }">
        <el-button type="primary" size="mini" @click="shitTree(data.row)">编辑树</el-button>
      </template>
    </pso-common-view>
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>标签树管理</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()" :disabled="editing" :loading="editing">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <el-form label-position="left" label-width="120px" size="small" v-if="curInstance">
          <el-form-item label="名称" required>
            <el-input v-model="curInstance.tag_name" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="维度" required v-if="!curInstance.tag_no">
            <el-select filterable clearable size="small" v-model="curInstance.tag_type">
              <el-option v-for="(d, i) in dimens" :key="i" :label="d.tag_name" :value="d.dimen_tag"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="curInstance.tag_info" size="small" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
    <pso-dialog :visible="showTree" width="40%" @close="showTree = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>管理树节点</span>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <tag-tree :request-options="options"></tag-tree>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { FetchMixin } from "../../mixin/view";
import TagTree from "./index";
export default {
  components: { TagTree },
  mixins: [FetchMixin],
  data() {
    this.FIELDS = [
      { v: "tag_name", n: "名称" },
      { v: "tag_no", n: "ID" },
      { v: "tag_info", n: "备注" },
      { v: "tag_status", n: "状态" },
    ];
    this.DATA = {
      tag_no: "",
      tag_pid: "",
      tag_type: "",
      tag_name: "",
      tag_info: "",
      tag_sort: "",
      tag_status: "",
    };
    this.SLOTS = [{ n: "编辑树", v: "tree", w: 100 }];
    return {
      ID: "tag_no",
      dimens: [],
      showTree: false,
      curTree: null,
    };
  },
  async created() {
    this.dimens = (await this.API.getTreeDimen()).data.filter((d) => d.node_dimen === 5);
  },
  computed: {
    options() {
      return this.curTree ? { tag_type: this.curTree.tag_type } : {};
    },
  },
  methods: {
    async fetch(data) {
      const ret = await this.API.tagtree({
        data: { ...this.getFetchParams({ ...data, keys: { tag_pid: { type: 1, value: "root" } } }), page: data.start },
        method: "get",
      });
      ret.data.data = ret.data;
      ret.data.page = ret.count;
      return ret;
    },
    async addOrUpdate(data) {
      const { optype } = data;
      return await this.API.tagtree({ data, method: optype === 0 ? "post" : "put" });
    },
    checkValidity(data) {
      if (!data.tag_name || !data.tag_type) {
        return this.$notify({ title: "名称不能为空", type: "warning" });
      }
      return true;
    },
    shitTree(data) {
      this.curTree = data;
      this.showTree = true;
    },
  },
};
</script>

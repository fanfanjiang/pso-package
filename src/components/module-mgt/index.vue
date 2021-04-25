<template>
  <div style="height: 100%">
    <pso-common-view
      ref="view"
      title="模块管理"
      icon="el-icon-tickets"
      :fetch-fun="fetch"
      :fields="FIELDS"
      @dbclick="dbClickHandler"
      @select="selectHandler"
    >
      <template #tablefun> </template>
      <template #datafun>
        <el-button type="primary" size="mini" @click="addHandler">新增</el-button>
        <el-button type="danger" size="mini" @click="delHandler" :disabled="deleting" :loading="deleting">删除</el-button>
        <el-button type="success" size="mini" @click="syncModule" :disabled="!selected.length" :loading="syncing">同步</el-button>
      </template>
    </pso-common-view>
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>模块管理</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()" :disabled="editing" :loading="editing">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <el-form label-position="left" label-width="120px" size="small" v-if="curInstance">
          <el-form-item label="标记" required>
            <el-input v-model="curInstance.module_tag" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="curInstance.module_name" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="curInstance.module_note" size="small" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { FetchMixin } from "../../mixin/view";
export default {
  mixins: [FetchMixin],
  data() {
    this.FIELDS = [
      { v: "module_tag", n: "标记" },
      { v: "module_name", n: "名称" },
      { v: "module_note", n: "备注" },
    ];
    this.DATA = {
      module_id: "",
      module_tag: "",
      module_name: "",
      module_note: "",
    };
    return {
      ID: "module_id",
      syncing: false,
    };
  },
  created() {},
  methods: {
    async fetch(data) {
      const ret = await this.API.request("/api/center/module", {
        data: { ...this.getFetchParams(data), page: data.start },
        method: "get",
      });
      ret.data.data = ret.data;
      ret.data.page = ret.count;
      return ret;
    },
    async addOrUpdate(data) {
      return await this.API.request("/api/center/module", { data, method: "post" });
    },
    checkValidity(data) {
      if (!data.module_tag) {
        return this.$notify({ title: "标签不能为空", type: "warning" });
      }
      if (!data.module_id) {
        delete data.module_id;
      }
      return true;
    },
    async syncModule() {
      this.syncing = true;
      const ret = await this.API.request("/api/center/module/sync", {
        data: { module: _.map(this.selected, "module_tag").join(",") },
        method: "post",
      });
      this.ResultNotify(ret);
      this.syncing = false;
    },
  },
};
</script>

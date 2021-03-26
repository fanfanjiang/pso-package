<template>
  <div style="height: 100%">
    <pso-common-view
      ref="view"
      title="API分组"
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
      </template>
    </pso-common-view>
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>API分组</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()" :disabled="editing" :loading="editing">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <el-form label-position="left" label-width="120px" size="small" v-if="curInstance">
          <el-form-item label="名称" required>
            <el-input v-model="curInstance.group_name" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="标记" required>
            <el-input v-model="curInstance.group_type" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态" required>
            <el-input v-model="curInstance.group_status" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" required>
            <el-input v-model="curInstance.group_note" size="small" autocomplete="off"></el-input>
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
      { v: "group_name", n: "名称", w: 100 },
      { v: "group_type", n: "标记" },
      { v: "group_status", n: "状态", w: 140 },
      { v: "group_note", n: "备注" },
    ];
    this.DATA = {
      group_id: "",
      group_name: "",
      group_status: "",
      group_note: "",
      group_type: "",
    };
    return {
      ID: "group_id",
    };
  },
  created() {},
  methods: {
    async fetch(data) {
      const ret = await this.API.request("/api/apicfg/group", {
        data: { ...this.getFetchParams(data), page: data.start },
        method: "get",
      });
      ret.data.data = ret.data;
      ret.data.page = ret.count;
      return ret;
    },
    async addOrUpdate(data) {
      return await this.API.request("/api/apicfg/group", { data, method: "post" });
    },
  },
};
</script>

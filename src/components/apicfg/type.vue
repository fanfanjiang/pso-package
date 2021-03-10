<template>
  <div style="height: 100%">
    <pso-common-view
      ref="view"
      title="API类型"
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
            <span>API类型</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()" :disabled="editing" :loading="editing">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <el-form label-position="left" label-width="120px" size="small" v-if="curInstance">
          <el-form-item label="名称" required>
            <el-input v-model="curInstance.action_name" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" required>
            <el-input v-model="curInstance.action_type" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="路径" required>
            <el-input v-model="curInstance.action_route" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="系统" required>
            <el-input v-model="curInstance.is_sys" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="配置" required>
            <el-input v-model="curInstance.action_config" size="small" autocomplete="off"></el-input>
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
      { v: "action_name", n: "名称", w: 100 },
      { v: "action_type", n: "类型", w: 140 },
      { v: "action_route", n: "路径", w: 120 },
      { v: "is_sys", n: "系统" },
      { v: "action_config", n: "配置" },
    ];
    this.DATA = {
      action_id: "",
      action_name: "",
      action_type: "",
      action_route: "",
      is_sys: "",
      action_config: "",
    };
    this.ID = "action_id";
    return {};
  },
  created() {},
  methods: {
    async fetch(data) {
      return await this.API.request("/api/apicfg/type", {
        data: { ...this.getFetchParams(data), page: data.start },
        method: "get",
      });
    },
    async addOrUpdate(data) {
      return await this.API.request("/api/apicfg/type", { data, method: "post" });
    },
  },
};
</script>

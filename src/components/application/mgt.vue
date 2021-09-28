<template>
  <div style="height: 100%">
    <pso-common-view
      ref="view"
      title="应用管理"
      icon="el-icon-eleme"
      :fetch-fun="fetch"
      :fields="FIELDS"
      @dbclick="dbClickHandler"
      @select="selectHandler"
    >
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
            <span>应用管理</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()" :disabled="editing" :loading="editing">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <el-form label-position="left" label-width="120px" size="small" v-if="curInstance">
          <el-form-item label="应用标识" required>
            <el-input v-model="curInstance.apply_id" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="应用名称" required>
            <el-input v-model="curInstance.apply_name" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="应用地址" required>
            <el-input v-model="curInstance.apply_link" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="显示顺序">
            <el-input-number size="small" v-model="curInstance.apply_order" controls-position="right" :min="0"></el-input-number>
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
      { v: "apply_id", n: "应用标识" },
      { v: "apply_name", n: "应用名称" },
      { v: "apply_status", n: "应用状态" },
      { v: "apply_link", n: "应用地址" },
    ];
    this.DATA = {
      apply_id: "",
      apply_name: "",
      apply_status: 0,
      apply_link: "",
      apply_order: 0,
      apply_config: "",
    };
    return {
      ID: "apply_id",
    };
  },
  methods: {
    async fetch(data = {}) {
      return await this.API.request("/api/application", {
        data: { ...this.getFetchParams(data), page: data.start },
        method: "get",
      });
    },
    async addOrUpdate(data) {
      return await this.API.request("/api/application", { data, method: "post" });
    },
    checkValidity(data) {
      if (!data.apply_id || !data.apply_name) {
        this.$notify({ title: "必填项不能为空", type: "warning" });
        return;
      }
      return true;
    },
  },
};
</script>

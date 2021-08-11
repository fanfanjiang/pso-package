<template>
  <div style="height: 100%">
    <pso-common-view
      ref="view"
      title="字段格式"
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
    </pso-common-view>
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>字段格式</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()" :disabled="editing" :loading="editing">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <el-form label-position="left" label-width="120px" size="small" v-if="curInstance">
          <el-form-item label="取值名称" required>
            <el-input v-model="curInstance.cert_val_name" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="取值正则" required>
            <el-input v-model="curInstance.cert_val_pattern" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="取值顺序">
            <el-input-number size="mini" v-model="curInstance.cert_val_order" controls-position="right" :min="0"></el-input-number>
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
  props: {
    id: String,
  },
  data() {
    this.FIELDS = [
      { v: "cert_val_name", n: "取值名称" },
      { v: "cert_val_pattern", n: "取值正则" },
      { v: "cert_val_order", n: "取值顺序" },
    ];
    this.DATA = {
      auto_no: "",
      cert_val_name: "",
      cert_val_pattern: "",
      cert_val_order: 0,
    };
    return {
      ID: "auto_no",
    };
  },
  created() {},
  methods: {
    async fetch(data = {}) {
      data.content_id = this.id;
      const ret = await this.API.request("/api/ocr/format", {
        data: { ...this.getFetchParams(data), page: data.start },
        method: "get",
      });
      ret.data.data = ret.data;
      ret.data.page = ret.count;
      return ret;
    },
    async addOrUpdate(data) {
      return await this.API.request("/api/ocr/format", { data, method: "post" });
    },
    checkValidity(data) {
      if (!data.cert_val_name) {
        return this.$notify({ title: "取值名称不能为空", type: "warning" });
      }
      if (!data.cert_val_pattern) {
        return this.$notify({ title: "取值正则不能为空", type: "warning" });
      }
      if (!data.auto_no) {
        delete data.auto_no;
      }
      data.content_id = this.id;
      return true;
    },
  },
};
</script>

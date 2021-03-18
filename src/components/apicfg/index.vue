<template>
  <div style="height: 100%">
    <pso-common-view
      ref="view"
      title="API配置"
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
            <span>API配置</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()" :disabled="editing" :loading="editing">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <el-form label-position="left" label-width="120px" size="small" v-if="curInstance">
          <el-form-item label="名称" required>
            <el-input v-model="curInstance.api_name" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="分组" required>
            <el-select filterable clearable size="small" v-model="curInstance.group_id">
              <el-option v-for="(d, i) in groups" :key="i" :label="d.group_name" :value="d.group_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址" required>
            <el-input v-model="curInstance.api_addr" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="请求方式" required>
            <el-select size="mini" filterable v-model="curInstance.api_method">
              <el-option label="get" value="get"></el-option>
              <el-option label="post" value="post"></el-option>
              <el-option label="put" value="put"></el-option>
              <el-option label="delete" value="delete"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="参数配置" required>
            <el-input v-model="curInstance.api_params" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="结果配置" required>
            <el-input v-model="curInstance.api_return" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="curInstance.api_note" size="small" autocomplete="off"></el-input>
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
      { v: "api_tag", n: "标记", w: 140 },
      { v: "api_name", n: "名称", w: 100 },
      { v: "api_addr", n: "地址", w: 140 },
      { v: "api_method", n: "请求方式", w: 120 },
      { v: "api_params", n: "参数配置", w: 120 },
      { v: "api_return", n: "结果配置", w: 120 },
      { v: "api_note", n: "备注" },
    ];
    this.DATA = {
      api_id: "",
      group_id: "",
      api_tag: "",
      api_tag: "",
      api_name: "",
      api_method: "",
      data_config: "",
      api_params: "",
      api_return: "",
      api_note: "",
    };
    return {
      ID: "api_id",
      groups: [], 
    };
  },
  async created() {
    this.groups = (await this.API.request("/api/apicfg/group", { data: { limit: 9999, page: 0 }, method: "get" })).data;
  },
  methods: {
    async fetch(data) {
      return await this.API.apicfg({ data: { ...this.getFetchParams(data) }, method: "get" });
    }, 
    async addOrUpdate(data) {
      return await this.API.apicfg({ data, method: "post" });
    },
  },
};
</script>

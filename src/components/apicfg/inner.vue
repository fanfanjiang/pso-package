<template>
  <div style="height: 100%">
    <pso-common-view
      ref="view"
      title="对内API"
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
        <el-form label-position="left" label-width="120px" size="mini" v-if="curInstance">
          <el-form-item label="API" required>
            <el-select filterable clearable size="small" v-model="curInstance.action_id">
              <el-option v-for="(d, i) in apis" :key="i" :label="d.action_name" :value="d.action_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编号" required>
            <el-input v-model="curInstance.inner_code" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态" required>
            <el-input v-model="curInstance.inner_status" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="参数配置" required>
            <el-input v-model="curInstance.inner_params" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="返回配置" required>
            <el-input v-model="curInstance.inner_return" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="返回参数配置" required>
            <el-input v-model="curInstance.return_config" size="small" autocomplete="off"></el-input>
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
      { v: "inner_code", n: "编号", w: 100 },
      { v: "inner_status", n: "状态", w: 140 },
      { v: "inner_params", n: "参数配置", w: 120 },
      { v: "inner_return", n: "返回配置" },
      { v: "return_config", n: "返回参数配置" },
    ];
    this.DATA = {
      inner_id: "",
      action_id: "",
      inner_code: "",
      inner_status: "",
      inner_params: "",
      inner_return: "",
      return_config: "",
    };
    this.ID = "inner_id";

    return {
      apis: [],
    };
  },
  async created() {
    this.apis = (await this.API.request("/api/apicfg/type", { data: { limit: 9999, page: 0 }, method: "get" })).data;
  },
  methods: {
    async fetch(data) {
      return await this.API.request("/api/apicfg/inner", {
        data: { ...this.getFetchParams(data), page: data.start },
        method: "get",
      });
    },
    async addOrUpdate(data) {
      return await this.API.request("/api/apicfg/inner", { data, method: "post" });
    },
  },
};
</script>

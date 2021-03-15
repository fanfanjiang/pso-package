<template>
  <div style="height: 100%">
    <pso-common-view
      ref="view"
      title="对外API"
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
          <el-form-item label="API" required>
            <el-select filterable clearable size="small" v-model="curInstance.action_id">
              <el-option v-for="(d, i) in apis" :key="i" :label="d.action_name" :value="d.action_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编号" required>
            <el-input v-model="curInstance.outer_code" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" required>
            <el-input v-model="curInstance.outer_type" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态" required>
            <el-input v-model="curInstance.outer_status" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="数据获取类型" required>
            <el-input v-model="curInstance.data_type" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="获取配置" required>
            <el-input v-model="curInstance.data_config" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="获取配置" required>
            <el-input v-model="curInstance.outer_params" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="参数配置" required>
            <el-input v-model="curInstance.outer_return" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="curInstance.outer_note" size="small" autocomplete="off"></el-input>
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
      { v: "outer_code", n: "编号", w: 140 },
      { v: "outer_type", n: "类型", w: 100 },
      { v: "outer_status", n: "状态", w: 140 },
      { v: "data_type", n: "数据类型", w: 120 },
      { v: "data_config", n: "数据配置", w: 120 },
      { v: "outer_params", n: "参数配置", w: 120 },
      { v: "outer_return", n: "返回配置" },
      { v: "outer_note", n: "备注" },
    ];
    this.DATA = {
      outer_id: "",
      action_id: "",
      outer_type: "",
      outer_code: "",
      outer_status: "",
      data_type: "",
      data_config: "",
      outer_params: "",
      outer_return: "",
      outer_note: "",
    };
    return {
      ID: "outer_id",
      apis: [],
    };
  },
  async created() {
    this.apis = (await this.API.request("/api/apicfg/type", { data: { limit: 9999, page: 0 }, method: "get" })).data;
  },
  methods: {
    async fetch(data) {
      const ret = await this.API.request("/api/apicfg/outer", {
        data: { ...this.getFetchParams(data), page: data.start },
        method: "get",
      });
      ret.data.data = ret.data;
      ret.data.page = ret.count;
      return ret;
    },
    async addOrUpdate(data) {
      return await this.API.request("/api/apicfg/outer", { data, method: "post" });
    },
  },
};
</script>

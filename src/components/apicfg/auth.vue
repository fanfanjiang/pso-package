<template>
  <div style="height: 100%">
    <pso-common-view
      ref="view"
      title="API授权"
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
        <el-button type="success" size="mini" @click="showOuter = true">选择接口</el-button>
        <el-button type="danger" size="mini" @click="delHandler" :disabled="deleting" :loading="deleting">删除</el-button>
      </template>
      <template v-slot:auth> </template>
    </pso-common-view>
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>API授权</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()" :disabled="editing" :loading="editing">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <el-form label-position="left" label-width="120px" size="small" v-if="curInstance">
          <el-form-item label="名称" required>
            <el-input v-model="curInstance.auth_name" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="过期时间">
            <el-date-picker size="mini" v-model="curInstance.expire_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="加密方式" required>
            <el-input v-model="curInstance.auth_method" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="IP白名单" required>
            <el-input v-model="curInstance.auth_ip" type="textarea" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="curInstance.auth_note" type="textarea" size="mini" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
    <pso-dialog :visible="showOuter" width="70%" @close="showOuter = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>接口</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="setAuth()" :disabled="setting" :loading="setting">选择并设置</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content" style="padding: 0">
        <api-outer ref="outer"></api-outer>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { FetchMixin } from "../../mixin/view";
import ApiOuter from "./outer";
export default {
  components: { ApiOuter },
  mixins: [FetchMixin],
  data() {
    this.FIELDS = [
      { v: "auth_name", n: "名称", w: 100 },
      { v: "auth_method", n: "加密方式", w: 100 },
      { v: "api_key", n: "KEY", w: 140 },
      { v: "api_secret", n: "密钥" },
      { v: "expire_time", n: "过期时间", w: 120 },
      { v: "auth_ip", n: "IP白名单", w: 120 },
      { v: "auth_note", n: "备注" },
    ];
    this.DATA = {
      auth_id: "",
      auth_name: "",
      auth_method: "",
      expire_time: "",
      auth_ip: "",
      auth_note: "",
    };
    this.SLOTS = [{ n: "可用接口", v: "auth" }];
    return {
      ID: "auth_id",
      setting: false,
      showOuter: false,
    };
  },
  methods: {
    async fetch(data) {
      return await this.API.apiauth({ data: { ...this.getFetchParams(data) }, method: "get" });
    },
    async addOrUpdate(data) {
      return await this.API.apiauth({ data, method: "post" });
    },
    async setAuth() {
      const outers = this.$refs.outer.selected;
      if (!outers.length) return this.$message({ type: "warning", message: `请选择接口` });
      if (!this.selected.length) return this.$message({ type: "warning", message: `请选择权限项` });

      const auth_id = _.map(this.selected, "auth_id").join(",");
      this.setting = true;

      let ret;
      for (let outer of outers) {
        ret = await this.API.request("/api/apicfg/outer/auth", { data: { optype: 0, auth_id, outer_id: outer.outer_id }, method: "post" });
      }
      this.ResultNotify(ret);
      this.setting = false;
      this.showOuter = false;
      this.refresh();
    },
  },
};
</script>

<template>
  <div v-loading="initializing">
    <el-form style="max-width: 500px" size="medium" label-width="140px" label-position="right">
      <el-form-item label="系统名称：" required>
        <el-input v-model="data.map_key0" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="公司名称：" required>
        <el-input v-model="data.map_key5" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="默认样式风格：" required>
        <el-select clearable v-model="data.map_key7">
          <el-option v-for="(d, i) in THEMES" :key="i" :label="d.label" :value="d.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="登录方式：" required>
        <el-checkbox-group v-model="signinProxy">
          <el-checkbox label="1">普通登录</el-checkbox>
          <el-checkbox label="2">部门登录</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="用户ID格式：" required>
        <el-input v-model="data.map_key6" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="是否开启注册用户：">
        <el-switch v-model="data.map_key4" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>
      <template v-if="data.map_key4 === '1'">
        <el-form-item label="注册方式：" required>
          <el-checkbox-group v-model="signupProxy">
            <el-checkbox label="1">手机注册</el-checkbox>
            <el-checkbox label="2">邮箱注册</el-checkbox>
            <el-checkbox label="3">实名注册</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="注册成功后脚本：">
          <el-button size="mini" type="success" @click="showDeisgner.show = true">设计脚本</el-button>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
      <pso-sql-designer :opener="showDeisgner" :sql="sql"></pso-sql-designer>
    </el-form>
  </div>
</template>
<script>
const THEMES = require("../../theme-config");
import { COLUMN } from "./const";

export default {
  data() {
    this.THEMES = THEMES;
    return {
      data: { ...COLUMN },
      initializing: false,
      showDeisgner: { show: false },
      sql: [],
      signinProxy: [],
      signupProxy: [],
      optype: 1,
    };
  },
  watch: {
    "showDeisgner.show": {
      handler(value) {
        if (!value) {
          this.data.map_key9 = JSON.stringify(this.sql);
        }
      },
    },
    signinProxy(data) {
      this.data.map_key2 = data.join(",");
    },
    signupProxy(data) {
      this.data.map_key3 = data.join(",");
    },
  },
  async created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.initializing = true;
      const ret = await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { value: 0, type: 1 } }) });
      if (ret.data.length) {
        this.data = ret.data[0];
        if (this.data.map_key9) {
          this.sql = JSON.parse(this.data.map_key9);
        }
        if (this.data.map_key2) {
          this.signinProxy = this.data.map_key2.split(",");
        }
        if (this.data.map_key3) {
          this.signupProxy = this.data.map_key3.split(",");
        }
      } else {
        this.optype = 0;
      }
      this.initializing = false;
    },
    async save() {
      if (!this.data.map_key0 || !this.data.map_key5 || !this.data.map_key7 || !this.data.map_key2) {
        return this.$message("请完善信息");
      }

      this.initializing = true;
      const ret = await this.API.updateSysConfig({ optype: this.optype, ...this.data });
      this.ResultNotify(ret);
      this.initializing = false;
    },
  },
};
</script>

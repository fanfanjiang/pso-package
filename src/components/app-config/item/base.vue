<template>
  <div v-loading="initializing">
    <el-form-item label="系统名称">
      <el-input size="mini" v-model="data.map_key0" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="LOGO">
      <pso-form-attach ref="attach" :cpnt="attach" @value-change="handleAttachChange" :downloadable="false">
        <el-button size="mini"><i class="el-icon-paperclip el-icon--left"></i>上传</el-button>
      </pso-form-attach>
    </el-form-item>
    <el-form-item label="LOGO底色">
      <el-color-picker size="mini" v-model="data.map_key5"></el-color-picker>
    </el-form-item>
    <el-form-item label="默认风格">
      <el-select size="mini" clearable v-model="data.map_key7">
        <el-option v-for="(d, i) in THEMES" :key="i" :label="d.label" :value="d.name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="登录方式">
      <el-select size="mini" multiple clearable v-model="signinProxy">
        <el-option label="普通登录" value="1"></el-option>
        <el-option label="部门登录" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="注册方式">
      <el-select size="mini" multiple clearable v-model="signupProxy">
        <el-option label="手机注册" value="1"></el-option>
        <el-option label="邮箱注册" value="2"></el-option>
        <el-option label="实名注册" value="3"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="子系统数量">
      <el-input-number size="mini" v-model="data.map_key4"></el-input-number>
    </el-form-item>
    <el-form-item label="用户ID生成">
      <el-select size="mini" clearable v-model="data.map_key6">
        <el-option label="自定义" value="0"></el-option>
        <el-option label="自增" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="注册执行脚本">
      <el-button size="mini" type="success" @click="showDeisgner.show = true">设计脚本</el-button>
    </el-form-item>
    <pso-sql-designer :opener="showDeisgner" :sql="sql"></pso-sql-designer>
  </div>
</template>
<script>
import { Attach } from "../../../mixin/form";
const THEMES = require("../../../theme-config");

export default {
  mixins: [Attach],
  props: {
    data: Object,
  },
  data() {
    this.THEMES = THEMES;
    return {
      initializing: false,
      showDeisgner: { show: false },
      sql: [],
      signinProxy: [],
      signupProxy: [],
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
    this.initializing = true;
    this.createCpnt();
    if (this.data.map_key9) {
      this.sql = JSON.parse(this.data.map_key9);
    }
    if (this.data.map_key2) {
      this.signinProxy = this.data.map_key2.split(",");
    }
    if (this.data.map_key3) {
      this.signupProxy = this.data.map_key3.split(",");
    }
    this.initializing = false;
  },
  methods: {
    handleAttachChange({ value }) {
      this.data.map_key1 = value;
    },
  },
};
</script>

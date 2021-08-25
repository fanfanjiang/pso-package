<template>
  <div v-loading="initializing">
    <el-form-item label="ID">
      <el-input size="small" v-model="data.map_key0" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="名称">
      <el-input size="small" v-model="data.map_key1" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="LOGO">
      <pso-form-attach ref="attach" :cpnt="attach" @value-change="handleAttachChange" :downloadable="false">
        <el-button size="mini"><i class="el-icon-paperclip el-icon--left"></i>上传</el-button>
      </pso-form-attach>
    </el-form-item>
    <el-form-item label="是否启用">
      <el-switch v-model="data.map_key2" active-value="1" inactive-value="0"></el-switch>
    </el-form-item>
    <el-form-item label="启用终端" v-if="data.map_key2 === '1'">
      <el-select size="mini" clearable v-model="data.map_key3">
        <el-option label="通用" value="0"></el-option>
        <el-option label="仅PC" value="1"></el-option>
        <el-option label="仅手机" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="APPKEY">
      <el-input size="small" v-model="data.map_key4" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="APPSECRET">
      <el-input size="small" v-model="data.map_key5" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="接口地址">
      <el-input size="small" v-model="data.map_key6" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="自动创建用户">
      <el-switch v-model="data.map_key8" active-value="1" inactive-value="0"></el-switch>
    </el-form-item>
    <el-form-item label="脚本">
      <el-button size="mini" type="success" @click="showDeisgner.show = true">设计脚本</el-button>
    </el-form-item>
    <pso-sql-designer :opener="showDeisgner" :sql="sql"></pso-sql-designer>
  </div>
</template>
<script>
import { Attach } from "../../../mixin/form";
export default {
  mixins: [Attach],
  props: {
    data: Object,
  },
  data() {
    return {
      initializing: false,
      showDeisgner: { show: false },
      sql: [],
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
  },
  async created() {
    this.initializing = true;
    this.createCpnt();
    if (this.data.map_key9) {
      this.sql = JSON.parse(this.data.map_key9);
    }
    this.initializing = false;
  },
  methods: {
    handleAttachChange({ value }) {
      this.data.map_key7 = value;
    },
  },
};
</script>

<template>
  <div v-loading="initializing">
    <el-form-item label="ID">
      <el-input size="small" v-model="data.map_key0" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="名称">
      <el-input size="small" v-model="data.map_key1" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="时间">
      <el-date-picker size="small" v-model="data.map_key2" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
    </el-form-item>
    <el-form-item label="脚本">
      <el-button size="mini" type="success" @click="showDeisgner.show = true">设计脚本</el-button>
    </el-form-item>
    <pso-sql-designer :opener="showDeisgner" :sql="sql"></pso-sql-designer>
  </div>
</template>
<script>
export default {
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
    if (this.data.map_key9) {
      this.sql = JSON.parse(this.data.map_key9);
    }
    this.initializing = false;
  },
};
</script>

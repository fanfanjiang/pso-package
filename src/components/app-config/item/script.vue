<template>
  <div v-loading="initializing">
    <el-form-item label="配置名称">
      <el-input size="small" v-model="data.map_key0" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="标记">
      <el-input size="small" v-model="data.map_key1" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="表单">
      <el-input size="small" v-model="data.map_key2" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="值字段">
      <el-input size="small" v-model="data.map_key3" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="参数字段">
      <el-input size="small" v-model="data.map_key4" autocomplete="off"></el-input>
    </el-form-item>
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
      pTypes: [],
    };
  },
  async created() {
    this.initializing = true;
    this.initializing = false;
  },
};
</script>

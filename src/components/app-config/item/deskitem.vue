<template>
  <div v-loading="initializing">
    <el-form-item label="模块名称">
      <el-input size="small" v-model="data.map_key0" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="模块ID">
      <el-input size="small" v-model="data.map_key1" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="默认高度">
      <el-input-number size="small" v-model="data.map_key2" controls-position="right" :min="4"></el-input-number>
    </el-form-item>
    <el-form-item label="默认宽度">
      <el-input-number size="small" v-model="data.map_key3" controls-position="right" :min="4"></el-input-number>
    </el-form-item>
    <el-form-item label="更多地址">
      <el-input size="small" v-model="data.map_key5" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="参数1">
      <el-input size="small" v-model="data.map_key6" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="参数2">
      <el-input size="small" v-model="data.map_key7" autocomplete="off"></el-input>
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
      showIconBox: false,
    };
  },
  async created() {
    this.initializing = true;
    this.initializing = false;
  },
};
</script>

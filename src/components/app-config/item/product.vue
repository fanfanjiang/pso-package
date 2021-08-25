<template>
  <div v-loading="initializing"> 
    <el-form-item label="名称">
      <el-input size="small" v-model="data.map_key0" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="链接">
      <el-input size="small" v-model="data.map_key1" autocomplete="off"></el-input>
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

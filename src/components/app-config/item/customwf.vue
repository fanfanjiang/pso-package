<template>
  <div v-loading="initializing">
    <el-form-item label="自定义名称">
      <el-input size="mini" v-model="data.map_key0" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="流程">
      <el-select filterable clearable size="mini" v-model="data.map_key1">
        <el-option v-for="(w, i) in workflows" :key="i" :label="w.node_display" :value="w.node_name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="流程地址">
      <el-input size="mini" v-model="data.map_key2" autocomplete="off"></el-input>
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
      workflows: [],
    };
  },
  async created() {
    this.initializing = true;
    this.workflows = await this.API.getWfTree();
    this.initializing = false;
  },
};
</script>

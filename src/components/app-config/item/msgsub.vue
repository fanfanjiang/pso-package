<template>
  <div v-loading="initializing">
    <el-form-item label="ID">
      <el-input size="small" v-model="data.map_key0" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="一级分类">
      <el-select size="mini" clearable v-model="data.map_key1">
        <el-option v-for="(f, i) in pTypes" :key="i" :label="f.map_key2" :value="f.map_key0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="名称">
      <el-input size="small" v-model="data.map_key2" autocomplete="off"></el-input>
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
    this.pTypes = (await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { value: 9, type: 1 } }) })).data;
    this.initializing = false;
  },
};
</script>

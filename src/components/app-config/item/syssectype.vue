<template>
  <div v-loading="initializing">
    <el-form-item label="名称">
      <el-input size="small" v-model="data.map_key0" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="系统应用分类">
      <el-select size="mini" clearable v-model="data.map_key1">
        <el-option v-for="(f, i) in pTypes" :key="i" :label="f.map_key0" :value="f.auto_no"></el-option>
      </el-select>
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
    this.pTypes = (await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { value: 4, type: 1 } }) })).data;
    this.initializing = false;
  },
};
</script>

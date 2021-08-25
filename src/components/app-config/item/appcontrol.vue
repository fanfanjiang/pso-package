<template>
  <div v-loading="initializing">
    <el-form-item label="关联站点">
      <el-select size="mini" clearable v-model="data.map_key0">
        <el-option v-for="(s, i) in sites" :key="i" :label="s.site_name" :value="s.site_id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="节点数">
      <el-input-number size="mini" v-model="data.map_key1" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="资源容量">
      <el-input-number size="mini" v-model="data.map_key2" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="数据容量">
      <el-input-number size="mini" v-model="data.map_key3" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="过期时间">
      <el-date-picker size="mini" v-model="data.map_key4" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
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
      sites: [],
    };
  },
  async created() {
    this.initializing = true;
    this.sites = (await this.API.getSites()).data.data;
    this.initializing = false;
  },
};
</script>

<template>
  <div v-loading="initializing">
    <el-form-item label="类型ID">
      <el-input size="small" v-model="data.map_key0" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="类型名称">
      <el-input size="small" v-model="data.map_key1" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="排序">
      <el-input-number size="mini" v-model="data.map_key2" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="角色">
      <el-select multiple filterable clearable size="small" v-model="data.map_key3">
        <el-option v-for="r in roles" :key="r.user_type" :label="r.type_name" :value="r.user_type"></el-option>
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
      roles: [],
    };
  },
  async created() {
    this.initializing = true;
    const ret = await this.API.getUserType({});
    this.roles = ret.data;
    this.initializing = false;
  },
};
</script>

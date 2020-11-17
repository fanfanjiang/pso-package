<template>
  <el-table :data="data" style="width: 100%" key="text">
    <el-table-column type="index" :index="1"></el-table-column>
    <el-table-column prop="type" label="功能" width="180"></el-table-column>
    <el-table-column label="文本值">
      <template slot-scope="scope">
        <el-input v-model="scope.row.value" size="small" placeholder></el-input>
      </template>
    </el-table-column>
    <el-table-column label="是否显示">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.show" size="small" :active-value="true" :inactive-value="false"></el-switch>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: ["data"],
  data() {
    return {};
  }
};
</script>
<template>
  <el-table border size="mini" :data="data" style="width: 100%; margin-top: 20px" key="text">
    <el-table-column prop="type" label="功能" width="120"></el-table-column>
    <el-table-column label="显示" width="80" align="center">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.show" size="mini" :active-value="true" :inactive-value="false"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="文本值">
      <template slot-scope="scope">
        <el-input v-model="scope.row.value" size="mini" placeholder></el-input>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: ["data"],
  data() {
    return {};
  },
};
</script>
<template>
  <el-table border size="mini" :data="data" style="width: 100%; margin-top: 20px">
    <el-table-column prop="subForm" label="子表单" width="180"></el-table-column>
    <el-table-column label="是否流程" width="200">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.isFlow" size="small" active-value="1" inactive-value="0"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="选择流程">
      <template slot-scope="scope">
        <el-select size="mini" v-model="scope.row.subWf" placeholder="请选择">
          <el-option v-for="item in workflows" :key="item.node_name" :label="item.node_display" :value="item.node_name"></el-option>
        </el-select>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: ["data"],
  data() {
    return {
      workflows: [],
    };
  },
  async created() {
    this.workflows = await this.API.getWfTree();
  },
};
</script>
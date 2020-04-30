<template>
  <div class="pso-chart-table">
    <el-table :data="data.rows" border style="width: 100%" size="medium" max-height="500">
      <el-table-column
        show-overflow-tooltip
        :prop="tableField._fieldValue"
        :label="tableField.alias||tableField._fieldName"
        v-for="tableField of columns"
        :key="tableField._fieldValue"
      >
        <template slot-scope="scope">
          <el-tag v-if="tableField.componentid === 'attachment'" size="mini">附件</el-tag>
          <el-tag v-else-if="tableField.componentid === 'table'" size="mini">{{tableField.name}}</el-tag>
          <div v-else>{{scope.row[tableField._fieldValue]}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: ["chartConfig", "data", "cfg"],
  computed: {
    columns() {
      return this.chartConfig.dimension.concat(this.chartConfig.metrics);
    }
  }
};
</script>
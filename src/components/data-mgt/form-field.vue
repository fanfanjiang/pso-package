<template>
  <el-table key="field" :data="data" style="width: 100%" height="600">
    <el-table-column type="index" :index="1"></el-table-column>
    <el-table-column prop="field_name" label="字段" width="180"></el-table-column>
    <el-table-column prop="field_display" label="显示名称" width="180"></el-table-column>
    <el-table-column fixed="right" label="操作">
      <template slot-scope="scope" v-if="scope.row.field_name">
        <pso-field-auth :field_name="scope.row.field_name" :data_code="code"></pso-field-auth>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import PsoFieldAuth from "./field-auth";

export default {
  props: ["data", "code"],
  components: { PsoFieldAuth }
};
</script>
<template>
  <el-table-column
    resizable
    show-overflow-tooltip
    :label="col.label || col.name"
    :prop="col.field"
    :width="col.width"
    :align="col.align || 'center'"
  >
    <template v-if="col.children">
      <custom-column v-for="(item, i) in col.children" :key="i" :col="item"></custom-column>
    </template>
    <template v-else>
      <template slot-scope="scope">{{ getVal(scope.row[col.field]) }}</template>
    </template>
  </el-table-column>
</template>
<script>
export default {
  name: "custom-column",
  props: {
    col: {
      type: Object,
    },
  },
  methods: {
    getVal(val) {
      return _.isNull(val) ? "" : val;
    },
  },
};
</script>

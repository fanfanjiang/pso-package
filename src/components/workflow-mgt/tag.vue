<template>
  <el-table border size="mini" :data="data" style="width: 100%; margin-top: 20px" key="tag">
    <el-table-column prop="tagType" label="文本类型" width="120" align="center"></el-table-column>
    <el-table-column prop="tagVal" label="文本值">
      <template slot-scope="scope">
        <el-tag size="small" v-for="(d, i) in scope.row.tagVal" :key="i" closable @close="handleDelTag(i, scope.row)">{{ d }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="110" align="center">
      <template slot-scope="scope">
        <pso-wf-tageditor :data="scope.row" @confirm="addTagText($event, scope.row)"></pso-wf-tageditor>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import PsoWfTageditor from "./tag-editor";

export default {
  components: { PsoWfTageditor },
  props: ["data"],
  data() {
    return {};
  },
  methods: {
    addTagText(val, data) {
      data.tagVal.push(val);
    },
    handleDelTag(index, data) {
      data.tagVal.splice(index, 1);
    },
  },
};
</script>
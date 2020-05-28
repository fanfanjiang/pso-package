<template>
  <el-table :data="data" style="width: 100%" key="tag">
    <el-table-column type="index" :index="1"></el-table-column>
    <el-table-column prop="tagType" label="文本类型" width="180"></el-table-column>
    <el-table-column prop="tagVal" label="文本值">
      <template slot-scope="scope">
        <el-tag
          v-for="(itemVal,index) in scope.row.tagVal"
          :key="itemVal"
          closable
          @close="handleDelTag(index,scope.row)"
        >{{itemVal}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作">
      <template slot-scope="scope">
        <pso-wf-tageditor :data="scope.row" @confirm="addTagText($event,scope.row)"></pso-wf-tageditor>
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
    }
  }
};
</script>
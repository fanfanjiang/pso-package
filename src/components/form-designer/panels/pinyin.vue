<template>
  <common-panel :cpnt="cpnt" info="将所关联的字段内容转换成拼音。" :needDefaultValue="false">
    <el-form-item label="转换关联字段">
      <el-select v-model="cpnt.data._source" size="mini" placeholder="请选择">
        <el-option v-for="(d, i) in fieldOptions" :key="i" :label="d._fieldName" :value="d.fid"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="类型">
      <el-radio-group v-model="cpnt.data._type">
        <el-radio label="1">全部字母</el-radio>
        <el-radio label="2">首字母</el-radio>
      </el-radio-group>
    </el-form-item>
  </common-panel>
</template>
<script>
import commonPanel from "../common/common-panel";

export default {
  props: ["cpnt"],
  components: {
    commonPanel,
  },
  data() {
    return {};
  },
  computed: {
    fieldOptions() {
      return this.cpnt.store.search({ options: { db: true }, onlyData: true, beforePush: (d) => d.fid !== this.cpnt.fid });
    },
  },
};
</script>

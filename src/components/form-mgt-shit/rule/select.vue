<template>
  <el-form size="mini" label-position="left" label-width="80px">
    <el-form-item label="选择字段">
      <el-select size="small" placeholder="字段" multiple filterable clearable v-model="instance.tids">
        <el-option v-for="(d, i) in options" :key="i" :label="d.data._fieldName" :value="d.data._fieldValue"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
import { formatJSONList } from "../../../utils/util";
const _DATA = {
  cid: "",
  tids: [],
};
export default {
  props: {
    store: Object,
    instance: Object,
  },
  computed: {
    options() {
      const data = [];
      this.store._forEach((cpnt) => data.push(cpnt));
      return data;
    },
  },
  created() {
    formatJSONList([this.instance], _DATA);
  },
};
</script>
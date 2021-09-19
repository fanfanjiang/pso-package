<template>
  <el-form size="mini" label-position="left" label-width="100px">
    <el-form-item label="高亮全部列">
      <el-switch size="small" v-model="instance.checkall" active-value="1" inactive-value="0"></el-switch>
    </el-form-item>
    <el-form-item label="选择高亮列" v-if="instance.checkall === '0'">
      <el-select size="small" placeholder="字段" multiple filterable clearable v-model="instance.tids">
        <el-option v-for="(d, i) in options" :key="i" :label="d.data._fieldName" :value="d.data._fieldValue"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="背景颜色">
      <el-color-picker size="small" v-model="instance.ccolor"></el-color-picker>
    </el-form-item>
    <el-form-item label="字体颜色">
      <el-color-picker size="small" v-model="instance.bcolor"></el-color-picker>
    </el-form-item>
  </el-form> 
</template>
<script>
import { formatJSONList } from "../../../../utils/util";
const _DATA = {
  id: "",
  cid: "",
  tids: [],
  checkall: "1",
  ccolor: "",
  bcolor: "",
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
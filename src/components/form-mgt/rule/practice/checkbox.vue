<template>
  <el-form label-position="top" size="medium">
    <el-form-item label="">
      <el-select placeholder="选择字段" filterable clearable v-model="instance.tid">
        <el-option v-for="(d, i) in options" :key="i" :label="d.data._fieldName" :value="d.data._fieldValue"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="" v-if="curCpnt">
      <el-select placeholder="选择选项" multiple filterable clearable v-model="instance.fids">
        <el-option v-for="(d, i) in curCpnt._option" :key="i" :label="d._optionName" :value="d._optionValue"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
import { formatJSONList } from "../../../../utils/util";
const _DATA = {
  cid: "",
  tid: "",
  fids: [],
};
export default {
  props: {
    store: Object,
    instance: Object,
  },
  computed: {
    options() {
      const data = [];
      this.store._forEach((cpnt) => {
        if (["checkbox", "select"].includes(cpnt.componentid)) {
          data.push(cpnt);
        }
      });
      return data;
    },
    curCpnt() {
      return this.store.searchByField(this.instance.tid, true);
    },
  },
  created() {
    formatJSONList([this.instance], _DATA);
  },
};
</script>
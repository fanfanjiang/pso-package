<template>
  <el-form size="mini" :label-position="position" :label-width="labelWidth" style="padding: 10px">
    <el-form-item label="名称">
      <el-input size="mini" v-model.trim="cpnt.urine.child_name" clearable></el-input>
    </el-form-item>
    <el-form-item label="启用">
      <el-switch size="mini" v-model="cpnt.urine.child_status" :active-value="1" :inactive-value="0"></el-switch>
    </el-form-item>
    <el-form-item label="查看更多">
      <el-switch size="mini" v-model="cpnt.data.moreable"></el-switch>
    </el-form-item>
    <template v-if="cpnt.data.moreable">
      <el-form-item label="更多类型">
        <el-select filterable clearable size="mini" v-model="cpnt.data.moreType">
          <el-option v-for="(a, i) in MORETYPES" :key="i" :label="a.n" :value="a.v"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="更多地址" v-if="cpnt.data.moreType === '0'">
        <el-input size="mini" v-model.trim="cpnt.data.moreTarget" clearable></el-input>
      </el-form-item>
    </template>
    <slot></slot>
  </el-form>
</template>
<script>
import { MORETYPES } from "./const.js";
export default {
  props: {
    cpnt: Object,
    position: {
      type: String,
      default: "left",
    },
    labelWidth: {
      type: String,
      default: "50px",
    },
  },
  data() {
    this.MORETYPES = MORETYPES;
    return {};
  },
};
</script>
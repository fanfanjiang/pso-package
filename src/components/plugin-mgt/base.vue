<template>
  <el-form label-position="left" label-width="80px" style="margin-top: 10px">
    <el-form-item label="插件名称">
      <el-input size="small" v-model="node.tp_name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="插件类型">
      <el-select size="small" v-model="node.tp_type">
        <el-option v-for="item in TP_TYPES" :key="item.value" :label="item.name" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="插件地址">
      <el-input size="small" v-model="node.tp_route" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="组件">
      <el-input size="small" v-model="node.tp_component" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import { TP_TYPES } from "../../const/sys";

export default {
  props: ["node", "params"],
  data() {
    this.TP_TYPES = TP_TYPES;
    return {};
  },
};
</script>
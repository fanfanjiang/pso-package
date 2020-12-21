<template>
  <el-form size="mini" label-position="left" label-width="50px" style="padding: 10px">
    <el-form-item label="名称">
      <el-input size="mini" v-model.trim="cpnt.urine.child_name" clearable></el-input>
    </el-form-item>
    <el-form-item label="启用">
      <el-switch size="mini" v-model="cpnt.urine.child_status" :active-value="1" :inactive-value="0"></el-switch>
    </el-form-item>
    <slot></slot>
  </el-form>
</template>
<script>
export default {
  props: {
    cpnt: Object,
  },
};
</script>
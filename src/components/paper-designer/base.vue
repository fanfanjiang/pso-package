<template>
  <el-form size="mini" label-position="left">
    <el-form-item label="">
      <el-checkbox v-model="store.authRequired">需要登录</el-checkbox>
    </el-form-item>
    <el-form-item label="">
      <el-checkbox v-model="store.nameRequired">姓名</el-checkbox>
    </el-form-item>
    <el-form-item label="">
      <el-checkbox v-model="store.IDRequired">身份证</el-checkbox>
    </el-form-item>
    <el-form-item label="">
      <el-checkbox v-model="store.phoneRequired">手机</el-checkbox>
    </el-form-item>
    <el-form-item label="">
      <el-checkbox v-model="store.addressRequired">地址</el-checkbox>
    </el-form-item>
  </el-form>
</template> 
<script>
export default {
  props: {
    store: Object,
  },
};
</script>
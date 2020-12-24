<template>
  <el-form size="mini" label-position="left" label-width="60px">
    <el-form-item label="登录">
      <el-checkbox v-model="store.paperConfig.authRequired"></el-checkbox>
    </el-form-item>
    <el-form-item label="姓名">
      <el-checkbox v-model="store.paperConfig.nameRequired"></el-checkbox>
    </el-form-item>
    <el-form-item label="身份证">
      <el-checkbox v-model="store.paperConfig.IDRequired"></el-checkbox>
    </el-form-item>
    <el-form-item label="手机">
      <el-checkbox v-model="store.paperConfig.phoneRequired"></el-checkbox>
    </el-form-item>
    <el-form-item label="地址">
      <el-checkbox v-model="store.paperConfig.addressRequired"></el-checkbox>
    </el-form-item>
    <el-form-item label="及格">
      <el-input-number size="mini" v-model="store.paperConfig.passScore" controls-position="right" :min="0"></el-input-number>
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
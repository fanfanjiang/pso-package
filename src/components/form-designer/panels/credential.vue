<template>
  <div class="act-text-body">
    <common-panel
      :cpnt="cpnt"
      info="可以验证身份证、护照、港澳台通行证"
      :needPlaceholder="true"
      :needDefaultValue="false"
    >
      <el-form-item label="验证类型">
        <el-radio v-model="cpnt.data._type" label="1">身份证</el-radio>
        <el-radio v-model="cpnt.data._type" label="2">护照</el-radio>
        <el-radio v-model="cpnt.data._type" label="3">港澳通行证</el-radio>
        <el-radio v-model="cpnt.data._type" label="4">台湾通行证</el-radio>
      </el-form-item>
    </common-panel>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";

export default {
  props: ["cpnt"],
  components: {
    commonPanel
  },
  created() {}
};
</script>
<style lang="less" scoped>
</style>
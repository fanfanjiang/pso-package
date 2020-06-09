<template>
  <div class="act-text-body">
    <common-panel :cpnt="cpnt" info="可以输入一般文字" :needPlaceholder="true">
      <el-form-item label="显示方式">
        <el-radio v-model="cpnt.data._type" label="text">单行</el-radio>
        <el-radio v-model="cpnt.data._type" label="textarea">多行</el-radio>
      </el-form-item>
      <el-form-item label="扫码录入">
        <el-checkbox v-model="cpnt.data._scannable" :true-label="true" :false-label="false">是否支持扫码</el-checkbox>
        <div v-if="cpnt.data._scannable">
          <el-radio v-model="cpnt.data._scanType" label="qr">二维码</el-radio>
          <el-radio v-model="cpnt.data._scanType" label="bar">条形码</el-radio>
        </div>
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
  }
};
</script>

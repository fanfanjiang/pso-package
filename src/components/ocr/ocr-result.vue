<template>
  <div class="ocr-test-ret" :class="data.success ? 'success' : 'fail'">
    <div class="ocr-test-ret-header">
      <i :class="data.success ? 'el-icon-check' : 'el-icon-close'"></i>
      <span>{{ data.success ? "识别成功" : "识别失败" }}</span>
    </div>
    <div class="ocr-test-ret-body" v-if="data._template">识别证件：{{ data._template.cert_name }}</div>
    <div class="ocr-test-ret-footer" v-if="!data.success && data.message">错误信息：{{ data.message }}</div>
  </div>
</template>
<script>
export default {
  props: {
    data: Object,
  },
};
</script>
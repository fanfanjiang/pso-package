<template>
  <div class="pso-save-footer">
    <el-button size="large" type="primary" @click="$emit('save')">保 存</el-button>
  </div>
</template>
<script>
export default {};
</script>
<style lang="less">
.pso-save-footer {
  position: absolute;
  padding: 15px;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  box-shadow: 0 0 6px 0 rgb(0 0 0 / 12%);
  background: #fff;
  z-index: 99;
}
</style>
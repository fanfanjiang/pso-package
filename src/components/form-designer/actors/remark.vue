<template>
  <div class="pso-form-remark">{{ cpnt.data._defaultValue }}</div>
</template>
<script>
export default {
  name: "pso-section-actor",
  props: ["cpnt"],
};
</script>
<style lang="less" scoped>
.pso-form-remark {
  padding: 20px;
  color: #999;
  background-color: transparent;
  border-radius: 5px;
  position: relative;
  z-index: 0;
}
</style>
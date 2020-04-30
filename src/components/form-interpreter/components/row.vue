<template>
  <div class="pso-form-row">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    cpnt: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
<style lang="less" scoped>
.pso-form-row {
  display: flex;
  flex-direction: row;
  > div {
    flex: 1;
    & + div {
      margin-left: 10px;
    }
  }
}
</style>
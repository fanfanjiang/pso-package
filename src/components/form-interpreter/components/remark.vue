<template>
  <div class="pso-form-remark">{{ cpnt.data._val || cpnt.data._defaultValue }}</div>
</template>
<script>
export default {
  props: {
    cpnt: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
<style lang="less" scoped>
.pso-form-remark {
  padding: 20px 0px;
  color: #000;
}
</style>
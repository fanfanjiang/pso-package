<template>
  <div class="pso-form-chart">
    <pso-chart-viewer v-if="cpnt.data._defaultValue" :chartId="cpnt.data._defaultValue"></pso-chart-viewer>
  </div>
</template>
<script>
export default {
  props: {
    cpnt: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="less" scoped>
.pso-actor-chart {
  height: 400px;
}
</style>
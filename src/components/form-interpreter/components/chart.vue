<template>
  <div class="pso-form-chart" :style="chartStyle">
    <pso-chart-interpreter v-if="cpnt.data._defaultValue" :chartId="cpnt.data._defaultValue"></pso-chart-interpreter>
  </div>
</template>
<script>
export default {
  props: {
    cpnt: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    chartStyle() {
      const style = {};
      if (this.cpnt.data._height) {
        style.height = `${this.cpnt.data._height}px`;
      }
      return style;
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="less" scoped>
.pso-actor-chart {
  height: 400px;
}
</style>
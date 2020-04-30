<template>
  <div class="pso-actor-chart">
    <pso-chart-viewer v-if="cpnt.data._defaultValue" :chartId="cpnt.data._defaultValue"></pso-chart-viewer>
  </div>
</template>
<script>
export default {
  props: ["cpnt"]
};
</script>
<style lang="less" scoped>
.pso-actor-chart {
  height: 300px;
}
</style>
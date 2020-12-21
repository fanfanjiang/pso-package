<template>
  <pso-chart-interpreter :chart-config="cpnt.data.design"></pso-chart-interpreter>
</template>
<script>
export default {
  props: {
    cpnt: {
      type: Object,
    },
  },
};
</script>

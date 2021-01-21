<template>
  <pso-grid-wrapper :cpnt="cpnt">
    <pso-chart-interpreter :chart-config="cpnt.data.design"></pso-chart-interpreter>
  </pso-grid-wrapper>
</template>
<script>
import { BaseMixin } from "../mixin";
export default {
  mixins: [BaseMixin],
};
</script>

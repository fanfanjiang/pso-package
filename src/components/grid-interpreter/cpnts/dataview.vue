<template>
  <pso-grid-wrapper :cpnt="cpnt">
    <pso-super-view :params="cpnt.data" :urine="cpnt.urine" @instance-click="clickInst"></pso-super-view>
  </pso-grid-wrapper>
</template>
<script>
import { BaseMixin } from "../mixin";
export default {
  mixins: [BaseMixin],
};
</script>

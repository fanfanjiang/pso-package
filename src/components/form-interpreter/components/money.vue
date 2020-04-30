<template>
  <pso-form-number :cpnt="cpnt" @value-change="$emit('value-change',$event)"></pso-form-number>
</template>
<script>
import PsoFormNumber from "./number";

export default {
  components: {
    PsoFormNumber
  },
  props: {
    cpnt: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

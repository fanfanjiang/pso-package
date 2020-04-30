<template>
  <pso-form-text :cpnt="cpnt" @value-change="$emit('value-change',$event)"></pso-form-text>
</template>
<script>
import PsoFormText from "./text";

export default {
  components: {
    PsoFormText
  },
  props: {
    cpnt: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

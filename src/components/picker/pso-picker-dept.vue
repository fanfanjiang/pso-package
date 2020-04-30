<template>
  <pso-picker-tree
    :pattern="pattern"
    :show="show"
    :requestOptions="requestOptions"
    btn-text="选择部门"
    @confirm="$emit('confirm',$event)"
  ></pso-picker-tree>
</template>
<script>
export default {
  props: {
    pattern: {
      type: String,
      default: "radio"
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      requestOptions: {
        node_dimen: "NODEDIMEN02"
      }
    };
  }
};
</script>

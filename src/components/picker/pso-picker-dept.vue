<template>
  <pso-picker-tree
    :pattern="pattern"
    :show="show"
    :requestOptions="requestOptions"
    :btn-text="text"
    @confirm="$emit('confirm',$event)"
  >
    <slot>
      <el-button icon="el-icon-plus" plain size="mini">{{text}}</el-button>
    </slot>
  </pso-picker-tree>
</template>
<script>
export default {
  props: {
    pattern: {
      type: String,
      default: "radio",
    },
    show: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "选择部门",
    },
  },
  data() {
    return {
      requestOptions: {
        dimen: 2,
      },
    };
  },
};
</script>

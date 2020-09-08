<template>
  <pso-label :cpnt="cpnt">
    <el-cascader
      size="small"
      filterable
      clearable
      :props="props"
      v-model="cpnt.data._val"
      :options="cpnt.data._option"
    ></el-cascader>
  </pso-label>
</template>
<script>
export default {
  props: {
    cpnt: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  computed: {
    props() {
      return {
        value: "_optionValue",
        label: "_optionValue",
        children: "_option",
        leaf: "_leaf",
      };
    },
  },
};
</script>
<style lang="less" scoped>
</style>
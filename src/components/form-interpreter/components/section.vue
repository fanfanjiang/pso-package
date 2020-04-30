<template>
  <el-divider content-position="left">{{cpnt.data._defaultValue}}</el-divider>
</template>
<script>
export default {
  props: {
    cpnt: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
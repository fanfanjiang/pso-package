<template>
  <pso-super-view :params="cpnt.data"></pso-super-view>
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

<template>
  <div class="pso-form-row">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    cpnt: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
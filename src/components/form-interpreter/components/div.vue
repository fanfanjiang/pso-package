<template>
  <div class="pso-form-div">
    <slot></slot>
  </div>
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

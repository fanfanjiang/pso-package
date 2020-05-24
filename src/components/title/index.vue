<template>
  <div class="pso-title" :style="style">
    <slot>{{title}}</slot>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    size: {
      type: Number,
      default: 14
    }
  },
  computed: {
    style() {
      return {
        "font-size": `${this.size}px`
      };
    }
  }
};
</script>
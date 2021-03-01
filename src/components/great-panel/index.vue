<template>
  <div class="great-panel" :style="style">
    <div class="great-panel-header">
      <slot name="header"></slot>
    </div>
    <div class="great-panel-body">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: "#F5F7FA",
    },
    padding: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    style() {
      return {
        "background-color": this.color,
        padding: `${this.padding}px`,
      };
    },
  },
};
</script>
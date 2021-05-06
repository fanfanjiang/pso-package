<template>
  <div :style="colorStyle"></div>
</template>
<script>
export default {
  props: {
    color: String,
    w: {
      type: Number,
      default: 18,
    },
    h: {
      type: Number,
      default: 18,
    },
  },
  computed: {
    colorStyle() {
      return {
        width: `${this.w}px`,
        height: `${this.h}px`,
        background: `#${this.color}`,
      };
    },
  },
};
</script>
<template>
  <div class="borderw" :style="borderStyle"></div>
</template>
<script>
export default {
  props: {
    w: Number,
  },
  computed: {
    borderStyle() {
      return {
        height: `${this.w}px`,
      };
    },
  },
};
</script>
<style lang="less" scoped>
.borderw {
  background: #000;
  cursor: pointer;
}
</style>
<template>
  <div ref="paper" class="paper-h" :style="hStyle"></div>
</template>
<script>
export default {
  props: {
    print: Object,
  },
  mounted() {
    $(".ht_master .wtHider").append(this.$refs.paper);
  },
  computed: {
    hStyle() {
      return {
        top: `${this.print.lineHeight}px`,
      };
    },
  },
};
</script>
<style lang="less">
.paper-h {
  position: absolute;
  left: 49.6px;
  height: 0;
  right: 0;
  border-top: dashed 2px red;
}
</style>
<template>
  <div ref="paper" class="paper-v" :style="hStyle"></div>
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
        left: `${this.print.lineWidth}px`,
      };
    },
  },
};
</script>
<style lang="less">
.paper-v {
  position: absolute;
  width: 0;
  top: 28px;
  bottom: 0;
  border-left: dashed 2px red;
}
</style>
<template>
  <div ref="backimg" class="printgod-img">
    <img ref="img" v-if="print.sheet.background.url" :src="print.sheet.background.url" :style="imgStyle" />
  </div>
</template>
<script>
export default {
  props: {
    print: Object,
  },
  data() {
    return {};
  },
  mounted() {
    $(".ht_master .wtHider").append(this.$refs.backimg);
  },
  computed: {
    imgStyle() {
      return {
        width: `${this.print.lineWidth - 50}px`,
        height: "auto",
      };
    },
  },
  methods: {},
};
</script>
<style lang="less">
.printgod-img {
  top: 26px;
  left: 50px;
  position: absolute;
  overflow: hidden;
  z-index: 0;
  font-size: 0;
}
</style>
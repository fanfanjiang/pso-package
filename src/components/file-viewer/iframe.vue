<template>
  <div class="pos-iframe" v-loading="loading">
    <iframe ref="iframe" :src="src" height="100%" width="100%" frameborder="0"></iframe>
  </div>
</template>
<script>
export default {
  props: {
    src: String,
    emitscroll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scrollEl: null,
      loading: true,
    };
  },
  mounted() {
    const el = $(this.$refs.iframe);
    el.on("load", () => {
      this.loading = false;
      this.scrollEl = el.contents().find("#viewerContainer");

      const container = el.contents().find("#outerContainer");

      this.$emit("iframeload", { scrollContainer: this.scrollEl, container });
      
      if (this.emitscroll) {
        this.scrollEl.on("scroll", this.onIframeScroll);
      }
    });
  },
  destroyed() {
    if (this.scrollEl) {
      this.scrollEl.unbind("mousedown", this.onIframeScroll);
    }
  },
  methods: {
    onIframeScroll() {
      this.$emit("iframescroll", this.scrollEl.scrollTop());
    },
  },
};
</script>
<style lang="less" scoped>
.pos-iframe {
  height: 100%;
  width: 100%;
}
</style>
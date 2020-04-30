<template>
  <div class="pos-iframe" v-loading="loading">
    <iframe ref="iframe" :src="src" height="100%" width="100%" frameborder="0"></iframe>
  </div>
</template>
<script>
export default {
  props: ["src"],
  data() {
    return {
      loading: true
    };
  },
  mounted() {
    $(this.$refs.iframe).on("load", () => {
      this.loading = false;
    });
  }
};
</script>
<style lang="less" scoped>
.pos-iframe {
  height: 100%;
  width: 100%;
}
</style>
<template>
  <pso-iframe
    :src="src"
    :emitscroll="emitscroll"
    @iframescroll="$emit('iframescroll', $event)"
    @iframeload="$emit('iframeload', $event)"
  ></pso-iframe>
</template>
<script>
import PsoIframe from "./iframe";
export default {
  components: { PsoIframe },
  props: {
    file: Object,
    emitscroll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: true,
      src: `${this.APIURL}/pdf?url=${encodeURIComponent(this.file.url)}`,
    };
  },
};
</script>
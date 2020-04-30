<template>
  <pso-iframe :src="src"></pso-iframe>
</template>
<script>
import PsoIframe from "./iframe";
export default {
  components: { PsoIframe },
  props: ["file"],
  data() {
    return {
      loading: true,
      src: `${this.APIURL}/pdf?url=${this.file.url}`
    };
  }
};
</script>
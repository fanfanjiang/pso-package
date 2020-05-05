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
      src: `https://view.officeapps.live.com/op/view.aspx?src=${this.file.url}`
    };
  }
};
</script>

<template>
  <pso-dialog customclass="pso-search-entry-panel" :visible="show" width="80%" @close="show = false" @opened="focusInput">
    <div></div>
  </pso-dialog>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      keywords: "",
    };
  },
};
</script>
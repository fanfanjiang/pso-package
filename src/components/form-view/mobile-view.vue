<template>
  <div :style="containerStyle">
    <mobile-view :store="store" :params="store.mobileField" checkable></mobile-view>
  </div>
</template>
<script>
import MobileView from "../super-view/view";
export default {
  components: { MobileView },
  props: {
    store: Object,
  },
  computed: {
    containerStyle() {
      return {
        height: `${this.store.tableHeight + 30}px`,
      };
    },
  },
};
</script>
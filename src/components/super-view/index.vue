<template>
  <div></div>
</template>
<script>
import View from "./view";
import SuperViewStore from "./store";
export default {
  components: { View },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      store: null,
      watchFun: [],
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      const { viewAuth, useCloumn, source } = this.params;

      if (this.watchFun.length) {
        this.watchFun.forEach((f) => f());
        this.watchFun = [];
      }

      this.store = new SuperViewStore({
        $vue: this,
      });

      this.store.analyzeAuthView(viewAuth, []);

      this.makeKeys();
      await this.store.initialize(source, useCloumn);
      await this.store.fetchStatus();
    },
    makeKeys() {
      const { defKeys, defComplexity } = this.params;
      this.store.makeDefkeys({ defKeys, defComplexity });
    },
  },
};
</script>
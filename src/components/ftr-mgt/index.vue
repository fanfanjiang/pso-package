<template>
  <div class="pso-frtmgt" v-if="store">
    <div class="pso-frtmgt-l">
      <main-view :store="store"></main-view>
    </div>
    <div class="pso-frtmgt-r">
      <div class="pso-frtmgt-t">
        <main-designer :store="store"></main-designer>
      </div>
      <div class="pso-frtmgt-b">
        <sub-view :store="store"></sub-view>
      </div>
    </div>
  </div>
</template>
<script>
import MainView from "./main";
import MainDesigner from "./main-designer";
import SubView from "./sub";
import FTRStore from "./store";
export default {
  components: { MainView, MainDesigner, SubView },
  data() {
    return {
      store: null,
    };
  },
  created() {
    this.store = new FTRStore({ $vue: this });
  },
  methods: {},
};
</script>
<style lang="less">
</style>
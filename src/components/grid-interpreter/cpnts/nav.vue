<template>
  <div class="pso-grid-entrance" style="background: #fff">
    <template v-if="cpnt.data.menus.length">
      <div class="pso-grid-entrance__item" v-for="(m, i) in cpnt.data.menus" :key="i" @click="analyzeMenu(m.v)">
        <span :class="m.icon"></span>
        <div class="pso-grid-entrance__item-title">{{ m.n }}</div>
      </div>
    </template>
    <pso-empty v-else></pso-empty>
  </div>
</template>
<script>
import { BaseMixin } from "../mixin";
import { analyzeMenu } from "../../../tool/app";
export default {
  mixins: [BaseMixin],
  data() {
    return {
      initializing: true,
    };
  },
  methods: {
    async analyzeMenu(menu_code) {
      if (!menu_code) return;
      await analyzeMenu({ menu_code, uid: this.$store.state.base.user.user_id, router: this.$router });
    },
  },
};
</script>

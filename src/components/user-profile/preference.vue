<template>
  <div>
    <div class="action-color-picker">
      <span v-for="(t, i) in THEMES" :key="i" :class="{ active: t === theme }" :style="getColorStyle(t)" @click="changeTheme(t)">
        <i class="el-icon-check"></i>
      </span>
    </div>
  </div>
</template>
<script>
const themes = require("../../theme-config");

export default {
  data() {
    this.THEMES = themes.map((t) => t.name);
    return {};
  },
  computed: {
    theme() {
      return this.$store.state.base.appConfig.theme;
    },
  },
  methods: {
    getColorStyle(theme) {
      return {
        background: `#${theme}`,
      };
    },
    changeTheme(theme) {
      this.$store.commit("APP_SET_APPCONFIG", { theme });
    },
  },
};
</script>
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  created() {
    $("body")
      .removeClass()
      .addClass(`pso-theme-2D8CF0`);
  }
};
</script>
<style lang="less">
html,
body {
  height: 100%;
  width: 100%;
  background-color: #fff !important;
  position: relative;
  font-variant: tabular-nums;
  font-feature-settings: "tnum";
  color: #2b3441;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue",
    Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-variant: tabular-nums;
}
#app {
  height: 100%;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(73, 73, 73, 0.33);
  border: 2px solid #fff;
  border-radius: 8px;
}
::-webkit-scrollbar {
  -webkit-appearance: none;
}
</style>
<template>
  <div class="Lay-setting">
    <div class="header">
      <el-tabs v-model="curTab">
        <el-tab-pane label="基本设置" name="base"></el-tab-pane>
        <el-tab-pane label="样式" name="theme"></el-tab-pane>
        <el-tab-pane label="社会化登录" name="social"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="body">
      <div style="padding:30px">
        <base-set v-if="curTab === 'base'"></base-set>
        <social v-if="curTab === 'social'"></social>
        <theme-set v-if="curTab === 'theme'"></theme-set>
      </div>
    </div>
  </div>
</template>
<script>
import BaseSet from "./base";
import Social from "./social";
import ThemeSet from "./theme";
export default {
  components: { BaseSet, Social, ThemeSet },
  data() {
    return {
      curTab: "base",
    };
  },
};
</script>

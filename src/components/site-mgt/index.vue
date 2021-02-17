<template>
  <div style="height: 100%; background: #fff">
    <div style="height: 50px; display: flex; align-items: center; padding-left: 15px">
      <button-tabs v-model="curTab" :data="TABS"></button-tabs>
    </div>
    <div style="height: calc(100% - 50px)">
      <site-view v-if="curTab === 0"></site-view>
      <site-level v-if="curTab === 1"></site-level>
    </div>
  </div>
</template>
<script>
import SiteLevel from "./level";
import SiteView from "./site-view";
import ButtonTabs from "../button-tabs";
const TABS = [{ label: "站点配置" }, { label: "站点等级配置" }];

export default {
  components: { SiteView, SiteLevel, ButtonTabs },
  props: {},
  data() {
    this.TABS = TABS;
    return {
      curTab: 0,
    };
  },
};
</script>

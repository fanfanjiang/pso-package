<template>
  <div class="pso-view-withtop">
    <div class="pso-view-top">
      <button-tabs v-model="curTab" :data="TABS"></button-tabs>
    </div>
    <knowl-view :treeable="false" :searchType="curTab + 4" :opable="false" :resid="resid" :searchable="false"></knowl-view>
  </div>
</template>
<script>
import ButtonTabs from "../button-tabs";
const TABS = [{ label: "收藏记录" }, { label: "分享记录" }];

export default {
  components: { ButtonTabs, KnowlView: () => import("./view") },
  props: {
    params: {
      type: Object,
      default: () => ({ data_type: "", mgtable: false }),
    },
    opable: {
      type: Boolean,
      default: true,
    },
    resid: {
      type: String,
      default: "",
    },
  },
  data() {
    this.TABS = TABS;
    return {
      curTab: 0,
    };
  },
};
</script>
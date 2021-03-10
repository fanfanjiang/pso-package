<template>
  <div class="pso-view-withtop">
    <div class="pso-view-top" v-if="!mgtable">
      <button-tabs v-model="curTab" :data="TABS"></button-tabs>
    </div>
    <knowl-view
      :treeable="curTab === 0"
      :searchType="curTab"
      :opable="curTab === 0 && opable"
      :redcheckable="curTab === 0 && opable"
      :collectable="(curTab === 0 || curTab === 1) && opable && !mgtable"
      :data_type="params.data_type"
      :mgtable="mgtable"
      @select="$emit('select', $event)"
    ></knowl-view>
  </div>
</template>
<script>
import ButtonTabs from "../button-tabs";
import KnowlView from "./view";
const TABS = [{ label: "资料中心" }, { label: "我收藏的" }, { label: "我分享的" }, { label: "分享给我的" }];

export default {
  components: { ButtonTabs, KnowlView },
  props: {
    params: {
      type: Object,
      default: () => ({ data_type: "", mgtable: false }),
    },
    treeable: {
      type: Boolean,
      default: true,
    },
    opable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    mgtable() {
      return !!this.params.mgtable && this.params.mgtable !== "0";
    },
  },
  data() {
    if (this.mgtable) {
      this.TABS = [{ label: "资料管理" }];
    } else {
      this.TABS = TABS;
    }
    return {
      curTab: 0,
    };
  },
};
</script>
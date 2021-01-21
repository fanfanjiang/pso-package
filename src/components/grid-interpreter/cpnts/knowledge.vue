<template>
  <pso-grid-wrapper ref="wrapper" :cpnt="cpnt" @checkmore="checkmore">
    <common-info :list="list" latest latest-text="最近更新" n="name" v="total" unit="篇"></common-info>
  </pso-grid-wrapper>
</template>
<script>
import CommonInfo from "../common-info";
import { BaseMixin } from "../mixin";
export default {
  components: { CommonInfo },
  mixins: [BaseMixin],
  data() {
    return {
      initializing: false,
      list: [],
    };
  },
  async created() {
    this.initializing = true;
    const ret = await this.API.getKnowl();
    this.list = ret.data;
    this.initializing = false;
  },
};
</script>

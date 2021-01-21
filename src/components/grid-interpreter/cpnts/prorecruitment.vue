<template>
  <pso-grid-wrapper ref="wrapper" :cpnt="cpnt" @checkmore="checkmore">
    <common-info :list="list"></common-info>
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
      list: [
        { n: "招聘职位", v: 0 },
        { n: "面试人员", v: 0 },
      ],
    };
  },
  async created() {
    const ret = await this.API.getJob();
    this.list[0].v = ret.data.advert.length;
    this.list[1].v = ret.data.inter.length;
  },
};
</script>

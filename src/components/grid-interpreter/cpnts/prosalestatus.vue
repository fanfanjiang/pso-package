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
      group: {
        总数: 0,
        跟踪中: 0,
        已签订: 0,
        报备中: 0,
      },
    };
  },
  computed: {
    list() {
      const list = [];
      for (let key in this.group) {
        list.push({ n: key, v: this.group[key] });
      }
      return list;
    },
  },
  async created() {
    const ret = await this.API.getStatisticData({ tp_code: "P000001627405567", leaf_auth: 4 });
    if (ret.success && ret.data.DATA) {
      const group = _.groupBy(ret.data.DATA, "status_name");
      for (let key in group) {
        if (this.group.hasOwnProperty(key)) {
          this.group[key] = group[key].length;
          this.group["总数"] += this.group[key];
        }
      }
    }
  },
  methods: {
    checkmore() {
      this.$refs.wrapper.checkmore();
    },
  },
};
</script>

<template>
  <pso-grid-wrapper ref="wrapper" :cpnt="cpnt" @checkmore="checkmore">
    <pso-super-view ref="view" v-show="false" :params="cpnt.data" :urine="cpnt.urine" @data-loaded="loadHandler"></pso-super-view>
    <pso-super-detail v-if="data" :instance="data" :fv-store="store" :params="cpnt.data"></pso-super-detail>
  </pso-grid-wrapper>
</template>
<script>
import { BaseMixin } from "../mixin";
export default {
  mixins: [BaseMixin],
  data() {
    return {
      store: null,
      data: null,
    };
  },
  methods: {
    loadHandler(data) {
      if (data.length) {
        this.data = data[0];
        this.store = this.$refs.view.store;
      }
    },
  },
};
</script>

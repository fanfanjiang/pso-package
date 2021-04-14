<template>
  <div class="attach-view">
    <template v-if="!fileDemanding">
      <pso-file-list
        v-if="data.length && !picmode"
        :files="data"
        :remove="false"
        :check="check"
        :downloadable="downloadable"
      ></pso-file-list>
      <template v-if="picmode">
        <img :src="d.url" alt="img" v-for="(d, i) in data" :key="i" />
      </template>
    </template>
    <pso-skeleton v-else :lines="1"></pso-skeleton>
  </div>
</template>
<script>
import PsoFileList from "../file-list/index.vue";
import { Resource } from "../../mixin/resource";

export default {
  components: { PsoFileList },
  mixins: [Resource],
  props: {
    ids: [Array, String],
    splitSymbol: {
      type: String,
      default: ",",
    },
    downloadable: {
      type: Boolean,
      default: true,
    },
    check: {
      type: Boolean,
      default: true,
    },
    picmode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      data: [],
    };
  },
  watch: {
    ids: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.initialize();
        }
      },
    },
  },
  methods: {
    async initialize() {
      //检查是id还是地址
      this.data = await this.fetchAndMakeAttach(this.ids, this.splitSymbol);
      this.$emit("initialized", this.data);
    },
  },
};
</script>
<style lang="less">
.attach-view {
  height: 100%;
  width: 100%;
}
</style>
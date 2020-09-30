<template>
  <div class="attach-view">
    <template v-if="!initializing">
      <pso-file-list v-if="data.length" :files="data" :remove="false"></pso-file-list>
    </template>
    <pso-skeleton v-else :lines="1"></pso-skeleton>
  </div>
</template>
<script>
import PsoFileList from "../file-list/index.vue";
import { makeFiles } from "../../tool/file";

export default {
  components: { PsoFileList },
  props: {
    ids: [Array, String],
  },
  data() {
    return {
      initializing: false,
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
      const ids = typeof this.ids === "string" ? this.ids : this.ids.join(",");
      this.initializing = true;
      const ret = await this.API.file({ data: { ids }, method: "get" });
      this.initializing = false;
      makeFiles({ files: ret.data, urlField: "res_path", nameField: "res_name" });
      this.data = ret.data;
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
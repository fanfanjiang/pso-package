<template>
  <div style="height: 100%" v-loading="initializing">
    <pso-common-view :headable="false" ref="view" title="" icon="el-icon-tickets" :selectable="false" :fetch-fun="fetch" :fields="FIELDS">
    </pso-common-view>
  </div>
</template>
<script>
import { FetchMixin } from "../../mixin/view";

export default {
  mixins: [FetchMixin],
  data() {
    this.FIELDS = [
      { v: "a", n: "EXCEL名称" },
      { v: "b", n: "上传时间" },
    ];
    return {
      ID: "change_word",
      clicked: null,
      fetchParams: {
        change_word: "",
      },
    };
  },
  created() {},
  methods: {
    async fetch(data = {}) {
      return { success: true, data: { data: [], page: 0 } };
    },
  },
};
</script>

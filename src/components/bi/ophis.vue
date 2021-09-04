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
      { v: "a", n: "操作时间 " },
      { v: "b", n: "操作者 " },
      { v: "c", n: "帐号 " },
      { v: "d", n: "操作类型" },
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

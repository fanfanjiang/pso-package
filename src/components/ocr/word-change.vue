<template>
  <div style="height: 100%" v-loading="initializing">
    <pso-common-view
      ref="view"
      title="纠正词"
      icon="el-icon-tickets"
      :selectable="false"
      :fetch-fun="fetch"
      :fields="FIELDS"
      :row-style-fun="rowStyleFun"
      @rowclick="onRowClick"
    >
      <template #tablefun> </template>
      <template #datafun> </template>
    </pso-common-view>
  </div>
</template>
<script>
import { FetchMixin } from "../../mixin/view";

export default {
  mixins: [FetchMixin],
  data() {
    this.FIELDS = [{ v: "change_word", n: "纠正词" }];
    return {
      ID: "auto_no",
      clicked: null,
    };
  },
  created() {},
  methods: {
    async fetch(data = {}) {
      const ret = await this.API.request("/api/ocr/word/group", {
        data: { ...this.getFetchParams(data), page: data.start },
        method: "get",
      });
      return ret;
    },
    onRowClick(data) {
      this.clicked = data;
      this.$emit("rowclick", data.change_word); 
    },
    rowStyleFun(row) {
      if (this.clicked && this.clicked.change_word === row.change_word) {
        return { "background-color": "#DCF1FF" };
      }
    },
  },
};
</script>

<template>
  <div style="height: 100%" v-loading="initializing">
    <pso-common-view :headable="false" ref="view" title="" icon="el-icon-tickets" :selectable="false" :fetch-fun="fetch" :fields="FIELDS">
    </pso-common-view>
  </div>
</template>
<script>
import { FetchMixin } from "../../../mixin/view";

export default {
  mixins: [FetchMixin],
  data() {
    this.FIELDS = [
      { v: "a", n: "时间 " },
      { v: "b", n: "数值 " },
      { v: "c", n: "同比时间 " },
      { v: "d", n: "同比数值" },
      { v: "e", n: "环比时间" },
      { v: "f", n: "环比数值" },
      { v: "g", n: "结论" },
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
      return { 
        success: true,
        data: {
          data: [
            { a: "2021-01", b: "280", c: "2020-01", d: "168", e: "2020-12", f: "260", g: "同比异常，环比正常" },
            { a: "2021-02", b: "176", c: "2020-01", d: "234", e: "2020-02", f: "260", g: "同比异常，环比正常" },
            { a: "2021-03", b: "345", c: "2020-01", d: "123", e: "2020-03", f: "260", g: "同比异常，环比正常" },
            { a: "2021-04", b: "345", c: "2020-01", d: "215", e: "2020-04", f: "260", g: "同比异常，环比正常" },
            { a: "2021-05", b: "124", c: "2020-01", d: "212", e: "2020-05", f: "260", g: "同比异常，环比正常" },
            { a: "2021-06", b: "123", c: "2020-01", d: "123", e: "2020-06", f: "260", g: "同比异常，环比正常" },
          ],
          page: 0,
        },
      };
    },
  },
};
</script>

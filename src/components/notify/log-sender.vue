<template>
  <div style="height: 100%">
    <pso-common-view
      ref="view"
      title="消息发送情况"
      icon="el-icon-tickets"
      :selectable="false"
      :fields="FIELDS"
      :fetch-fun="fetch"
      :row-style-fun="rowStyleFun"
      @rowclick="onRowClick"
    >
      <template #tablefun>
        <pso-search text="发送人" v-model="fetchParams.sender_name"></pso-search>
        <el-divider direction="vertical"></el-divider>
        <pso-search text="标题" v-model="fetchParams.msg_title"></pso-search>
        <el-divider direction="vertical"></el-divider>
        <pso-search text="数据ID" v-model="fetchParams.data_id"></pso-search>
        <el-divider direction="vertical"></el-divider>
        <el-date-picker
          size="mini"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          v-model="fetchParams.msg_time"
        >
        </el-date-picker>
        <el-divider direction="vertical"></el-divider>
      </template>
    </pso-common-view>
  </div>
</template>
<script>
import { FetchMixin } from "../../mixin/view";
export default {
  mixins: [FetchMixin],
  data() {
    this.FIELDS = [
      { v: "msg_title", n: "标题" },
      { v: "msg_time", n: "发送日期", w: 200, aln: "center" },
      { v: "sender_name", n: "发送人", w: 200, aln: "center" },
    ];
    return {
      clicked: null,
      fetchParams: {
        msg_id: "",
        sender_name: "",
        data_id: "",
        msg_title: "",
        msg_time: [],
      },
    };
  },
  methods: {
    async fetch(data) {
      return await this.API.notification({ data: this.getFetchParams(data) });
    },
    onRowClick(data) {
      this.clicked = data;
      this.$emit("rowclick", data.msg_id);
    },
    rowStyleFun(row) {
      if (this.clicked && this.clicked.msg_id === row.msg_id) {
        return { "background-color": "#DCF1FF" };
      }
    },
  },
};
</script>
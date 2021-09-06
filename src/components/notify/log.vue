

<template>
  <div class="ocr-word">
    <div class="ocr-word-l">
      <log-sender ref="wordchange" @rowclick="onChange"></log-sender>
    </div>
    <div class="ocr-word-r">
      <pso-common-view
        ref="view"
        title="接收情况"
        icon="el-icon-tickets"
        :selectable="false"
        :fetch-fun="fetch"
        :fields="FIELDS"
        :slots="SLOTS"
      >
        <template #tablefun>
          <pso-search text="接收人" v-model="fetchParams.msg_receiver"></pso-search>
          <el-divider direction="vertical"></el-divider>
        </template>
        <template v-slot:op="{ data }">
          <el-button plain type="primary" size="mini" @click="onClickShit(data.row)">查看</el-button>
        </template>
      </pso-common-view>
    </div>
  </div>
</template>
<script>
import { FetchMixin } from "../../mixin/view";
import LogSender from "./log-sender";
const TYPE = { 0: "未读", 8: "已读" };

export default {
  components: { LogSender },
  mixins: [FetchMixin],
  data() {
    this.FIELDS = [
      { v: "user_name", n: "送达人", w: 110, aln: "center" },
      { v: "msg_status", n: "接收状态", w: 180, aln: "center", trans: (v) => TYPE[v] },
      { v: "msg_time", n: "接收时间", aln: "center" },
    ];
    this.SLOTS = [{ n: "操作", v: "op", w: 80 }];
    return {
      words: [],
      fetchParams: {
        msg_id: "",
        msg_receiver: "",
      },
    };
  },
  created() {},
  methods: {
    async fetch(data = {}) {
      return await this.API.notification({ data: this.getFetchParams(data) });
    },
    onChange(data) {
      console.log(data);
      this.fetchParams.msg_id = data;
    },
    onClickShit(data) {},
  },
};
</script>
<style lang="less">
.ocr-word {
  display: flex;
  height: 100%;
  .ocr-word-l {
    width: 50%;
  }
  .ocr-word-r {
    width: 50%;
  }
}
</style>


<template>
  <div class="pso-wf-executor__overview">
    <div class="pso-wf-executor__overview-item" v-if="!isNew">
      <div class="pso-wf-executor__overview-item__title">
        <i class="el-icon-s-claim"></i>
        <span>编号</span>
      </div>
      <span>{{wfExecutor.data.fileCode}}</span>
    </div>
    <div class="pso-wf-executor__overview-item" v-if="wfExecutor.curStep">
      <div class="pso-wf-executor__overview-item__title">
        <i class="el-icon-info"></i>
        <span>流程状态</span>
      </div>
      <span>{{wfExecutor.curStep.name}}</span>
    </div>
    <div class="pso-wf-executor__overview-item">
      <div class="pso-wf-executor__overview-item__title">
        <i class="el-icon-s-custom"></i>
        <span>申请人</span>
      </div>
      <span v-if="!isNew">{{wfExecutor.data.creator_name}}</span>
      <span v-else>{{platform.user.user_name}}</span>
    </div>
    <div class="pso-wf-executor__overview-item">
      <div class="pso-wf-executor__overview-item__title">
        <i class="el-icon-time"></i>
        <span>申请时间</span>
      </div>
      <span v-if="!isNew">{{wfExecutor.data.ctime}}</span>
      <span v-else>{{applicationTime}}</span>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import dayjs from "dayjs";
import { raf, cancelRaf } from "@/utils/raf";

export default {
  data() {
    return {
      realTime: 0,
      countId: ""
    };
  },
  computed: {
    ...mapState(["wfExecutor", "platform"]),
    isNew() {
      return !this.wfExecutor.data.instanceId;
    },
    applicationTime() {
      return dayjs(this.realTime).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  watch: {
    "wfExecutor.data.instanceId"(val) {
      if (!val) this.count();
    }
  },
  created() {
    this.count();
  },
  destroyed() {
    if (this.countId) cancelRaf(this.countId);
  },
  methods: {
    count() {
      if (!this.isNew && this.countId) return cancelRaf(this.countId);
      this.countId = raf(() => {
        this.realTime = Date.now();
        this.count();
      });
    }
  }
};
</script>

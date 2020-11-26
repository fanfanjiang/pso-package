<template>
  <div class="pso-wf-executor__overview">
    <div class="pso-wf-executor__overview-item" v-if="!isNew">
      <div class="pso-wf-executor__overview-item__title">
        <i class="el-icon-s-claim"></i>
        <span>编号</span>
      </div>
      <span>{{ store.data.fileCode }}</span>
    </div>
    <div class="pso-wf-executor__overview-item" v-if="store.curStep">
      <div class="pso-wf-executor__overview-item__title">
        <i class="el-icon-info"></i>
        <span>流程状态</span>
      </div>
      <span>{{ store.curStep.name }}</span>
    </div>
    <div class="pso-wf-executor__overview-item">
      <div class="pso-wf-executor__overview-item__title">
        <i class="el-icon-s-custom"></i>
        <span>申请人</span>
      </div>
      <span v-if="!isNew">{{ store.data.creator_name }}</span>
      <span v-else>{{ store.curUser.user_nick }}</span>
    </div>
    <div class="pso-wf-executor__overview-item">
      <div class="pso-wf-executor__overview-item__title">
        <i class="el-icon-time"></i>
        <span>申请时间</span>
      </div>
      <span v-if="!isNew">{{ store.data.ctime }}</span>
      <span v-else>{{ applicationTime }}</span>
    </div>
    <div class="pso-wf-executor__overview-item" v-if="store.data.curUsernames">
      <div class="pso-wf-executor__overview-item__title">
        <i class="el-icon-s-check"></i>
        <span>当前审核人</span>
      </div>
      <span>{{ store.data.curUsernames }}</span>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { raf, cancelRaf } from "../../utils/raf";

export default {
  props: {
    store: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      realTime: 0,
      countId: "",
    };
  },
  computed: {
    isNew() {
      return !this.store.data.instanceId;
    },
    applicationTime() {
      return dayjs(this.realTime).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  watch: {
    "store.data.instanceId"(val) {
      if (!val) this.count();
    },
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
    },
  },
};
</script>

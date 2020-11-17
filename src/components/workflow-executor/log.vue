<template>
  <div class="pso-wf-executor__log">
    <el-timeline>
      <el-timeline-item v-for="(log, i) of store.log" :key="i" :timestamp="log.op_time + '  ' + (log.step_name || '提交')" placement="top">
        <div class="pso-wf-executor__log-item">
          <p>
            <span class="pso-wf-executor__log-item-user">{{ log.user_name }}</span>
            <span v-if="log.step_code === 'start' && i === 0">创建了记录：</span>
            <span v-else-if="log.step_code === 'start'">重新提交了记录：</span>
            <span v-else>发表审核意见：</span>
            {{ log.op_note }}
          </p>
          <p v-if="log.att_id">
            <pso-attachment :ids="log.att_id"></pso-attachment>
          </p>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
import PsoAttachment from "../attachment";
export default {
  components: { PsoAttachment },
  props: {
    store: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
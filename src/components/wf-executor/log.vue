<template>
  <div class="pso-wf-executor__log">
    <el-timeline>
      <el-timeline-item
        v-for="(log,index) of store.log"
        :key="index"
        :timestamp="log.op_time"
        placement="top"
      >
        <el-card>
          <h4>{{log.step_name}}</h4>
          <p>操作人：{{log.user_name}}</p>
          <p>评论：{{log.op_note}}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
export default {
  props: {
    store: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
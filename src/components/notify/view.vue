<template>
  <div class="pso-notify-view">
    <div class="pso-notify-view__body">
      <div class="pso-notify-item" v-for="(d, i) in store.instances" :key="i">
        <div class="pso-notify-item__body">
          <pso-avatar size="small" :nick="d.msg_sender === '1' ? '系统' : d.sender_name"></pso-avatar>
          <div class="pso-notify-item__content">
            {{ d.msg_body || "" }}
          </div>
          <div class="pso-notify-item__tail">
            <span v-if="d.msg_time">{{ formatTime(d.msg_time) }}</span>
            <template>
              <el-tooltip content="已读" placement="top-start" :visible-arrow="false" :open-delay="500" :hide-after="2000">
                <div class="pso-notify-item__btn"><i class="el-icon-check"></i></div>
              </el-tooltip>
              <el-tooltip content="执行" placement="top-start" :visible-arrow="false" :open-delay="500" :hide-after="2000">
                <div class="pso-notify-item__btn"><i class="el-icon-d-arrow-right"></i></div>
              </el-tooltip>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { makeTimeAgo } from "../../utils/util";
export default {
  props: {
    store: Object,
  },
  methods: {
    formatTime(time) {
      return makeTimeAgo(time);
    },
  },
};
</script>
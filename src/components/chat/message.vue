<template>
  <div :class="msgClass">
    <div class="pso-chat-msg__avatar">
      <pso-avatar size="small" :nick="message.user_name"></pso-avatar>
    </div>
    <div class="pso-chat-msg__content">
      <div class="pso-chat-msg__header">
        <span class="pso-chat-msg__name">{{ message.user_name }}</span>
        <span class="pso-chat-msg__time">{{ formatTime(message.com_time) }}</span>
        <transition name="el-fade-in">
          <i class="el-icon-loading" v-if="message.submitting"></i>
        </transition>
      </div>
      <div class="pso-chat-msg__body">
        <div class="pso-chat-msg__text" v-show="message.com_content">{{ message.com_content }}</div>
        <div class="pso-chat-msg__attach" v-if="message.att_id">
          <pso-attachment :ids="message.att_id"></pso-attachment>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PsoAttachment from "../attachment";
import dayjs from "dayjs";
export default {
  components: { PsoAttachment },
  props: {
    message: Object,
    store: Object,
  },
  computed: {
    msgClass() {
      return {
        "pso-chat-msg__reverse": this.message.com_user === this.store.curUser.user_id,
        "pso-chat-msg": true,
      };
    },
  },
  methods: {
    formatTime(time) {
      if (dayjs().isSame(time, "D")) {
        return `今天 ${time.split(" ")[1]}`;
      } else if (dayjs().subtract(1, "d").isSame(time, "D")) {
        return `昨天 ${time.split(" ")[1]}`;
      } else {
        return time;
      }
    },
  },
};
</script>
<template>
  <div class="pso-notify-item__body" @mouseenter="hovered = true" @mouseleave="hovered = ''">
    <span v-if="data.msg_status === 0" class="pso-notify-item__dot"></span>
    <pso-avatar size="small" :nick="data.msg_sender === '1' ? '系统' : data.sender_name"></pso-avatar>
    <div class="pso-notify-item__r">
      <div class="pso-notify-item__content">
        {{ data.msg_body || "" }}
      </div>
      <div class="pso-notify-item__tail">
        <transition name="el-fade-in-linear" mode="out-in">
          <span v-if="data.msg_time && !hovered">{{ formatTime(data.msg_time) }}</span>
          <div v-if="hovered">
            <el-button v-if="data.msg_status === 0" size="mini" round @click="updateNoti">已读</el-button>
            <el-button v-if="data.data_id || data.msg_url" size="mini" type="primary" round @click="checkAction"> 执行 </el-button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import { makeTimeAgo } from "../../utils/util";
export default {
  props: {
    store: Object,
    data: Array,
  },
  data() {
    return {
      hovered: false,
      updating: false,
      acting: false,
    };
  },
  created() {},
  methods: {
    formatTime(time) {
      return makeTimeAgo(time);
    },
    async updateNoti() {
      if (this.updating) return;
      this.updating = true;
      await this.store.update(this.data);
      this.$emit("read", this.data);
      this.updating = false;
    },
    async checkAction() {
      if (this.acting) return;
      this.acting = true;
      if (this.data.msg_status === 0) {
        await this.store.update(this.data);
      }
      await this.store.checkAction(this.data);
      this.acting = false;
    },
  },
};
</script>
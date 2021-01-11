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
            <el-tooltip content="设置已读" placement="top-end" :visible-arrow="false" :open-delay="200">
              <div v-if="data.msg_status === 0" class="pso-notify-item__btn" @click="updateNoti"><i class="el-icon-check"></i></div>
            </el-tooltip>
            <el-tooltip content="执行" placement="top-end" :visible-arrow="false" :open-delay="200">
              <div v-if="data.data_id || data.msg_url" class="pso-notify-item__btn" @click="checkAction">
                <i class="el-icon-d-arrow-right"></i>
              </div>
            </el-tooltip>
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
      this.updating = false;
    },
    async checkAction() {
      if (this.acting) return;
      this.acting = true;
      if (this.data.msg_status === 0) {
        this.store.update(this.data);
      }
      await this.store.checkAction(this.data);
      this.acting = false;
    },
  },
};
</script>
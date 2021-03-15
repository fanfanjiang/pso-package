<template>
  <el-popover
    v-model="show"
    placement="bottom-end"
    transition="el-zoom-in-top"
    :width="width"
    popper-class="pso-popover-notify"
    trigger="click"
  >
    <div class="pso-notify-panel">
      <div class="pso-notify-panel__header">
        <div class="pso-notify-panel__header-l">
          <span>消息</span>
        </div>
        <div class="pso-notify-panel__header-r">
          <el-tooltip content="查看更多" placement="top-end" :visible-arrow="false" :open-delay="200">
            <div class="pso-notify-item__btn" @click="checkMore"><i class="el-icon-more"></i></div>
          </el-tooltip>
        </div>
      </div>
      <notify-view v-if="store" :store="store"></notify-view>
    </div>
    <div class="pso-notify-trigger" slot="reference">
      <el-tooltip effect="dark" content="消息" placement="bottom-end">
        <el-badge v-if="store" :value="store.unread" :hidden="!store.unread">
          <i class="el-icon-bell"></i>
        </el-badge>
      </el-tooltip>
    </div>
  </el-popover>
</template>
<script>
import Store from "./store";
import NotifyView from "./view";

export default {
  components: { NotifyView },
  props: {},
  data() {
    return {
      store: null,
      show: false,
    };
  },
  computed: {
    width() {
      return this.__isMobile__ ? "100%" : "440";
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.store = new Store({ $vue: this });
    },
    checkMore() {
      this.$router.push({ name: "notify" });
      this.show = false;
    },
  },
};
</script>
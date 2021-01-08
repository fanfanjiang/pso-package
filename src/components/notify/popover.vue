<template>
  <el-popover placement="bottom-end" transition="el-zoom-in-top" width="440" popper-class="pso-popover-notify" trigger="click">
    <div class="pso-notify-panel">
      <notify-view v-if="store" :store="store"></notify-view>
    </div>
    <div class="pso-notify-trigger" slot="reference">
      <el-badge v-if="store" :value="store.instances.length" :hidden="!store.instances.length">
        <i class="el-icon-bell"></i>
      </el-badge>
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
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.store = new Store({ $vue: this });
      this.store.fetch();
    },
  },
};
</script>
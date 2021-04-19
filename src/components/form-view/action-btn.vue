<template>
  <el-button
    class="action-btn"
    size="mini"
    :style="{ 'background-color': action.color, 'border-color': action.color, color: '#fff' }"
    :disabled="(checkable && !checkActionable(action)) || action.doing"
    :loading="action.doing"
    @click="checkAction(action)"
  >
    <i v-if="action.icon" :class="action.icon"></i> {{ action.name }}
    <el-tooltip v-if="action.remark" class="item" effect="dark" placement="top-end">
      <div slot="content" v-html="action.remark"></div>
      <i class="el-icon-question"></i>
    </el-tooltip>
  </el-button>
</template>
<script>
export default {
  props: {
    action: Object,
    store: Object,
    data: Array,
    checkable: {
      type: Boolean,
      default: true,
    }
  },
  methods: {
    checkAction(action) {
      if (action.mode === "2") return;
      this.$emit("click", action);
    },
    checkActionable(action) {
      return this.store.actionMGR.checkActionable(action, this.data || this.store.selectedList);
    },
  },
};
</script>
<style lang="less">
.action-btn {
  position: relative;
  &:hover,
  &.is-disabled {
    opacity: 0.5;
  }
  .el-icon-question {
    position: absolute;
    top: -2px;
    right: -10px;
    color: #000;
    opacity: 1;
    font-size: 20px;
  }
}
</style>
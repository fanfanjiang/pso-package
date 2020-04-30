<template>
  <div class="actor-wrapper">
    <div class="actor-label">
      <span
        :class="{'actor-title':true,'require':cpnt.data._required === '1'}"
      >{{cpnt.data._fieldName}}</span>
    </div>
    <div class="actor-body">
      <div
        :class="{'actor-content':true,'flex-row-center-between':true,'actor-content--border':border}"
      >
        <span v-if="placeholder">{{showValue}}</span>
        <slot></slot>
      </div>
      <el-tooltip v-if="cpnt.data._fieldInfo" effect="dark" placement="top-start">
        <div slot="content">{{cpnt.data._fieldInfo}}</div>
        <i class="tip el-icon-question"></i>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
export default {
  name: "pso-common-actor",
  props: {
    cpnt: {
      type: Object
    },
    border: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showValue() {
      return this.cpnt.data._defaultValue || this.cpnt.data._placeholder;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
<style lang="less">
.actor-wrapper {
  display: flex;
  align-items: center;
  padding-bottom: 15px;
  .actor-label {
    width: 90px;
    .actor-title {
      color: #666;
      position: relative;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      padding-left: 10px;
      &.require::after {
        content: "*";
        position: absolute;
        left: 0px;
        color: #e36464;
        top: 3px;
      }
    }
  }
  .actor-body {
    flex: 1 1;
    display: flex;
    align-items: center;
    .tip {
      width: 30px;
      color: #666;
      text-align: center;
    }
  }
  .actor-content {
    height: 38px;
    padding: 0 15px;
    flex: 1 1;
    > span {
      line-height: 38px;
      color: #999;
    }
    &.actor-content--border {
      border: 1px solid #cccccc;
    }
  }
}
</style>
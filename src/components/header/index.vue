<template>
  <div class="pso-common-header flex-row-center-between">
    <div class="pso-common-header__left flex-row-center">
      <div class="pso-common-header__left__back" @click="$emit('back')">
        <i class="el-icon-back"></i>
        <span>返回</span>
      </div>
      <span class="pso-common-header__left__split">|</span>
      <span class="pso-common-header__left__title">{{title}}</span>
    </div>
    <slot></slot>
    <div class="pso-common-header__right flex-row-center">
      <slot name="btn"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/less/variable";
.pso-common-header {
  height: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  padding: 0 10px;
  z-index: 2;
  position: relative;
  @{deep} .fa {
    width: 12px;
    height: 12px;
    & + span {
      margin-left: 5px;
    }
  }
}
.pso-common-header__left__back {
  cursor: pointer;
  i {
    margin-right: 3px;
  }
}
.pso-common-header__left__split {
  color: #e7e7e7;
  margin: 0 15px;
}
.pso-common-header__left__title {
  font-size: 16px;
}
</style>
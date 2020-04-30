<template>
  <div class="actor-panel-header">
    <div class="actor-panel-header__title">
      <span :class="icon"></span>
      <span>{{name}}</span>
    </div>
    <div class="actor-panel-header__info">{{info}}</div>
  </div>
</template>
<script>
export default {
  props: ["icon", "name", "info"]
};
</script>
<style lang="less" scoped>
.actor-panel-header {
  padding: 15px;
  background-color: #f1f2f3;
  margin-bottom: 20px;
  border-radius: 10px;
  .actor-panel-header__title {
    > span:first-child {
      color: #999;
      margin-right: 10px;
    }
    > span:last-child {
      font-size: 16px;
      color: #666;
      font-weight: bold;
    }
  }
  .actor-panel-header__info {
    font-size: 12px;
    color: #999;
    margin-top: 20px;
  }
}
</style>
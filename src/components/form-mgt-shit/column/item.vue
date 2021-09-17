<template>
  <div class="pso-card-item">
    <div class="pso-card-item-header">
      <div class="pso-card-item-header-l">
        <i class="el-icon-picture"></i>
        <span>{{ instance.name }}</span>
      </div>
      <div class="pso-card-item-header-r"></div>
    </div>
    <div class="pso-card-item-body">
      <div class="pso-card-item-content">
        <div>
          <span>视图顶部动作</span>
          <span>无</span>
        </div>
        <div>
          <span>表格记录动作</span>
          <span>无</span>
        </div>
        <div>
          <span>移动端模板</span>
          <span>默认</span>
        </div>
      </div>
      <div class="pso-card-item-action">
        <div class="pso-card-item-action-l"></div>
        <div class="pso-card-item-action-r">
          <el-button size="small" icon="el-icon-edit-outline" @click="$emit('edit')">编辑</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    instance: Object,
  },
};
</script>
<style lang="less">
.pso-card-item {
  margin-bottom: 10px;
  border: 1px solid #e3e3e3;
  transition: all 0.2s ease-in;
  &:hover {
    box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease-in;
  }
  .pso-card-item-header {
    height: 40px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    background: #1b9aee;
    color: #fff;
    i {
      margin-right: 3px;
    }
  }
  .pso-card-item-body {
    .pso-card-item-content {
      height: 100px;
      overflow: auto;
      padding: 10px;
      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        & + div {
          margin-top: 3px;
        }

        span {
          &:nth-child(1) {
            color: #666;
          }
          &:nth-child(2) {
            color: #000;
          }
        }
      }
    }
    .pso-card-item-action {
      height: 50px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
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
      <div class="pso-card-item-content"></div>
      <div class="pso-card-item-action">
        <div class="pso-card-item-action-l"></div>
        <div class="pso-card-item-action-r">
          <el-button size="mini" icon="el-icon-edit-outline" @click="$emit('edit')">编辑</el-button>
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
  border: 1px solid #f0f0f0;
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
    height: 110px;
    .pso-card-item-content {
      height: 70px;
      overflow: auto;
    }
    .pso-card-item-action {
      height: 40px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
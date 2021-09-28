<template>
  <div class="pso-card-item">
    <div class="pso-card-item-header">
      <div class="pso-card-item-header-l">
        <i class="el-icon-picture"></i>
        <span>{{ instance.apply_name }}</span>
      </div>
      <div class="pso-card-item-header-r"></div>
    </div>
    <div class="pso-card-item-body">
      <div class="pso-card-item-content">
        <div>
          <span>应用地址</span>
          <span>{{ instance.apply_link }}</span>
        </div>
      </div>
      <div class="pso-card-item-action">
        <div class="pso-card-item-action-l"></div>
        <div class="pso-card-item-action-r">
          <el-button style="margin-left: 10px" size="mini" icon="el-icon-connection" @click="$emit('edit')">安装</el-button>
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

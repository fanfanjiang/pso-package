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
          <el-popconfirm
            confirmButtonText="确定"
            cancelButtonText="取消"
            icon="el-icon-info"
            iconColor="red"
            title="你确定要删除吗？"
            @confirm="$emit('remove')"
          >
            <el-button slot="reference" size="mini" plain type="danger" icon="el-icon-delete">删除</el-button>
          </el-popconfirm>
          <el-button style="margin-left:10px" size="mini" icon="el-icon-edit-outline" @click="$emit('edit')">编辑</el-button>
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

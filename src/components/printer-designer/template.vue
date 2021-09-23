<template>
  <div class="pso-card-item">
    <div class="pso-card-item-header">
      <div class="pso-card-item-header-l">
        <i class="el-icon-picture"></i>
        <span v-if="!editing">{{ data.name }}</span>
        <el-input v-else size="mini" v-model="data.name"></el-input>
      </div>
      <div class="pso-card-item-header-r">
        <i v-if="!editing" class="el-icon-edit" style="cursor: pointer" @click="editing = true"></i>
        <i v-else class="el-icon-check" style="cursor: pointer" @click="editName"></i>
      </div>
    </div>
    <div class="pso-card-item-body">
      <div class="pso-card-item-content">
        <div>
          <span>数据源</span>
          <span>{{ data.source === "1" ? "表单" : "统计脚本" }}</span>
        </div>
        <div>
          <span>模板</span>
          <span>{{ data.type === "1" ? "通用模板" : "富文本模板" }}</span>
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
          <el-button style="margin-left: 10px" size="mini" icon="el-icon-edit-outline" @click="$emit('edit')">编辑</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    removeable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      editing: false,
    };
  },
  methods: {
    editName() {
      if (!this.data.name) {
        return;
      }
      this.$emit("save");
      this.editing = false;
    },
  },
};
</script>

<template>
  <div class="ptemplate-item" @click="$emit('click')">
    <div class="ptemplate-item-t">
      <slot name="top">
        <span>数据源：{{ data.source === "1" ? "表单" : "统计脚本" }}</span>
        <span>模板：{{ data.type === "1" ? "通用模板" : "富文本模板" }}</span>
        <span>模式：{{ data.mode === "1" ? "关联表自增" : "主表自增" }}</span>
      </slot>
    </div>
    <div class="ptemplate-item-b">
      <slot>
        <div class="title">{{ data.name }}</div>
        <div v-if="removeable">
          <el-dropdown size="small" @command="commandHandler">
            <span class="el-dropdown-link"><i class="el-icon-more el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="remove">移除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </slot>
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
  methods: {
    commandHandler(command) {
      this.$emit("command", command);
    },
  },
};
</script>
<style lang="less">
.ptemplate-item {
  min-height: 140px;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease-in;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  &:hover {
    box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease-in;
  }
  .ptemplate-item-t {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .ptemplate-item-b {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-weight: bold;
    }
  }
}
</style>
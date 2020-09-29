<template>
  <el-dropdown size="small" trigger="click">
    <el-button type="primary" size="mini" :disabled="disabled">{{ text }}</el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(data, i) in options" :key="i" :disabled="!data.available">
        <el-popconfirm
          v-if="data.available"
          confirmButtonText="确定"
          cancelButtonText="取消"
          icon="el-icon-info"
          iconColor="red"
          :title="makeSureText(data.name)"
          @onConfirm="$emit('change', data)"
        >
          <span slot="reference">{{ data.name }}</span>
        </el-popconfirm>
        <template v-else>{{ data.name }}</template>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
export default {
  props: {
    text: String,
    disabled: Boolean,
    options: Array,
  },
  methods: {
    makeSureText(str) {
      return `你确认要修改到${str}吗？`;
    },
  },
};
</script>
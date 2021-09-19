<template>
  <div class="rule-practice">
    <div class="rule-practice-body">
      <div class="rule-practice-item" v-for="(d, i) in data" :key="i">
        <div class="rule-practice-item-header">
          <span>{{ PRACTICE[d.cid] }}</span>
          <i class="el-icon-close" @click="onRemove(i)"></i>
        </div>
        <practice-proxy :instance="d" :store="store"></practice-proxy>
      </div>
    </div>
    <div class="rule-practice-add">
      <el-dropdown size="medium" trigger="click" @command="onAdd">
        <el-button class="el-dropdown-link" size="small" icon="el-icon-plus">添加动作</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(v, k) in PRACTICE" :key="k" :command="k">{{ v }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import PracticeProxy from "./practice-proxy.vue";

const PRACTICE = {
  show: "显示表单字段",
  hide: "隐藏表单字段",
  required: "必填表单字段",
  checkbox: "显示表单字段选项",
  color: "高亮视图表格",
  colhide: "隐藏视图列",
  banedit: "禁止编辑视图列",
};

export default {
  components: { PracticeProxy },
  props: {
    data: Array,
    store: Object,
  },
  data() {
    this.PRACTICE = PRACTICE;
    return {};
  },
  methods: {
    onAdd(command) {
      this.data.push({ id: psodataid(), cid: command });
    },
    onRemove(index) {
      this.data.splice(index, 1);
    },
  },
};
</script>
<style lang="less">
.rule-practice-item {
  padding: 15px;
  background: #ecf5ff;
  & + .rule-practice-item {
    margin-top: 10px;
  }
  .el-select {
    width: 100%;
  }
  .rule-practice-item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    i {
      font-size: 22px;
      color: #f56c6c;
      cursor: pointer;
    }
    span {
      font-size: 15px;
      color: #000;
    }
  }
}
.rule-practice-add {
  margin-top: 10px;
}
</style>
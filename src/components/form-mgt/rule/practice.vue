<template>
  <div class="rule-practice">
    <div class="rule-practice-body">
      <div class="rule-practice-item" v-for="(d, i) in data" :key="i">
        <div>{{ PRACTICE[d.cid] }}</div>
        <practice-proxy :instance="d" :store="store"></practice-proxy>
      </div>
    </div>
    <div class="rule-practice-add">
      <el-dropdown size="mini" trigger="click" @command="onAdd">
        <el-button class="el-dropdown-link" size="mini" icon="el-icon-plus">添加动作</el-button>
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
  checkbox: "隐藏“选择”字段选项",
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
      this.data.push({ cid: command });
    },
  },
};
</script>
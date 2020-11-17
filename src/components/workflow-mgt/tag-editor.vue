<template>
  <el-popover placement="right" width="300" trigger="click" v-model="showTag" :key="data.tagType">
    <el-input v-model="tagVal" placeholder="请输入内容"></el-input>
    <div class="pso-wftag-crl">
      <el-button @click="showTag=false" size="mini">取 消</el-button>
      <el-button type="primary" @click="addTagText(data)" size="mini">提 交</el-button>
    </div>
    <el-button slot="reference" size="mini">添加文本</el-button>
  </el-popover>
</template>
<script>
export default {
  props: ["data"],
  data() {
    return {
      showTag: false,
      tagVal: ""
    };
  },
  methods: {
    addTagText() {
      this.showTag = false;
      this.$emit("confirm", this.tagVal);
    }
  }
};
</script>
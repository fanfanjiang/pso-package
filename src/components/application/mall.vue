<template>
  <div class="apps-mall">
    <h2>应用市场</h2>
    <el-row :gutter="10">
      <el-col :xs="8" :sm="8" :md="6" v-for="(d, i) in data" :key="i">
        <app-item :instance="d" @install="install(d)"></app-item>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import AppItem from "./app-item";
export default {
  components: { AppItem },
  data() {
    return {
      data: [],
    };
  },
  async created() {
    const ret = await this.API.request("/api/application", { method: "get" });
    this.data = ret.data.data;
  },
  methods: {
    async install() {},
  },
};
</script>
<style lang="less">
.apps-mall {
  height: 100%;
  width: 100%;
  padding: 20px;
  background: #fff;
  h2 {
    margin-top: 0;
  }
}
</style>
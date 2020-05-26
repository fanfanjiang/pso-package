<template>
  <div class="pso-tp-statistics">
    <el-form ref="form" label-width="80px">
      <el-form-item label="数据源">
        <el-input v-model="source"></el-input>
      </el-form-item>
      <el-form-item label="约束">
        <el-input v-model="restrain"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveTp">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ["node"],
  data() {
    return {
      source: "",
      restrain: ""
    };
  },
  created() {},
  methods: {
    async saveTp() {
      const ret = await this.API.templates({
        data: { tp_code: this.node.node_name, route_setting: this.restrain, data_list: this.source },
        method: "put"
      });
    }
  }
};
</script>
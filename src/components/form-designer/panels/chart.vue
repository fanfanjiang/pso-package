<template>
  <div>
    <panel-header :icon="cpnt.CPNT.icon" :name="cpnt.CPNT.name" :info="'图表'"></panel-header>
    <el-form :label-position="'top'" label-width="80px" :model="cpnt.data">
      <el-form-item label="选择图表">
        <el-select v-model="cpnt.data._defaultValue" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.tp_code"
            :label="item.tp_name"
            :value="item.tp_code"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import panelHeader from "../common/panel-header";

export default {
  props: ["cpnt"],
  components: {
    panelHeader
  },
  data() {
    return {
      options: []
    };
  },
  created() {
    this.getcharts();
  },
  methods: {
    async getcharts() {
      let ret = await this.API.templates({ data: { tp_type: "0", id_leaf: 1 }, method: "get" });
      this.options = ret.data;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
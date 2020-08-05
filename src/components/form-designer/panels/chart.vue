<template>
  <div>
    <panel-header :icon="cpnt.CPNT.icon" :name="cpnt.CPNT.name" :info="'图表'"></panel-header>
    <el-form :label-position="'top'" label-width="80px" :model="cpnt.data">
      <el-form-item label="选择图表">
        <el-select v-model="cpnt.data._defaultValue" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.node_name"
            :label="item.node_display"
            :value="item.node_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="高度">
        <el-input-number size="mini" v-model="cpnt.data._height" :min="0"></el-input-number>
      </el-form-item>
    </el-form>
  </div> 
</template>
<script>
import panelHeader from "../common/panel-header";

export default {
  props: ["cpnt"],
  components: {
    panelHeader,
  },
  data() {
    return {
      options: [],
    };
  },
  created() {
    this.getcharts();
  },
  methods: {
    async getcharts() {
      this.options = await this.API.getTempleteTree([3]);
    },
  },
};
</script>
<style lang="less" scoped>
</style>
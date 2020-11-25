<template>
  <el-form label-position="left" label-width="150px">
    <el-form-item label="标签名称">
      <el-input size="mini" v-model="data.tag_name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="标签类型">
      <el-select size="mini" v-model="data.tag_type" @change="handleTypeChange">
        <el-option v-for="item in tagTypes" :key="item.v" :label="item.n" :value="item.v"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="排序">
      <el-input-number size="mini" v-model="data.tag_serial" controls-position="right" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="描述">
      <el-input size="mini" v-model="data.tag_note" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="规则" v-if="data.tag_type === 'common'">
      <el-input size="mini" v-model="data.tag_rule" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item v-if="data.tag_type === 'flag'" label="标签颜色" style="display: flex; align-items: center">
      <el-color-picker v-model="data.tag_rule" size="mini" :predefine="predefineColors"></el-color-picker>
    </el-form-item>
    <plugin-setter :data="data.tag_set" :node="data" field="tag_source"></plugin-setter>
  </el-form>
</template> 
<script>
import PluginSetter from "../plugin-setter";

export default {
  components: { PluginSetter },
  props: ["data"],
  data() {
    return {
      tagTypes: [
        {
          n: "常规标签",
          v: "common",
        },
        {
          n: "查询标签",
          v: "searchtag",
        },
        {
          n: "旗帜标签",
          v: "flag",
        },
      ],
      predefineColors: ["#ff4500", "#ff8c00", "#ffd700", "#90ee90", "#00ced1", "#1e90ff", "#c71585"],
    };
  },
  created() {
    if (!this.data.tag_set) {
      this.$set(this.data, "tag_set", []);
    }
  },
  methods: {
    handleTypeChange(val) {
      if (val === "searchtag") {
        this.data.tag_rule = [];
      } else {
        this.data.tag_rule = "";
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../assets/less/variable";
@{deep} {
  .el-form-item {
    display: flex;
    align-items: center;
  }
  .el-form-item__content {
    display: flex;
    align-items: center;
    margin-left: 0 !important;
  }
}
</style>
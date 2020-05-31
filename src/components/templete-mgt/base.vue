<template>
  <el-form label-position="left" label-width="80px">
    <el-form-item label="插件名称">
      <el-input size="small" v-model="node.node_display" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="插件类型">
      <el-select size="small" v-model="node.tp_type">
        <el-option v-for="item in tpTypes" :key="item.value" :label="item.name" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="插件地址">
      <el-input size="small" v-model="node.tp_route" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="组件">
      <el-input size="small" v-model="node.tp_component" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="数据源" v-if="node.tp_type===tpTypes[1].value">
      <el-input size="small" :rows="8" type="textarea" v-model="node.data_list"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: ["node"],
  data() {
    return {
      tpTypes: [
        {
          name: "页面插件",
          value: 0
        },
        {
          name: "统计插件",
          value: 1
        }
      ]
    };
  }
};
</script>
<template>
  <el-form label-position="left" label-width="80px">
    <el-form-item label="标签名称">
      <el-input size="mini" v-model="data.tag_name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="标签类型">
      <el-select size="mini" v-model="data.tag_type">
        <el-option v-for="item in tagTypes" :key="item.v" :label="item.n" :value="item.v"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="排序">
      <el-input-number size="mini" v-model="data.tag_serial" controls-position="right" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="描述">
      <el-input size="mini" v-model="data.tag_note" autocomplete="off"></el-input>
    </el-form-item> 
    <el-form-item label="规则" v-if="data.tag_type!=='searchtag'">
      <el-input size="mini" v-model="data.tag_rule" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="是否计量">
      <el-switch v-model="data.tag_meter" :active-value="1" :inactive-value="0"></el-switch>
    </el-form-item>
    <plug-set :data="data.tag_set" :node="data" @change="handleTagChange" field="tag_source"></plug-set>
  </el-form>
</template> 
<script>
import PlugSet from "../menu-mgt/plug-set";

export default {
  components: { PlugSet },
  props: ["data"],
  data() {
    return {
      tagTypes: [
        {
          n: "常规标签",
          v: "common",
        },
        {
          n: "计量标签",
          v: "calculate",
        },
        {
          n: "查询标签",
          v: "searchtag",
        },
      ],
    };
  },
  computed: {},
  methods: {
    handleTagChange(data) {
      this.data.tag_set = data;
    },
  },
};
</script>
<template>
  <div class="plugin-setter" v-loading="initializing">
    <el-form label-position="right" label-width="140px" v-if="!initializing">
      <el-form-item label="选择插件">
        <el-select size="small" filterable v-model="node[field]" clearable @change="pluginChangeHandler">
          <el-option v-for="(t, i) in templetes" :key="i" :label="t.node_display" :value="t.node_name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <setter v-if="node[field]" :node="node" :code="node[field]" :data="data"></setter>
  </div>
</template>
<script>
import Setter from "./setter";
export default {
  components: { Setter },
  props: {
    data: Array,
    node: Object,
    field: String,
    filter: Array,
  },
  data() {
    return {
      initializing: true,
      templetes: [],
    };
  },
  async created() {
    this.initializing = true;
    this.templetes = await this.API.getTempleteTree(this.filter);
    this.initializing = false;
  },
  methods: {
    async pluginChangeHandler() {
      this.data.splice(0, this.data.length - 1);
    },
  },
};
</script>
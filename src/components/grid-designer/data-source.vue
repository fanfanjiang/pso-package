<template>
  <div class="data-source">
    <div style="text-align: right">
      <el-button size="mini" type="success" @click="showDeisgner.show = true">脚 本</el-button>
      <el-button size="mini" type="success" @click="getColumn">生成列表</el-button>
    </div>
    <div></div>
    <sql-designer :opener="showDeisgner" :sql="source" :names="['DATA']"></sql-designer>
  </div>
</template>
<script>
import SqlDesigner from "../sql-designer";
export default {
  components: { SqlDesigner },
  props: {
    source: Array,
    id: String,
  },
  data() {
    return {
      showDeisgner: { show: false },
    };
  },
  methods: {
    async getColumn() {
      const ret = await this.API.getPluginModuleColumn({ child_id: this.id });
    },
  },
};
</script>
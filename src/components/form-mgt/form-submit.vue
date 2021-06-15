<template>
  <div>
    <el-button size="mini" type="primary" plain @click="showDeisgner.show = true">编辑脚本</el-button>
    <sql-designer :opener="showDeisgner" :scode="code" :sql="data"></sql-designer>
  </div>
</template>
<script>
import SqlDesigner from "../sql-designer";
export default {
  components: { SqlDesigner },
  props: ["data", "code"],
  data() {
    return {
      showDeisgner: { show: false },
    };
  },
};
</script>
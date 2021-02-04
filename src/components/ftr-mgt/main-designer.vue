<template>
  <div>
    <el-form label-position="left" label-width="90px" size="small">
      <el-form-item label="配置名称">
        <el-input v-model="data.solr_name" size="mini" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="配置核心">
        <el-input v-model="data.solr_core" size="mini" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="链接"> 
        <el-input v-model="data.solr_link" size="mini" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="脚本">
        <el-button size="mini" type="success" @click="showDeisgner.show = true">设计脚本</el-button>
      </el-form-item>
    </el-form>
    <div style="text-align: right">
      <el-button size="mini" type="primary" @click="$emit('save', data)">保存</el-button>
    </div>
    <sql-designer :opener="showDeisgner" :sql="proxy"></sql-designer>
  </div>
</template> 
<script>
import SqlDesigner from "../sql-designer";
const BASE = {
  solr_id: "",
  solr_name: "",
  solr_core: "",
  solr_link: "",
  solr_script: "",
};
export default {
  components: { SqlDesigner },
  data() {
    return {
      showDeisgner: { show: false },
      proxy: [],
      data: { ...BASE },
    };
  },
  watch: {
    "showDeisgner.show": {
      handler(value) {
        if (!value) {
          this.data.solr_script = JSON.stringify(this.proxy);
        }
      },
    },
  },
  methods: {
    extandData(extend) {
      if (!extend) {
        extend = { ...BASE };
      }
      this.proxy = [];
      this.data = extend;
      if (this.data.solr_script) {
        this.proxy = JSON.parse(this.data.solr_script);
      }
    },
  },
};
</script>
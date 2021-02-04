<template>
  <div>
    <el-form label-position="left" label-width="110px" size="small">
      <el-form-item label="配置名称" required>
        <el-input v-model="data.child_name" size="mini" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="配置类型" required>
        <el-select clearable size="small" v-model="data.child_type">
          <el-option v-for="(t, i) in TYPES" :key="i" :label="t.n" :value="t.v"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择类型">
        <el-radio v-model="data.child_status" :label="0">关闭</el-radio>
        <el-radio v-model="data.child_status" :label="1">开启</el-radio>
      </el-form-item>
      <el-form-item label="配置内容">
        <el-input v-model="data.child_content" size="mini" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="配置数据">
        <el-button size="mini" type="success" @click="showDeisgner.show = true">设计脚本</el-button>
      </el-form-item>
      <el-form-item label="配置字段">
        <el-input v-model="data.child_field" size="mini" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <sql-designer :opener="showDeisgner" :sql="proxy" @gencolumn="gencolumn"></sql-designer>
  </div>
</template> 
<script>
import { formatJSONList } from "../../utils/util";
import SqlDesigner from "../sql-designer";
const BASE = {
  child_id: "",
  solr_id: "",
  child_name: "",
  child_type: "Common",
  child_content: "",
  child_status: 1,
  child_data: "",
  child_field: "",
};
export default {
  components: { SqlDesigner },
  props: {
    data: Object,
  },
  data() {
    this.TYPES = [
      { n: "通用", v: "Common" },
      { n: "瑞迪斯", v: "Redis" },
      { n: "脚本", v: "Script" },
    ];
    return {
      showDeisgner: { show: false },
      proxy: [],
    };
  },
  watch: {
    "showDeisgner.show": {
      handler(value) {
        if (!value) {
          this.data.child_data = JSON.stringify(this.proxy);
        }
      },
    },
  },
  created() {
    formatJSONList([this.data], BASE);
    if (this.data.child_type === "Script" && this.data.child_data) {
      this.proxy = JSON.parse(this.data.child_data);
    }
  },
  methods: {
    gencolumn(column) {
      this.data.child_content = JSON.stringify(column.map(({ display, field }) => ({ display, field })));
    },
  },
};
</script>
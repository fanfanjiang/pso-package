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
      <el-form-item label="配置数据">
        <el-button size="mini" type="success" @click="showDeisgner.show = true">设计脚本</el-button>
      </el-form-item>
      <el-form-item label="配置字段">
        <el-input v-model="data.child_field" size="mini" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="data.child_url" size="mini" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number size="mini" v-model="data.child_order" controls-position="right"></el-input-number>
      </el-form-item>
    </el-form>
    <great-panel :padding="10">
      <template #header>
        <i class="el-icon-s-operation"></i>
        <span>字段配置</span>
      </template>
      <div style="text-align: right">
        <el-button type="success" size="mini" @click="syncHandler">同步字段</el-button>
      </div>
      <el-table border size="mini" height="300" style="width: 100%; margin-top: 5px" :data="columnProxy">
        <el-table-column type="index" label="序号" :index="1" width="50" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field" label="字段" width="110">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.field"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="titled" label="是否标题" width="120" align="center">
          <template slot-scope="scope">
            <el-switch size="mini" v-model="scope.row.titled" active-value="1" inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="titled" label="显示" width="120" align="center">
          <template slot-scope="scope">
            <el-switch size="mini" v-model="scope.row.show"></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </great-panel>
    <sql-designer :opener="showDeisgner" :sql="proxy" @gencolumn="gencolumn"></sql-designer>
  </div>
</template> 
<script>
import { formatJSONList } from "../../utils/util";
import SqlDesigner from "../sql-designer";
import GreatPanel from "../great-panel";
const BASE = {
  child_id: "",
  solr_id: "",
  child_name: "",
  child_type: "Common",
  child_content: "",
  child_status: 1,
  child_data: "",
  child_field: "",
  child_order: 0,
  child_url: "",
};
export default {
  components: { GreatPanel, SqlDesigner },
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
      syncing: false,
      showDeisgner: { show: false },
      proxy: [],
      columnProxy: [],
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
    columnProxy: {
      deep: true,
      handler(value) {
        this.data.child_content = JSON.stringify(value);
      },
    },
  },
  created() {
    formatJSONList([this.data], BASE);
    if (this.data.child_type === "Script" && this.data.child_data) {
      this.proxy = JSON.parse(this.data.child_data);
    }
    if (this.data.child_content) {
      this.columnProxy = JSON.parse(this.data.child_content);
    }
  },
  methods: {
    gencolumn(column) {
      if (!this.syncing) return;
      this.syncing = false;
      this.showDeisgner.show = false;
      this.columnProxy = column.map(({ display, field }) => ({ name: display, field, titled: "0", show: true }));
    },
    syncHandler() {
      this.syncing = true;
      this.showDeisgner.show = true;
    },
  },
};
</script>
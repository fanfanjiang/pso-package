<template>
  <div>
    <div class="pso-table-controller">
      <el-button size="mini" @click="$emit('save')">保存</el-button>
      <el-button size="mini" type="primary" plain @click="addHandler">添加属性</el-button>
    </div>
    <el-table key="status" :data="data" style="width: 100%">
      <el-table-column label="状态值" width="160">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.value" controls-position="right" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="显示名称" width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.name" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="显示颜色" align="center" width="100">
        <template slot-scope="scope">
          <el-color-picker size="mini" v-model="scope.row.color"></el-color-picker>
        </template>
      </el-table-column>
      <el-table-column label="显示方式" width="140">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.display">
            <el-option label="仅自身文字" value="1"></el-option>
            <el-option label="整行文字" value="2"></el-option>
            <el-option label="整行背景色" value="3"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="goDesigner(scope.$index)">设计脚本</el-button>
          <el-button size="mini" type="danger" @click="delHandler(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pso-dialog title="设计脚本" :visible="showDeisgner" width="80%" @close="showDeisgner=false">
      <div style="padding:20px;height:100%;overflow: auto;">
        <sql-designer :sql="curSql" :params="fields" params-n="field_display" params-v="field_name"></sql-designer>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import SqlDesigner from "../sql-designer";
export default {
  components: { SqlDesigner },
  props: ["data", "fields"],
  data() {
    return {
      curSql: null,
      showDeisgner: false,
    };
  },
  created() {
    this.data.forEach((item) => {
      if (typeof item.script === "string") {
        item.script = [];
      }
      Object.assign({ value: "", name: "", color: "", display: "", script: [], ...item });
    });
  },
  methods: {
    goDesigner(index) {
      this.curSql = this.data[index].script;
      this.showDeisgner = true;
    },
    addHandler() {
      this.data.push({ value: "", name: "", color: "", display: "", script: [] });
    },
    delHandler(index) {
      this.data.splice(index, 1);
    },
  },
};
</script>
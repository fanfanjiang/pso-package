<template>
  <div>
    <el-table key="status" :data="data" style="width: 100%">
      <el-table-column label="状态值" width="100" prop="name"></el-table-column>
      <el-table-column label="执行脚本">
        <template slot-scope="scope">
          {{scope.row.script}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="goDesigner(scope.$index)">设计脚本</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pso-dialog title="设计脚本" :visible="showDeisgner" width="70%" @close="showDeisgner=false">
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
      showDeisgner: false,
      curSql: null,
      statuses: [
        { status: 0, name: "待提交", script: [] },
        { status: 1, name: "审批中", script: [] },
        { status: 2, name: "已退回", script: [] },
        { status: 7, name: "已撤销", script: [] },
        { status: 8, name: "已完成", script: [] },
        { status: 9, name: "已归档", script: [] },
      ],
    };
  },
  created() {
    this.statuses.forEach((item) => {
      const exist = _.findIndex(this.data, { status: item.status });
      if (exist === -1) {
        this.data.push({ ...item });
      } else {
        if (typeof this.data[exist] === "string") {
          this.data[exist] = [];
        }
        this.data.splice(exist, 1, { ...item, ...this.data[exist] });
      }
    });
  },
  methods: {
    goDesigner(index) {
      this.curSql = this.data[index].script;
      this.showDeisgner = true;
    },
  },
};
</script>
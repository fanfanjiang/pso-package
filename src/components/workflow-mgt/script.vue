<template>
  <div style="margin-top: 20px">
    <el-table border size="mini" key="status" :data="data" style="width: 100%">
      <el-table-column label="状态值" prop="name"></el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="goDesigner(scope.$index)">设计脚本</el-button>
        </template>
      </el-table-column>
    </el-table>
    <sql-designer :opener="showDeisgner" :scode="code" :sql="curSql"></sql-designer>
  </div>
</template> 
<script>
import SqlDesigner from "../sql-designer";
export default {
  components: { SqlDesigner },
  props: ["data", "fields", "code"],
  data() {
    return {
      showDeisgner: { show: false },
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
        if (typeof this.data[exist].script === "string") {
          this.data[exist].script = [];
        }
        this.data.splice(exist, 1, { ...item, ...this.data[exist] });
      }
    });
  },
  methods: {
    goDesigner(index) {
      this.curSql = this.data[index].script;
      this.showDeisgner.show = true;
    },
  },
};
</script>
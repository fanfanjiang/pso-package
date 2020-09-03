<template>
  <div>
    <el-table key="status" :data="data" style="width: 100%">
      <el-table-column label="状态值" width="100" prop="name"></el-table-column>
      <el-table-column label="执行脚本">
        <template slot-scope="scope">
          <el-input type="textarea" :row="8" size="small" v-model="scope.row.script" placeholder></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: ["data"],
  data() {
    return {
      statuses: [
        { status: 0, name: "待提交", script: "" },
        { status: 1, name: "审批中", script: "" },
        { status: 2, name: "已退回", script: "" },
        { status: 7, name: "已撤销", script: "" },
        { status: 8, name: "已完成", script: "" },
        { status: 9, name: "已归档", script: "" },
      ],
    };
  },
  created() {
    this.statuses.forEach((item) => {
      const exist = _.findIndex(this.data, { status: item.status });
      if (exist === -1) {
        this.data.push({ ...item });
      } else {
        this.data.splice(exist, 1, { ...item, ...this.data[exist] });
      }
    });
  },
};
</script>
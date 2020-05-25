<template>
  <div class="pso-view-page">
    <div class="pso-page-body__tab">
      <el-tabs v-model="curTab">
        <el-tab-pane label="参数设置" name="param"></el-tab-pane>
        <el-tab-pane label="权限设置" name="auth"></el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="curTab==='param'">
      <el-button size="small" type="primary" plain @click="addViewParam">添加参数</el-button>
      <el-button size="small" type="primary" plain @click="saveViewParam">保存</el-button>
      <el-table :data="paramsData" style="width: 100%" key="param">
        <el-table-column label="参数字段">
          <template slot-scope="scope">
            <el-input v-model="scope.row.field" size="small" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label="控件类型">
          <template slot-scope="scope">
            <el-input v-model="scope.row.picker" size="small" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label="默认值">
          <template slot-scope="scope">
            <el-input v-model="scope.row.vaule" size="small" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="delViewPageParam(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="curTab==='auth'">
      <pso-nodeauth :node="node"></pso-nodeauth>
    </div>
  </div>
</template>
<script>
export default {
  props: ["node"],
  data() {
    return {
      curTab: "param",
      paramsData: []
    };
  },
  watch: {
    "node.node_id": {
      immediate: true,
      handler() {
        console.log(this.node);
        if (this.node.route_setting) {
          this.paramsData = JSON.parse(this.node.route_setting);
        }
      }
    }
  },
  methods: {
    addViewParam() {
      this.paramsData.push({
        field: "",
        vaule: "",
        picker: ""
      });
    },
    delViewParam(index) {
      this.paramsData.splice(index, 1);
    },
    async saveViewParam() {
      const ret = await this.API.templates({
        data: { tp_code: this.node.node_name, route_setting: JSON.stringify(this.paramsData) },
        method: "put"
      });
    }
  }
};
</script>
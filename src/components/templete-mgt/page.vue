<template>
  <div class="pso-view-page">
    <div class="pso-page-body__tab">
      <el-tabs v-model="curTab">
        <el-tab-pane label="参数设置" name="param"></el-tab-pane>
        <el-tab-pane label="权限设置" name="auth"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="pso-view-page__param" v-if="curTab==='param'" v-loading="savingParam">
      <el-button size="small" type="primary" plain @click="addViewParam">添加参数</el-button>
      <el-button size="small" type="primary" plain @click="saveViewParam">保存</el-button>
      <el-table :data="paramsData" style="width: 100%" key="param">
        <el-table-column label="参数名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" size="small" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label="参数字段">
          <template slot-scope="scope">
            <el-input v-model="scope.row.field" size="small" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label="控件类型">
          <template slot-scope="scope">
            <el-select v-model="scope.row.picker" size="small">
              <el-option v-for="item in TP_CTL_TYPE" :key="item.v" :label="item.n" :value="item.v"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="默认值">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value" size="small" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="delViewParam(scope.$index)">删除</el-button>
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
import { TP_CTL_TYPE } from "../../const/menu";

export default {
  props: ["node"],
  data() {
    return {
      curTab: "param",
      paramsData: [],
      TP_CTL_TYPE: TP_CTL_TYPE,
      savingParam: false
    };
  },
  watch: {
    "node.node_id": {
      immediate: true,
      handler() {
        this.checkParam();
      }
    },
    "node.route_setting": {
      immediate: true,
      handler() {
        this.checkParam();
      }
    }
  },
  methods: {
    addViewParam() {
      this.paramsData.push({
        field: "",
        value: "",
        picker: "",
        name: ""
      });
    },
    delViewParam(index) {
      this.paramsData.splice(index, 1);
    },
    async saveViewParam() {
      this.savingParam = true;
      const ret = await this.API.templates({
        data: { tp_code: this.node.node_name, route_setting: JSON.stringify(this.paramsData) },
        method: "put"
      });
      this.$notify({ title: ret.success ? "保存成功" : "保存失败", type: ret.success ? "success" : "warning" });
      this.savingParam = false;
    },
    checkParam() {
      if (this.node.route_setting) {
        this.paramsData = JSON.parse(this.node.route_setting);
      } else {
        this.paramsData = [];
      }
    }
  }
};
</script>
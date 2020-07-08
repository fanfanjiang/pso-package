<template>
  <div>
    <el-button size="mini" type="primary" plain @click="addParam">添加参数</el-button>
    <el-table :data="data" style="width: 100%" key="param">
      <el-table-column label="参数名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" size="mini" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="参数字段">
        <template slot-scope="scope">
          <el-input v-model="scope.row.field" size="mini" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="控件类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.picker" size="mini" clearable>
            <el-option v-for="item in TP_CTL_TYPE" :key="item.v" :label="item.n" :value="item.v"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="关联参数">
        <template slot-scope="scope">
          <el-select v-model="scope.row.relateParam" size="mini" clearable>
            <el-option
              v-for="item in data"
              :key="item.field"
              :label="item.name"
              :value="item.field"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="默认值">
        <template slot-scope="scope">
          <el-input v-model="scope.row.value" size="mini" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain @click="delParam(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { TP_CTL_TYPE } from "../../const/menu";

export default {
  props: ["data"],
  data() {
    return {
      TP_CTL_TYPE: TP_CTL_TYPE
    };
  },
  created() {
    this.data.forEach(d => {
      d = Object.assign(
        {
          field: "",
          value: "",
          picker: "",
          name: "",
          relateParam: ""
        },
        d
      );
    });
  },
  methods: {
    addParam() {
      this.data.push({
        field: "",
        value: "",
        picker: "",
        name: "",
        relateParam: ""
      });
    },
    delParam(index) {
      this.data.splice(index, 1);
    }
  }
};
</script>
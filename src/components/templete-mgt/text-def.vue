<template>
  <div>
    <el-button size="mini" type="primary" plain @click="addParam">添加参数</el-button>
    <el-table :data="data" style="width: 100%" key="param">
      <el-table-column label="文本名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" size="mini" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="文本ID">
        <template slot-scope="scope">
          <el-input v-model="scope.row.id" size="mini" placeholder></el-input>
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
export default {
  props: ["data"],
  data() {
    return {};
  },
  methods: {
    addParam() {
      this.data.push({
        id: "",
        name: "",
        value: ""
      });
    },
    delParam(index) {
      this.data.splice(index, 1);
    }
  }
};
</script>
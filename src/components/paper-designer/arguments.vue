<template>
  <div>
    <div class="pso-table-controller">
      <el-button size="mini" type="primary" plain @click="addHandler">添加参数</el-button>
    </div>
    <el-table key="status" border size="mini" :data="store.paperConfig.args" style="width: 100%">
      <el-table-column label="参数">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.arg" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="别名">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.alias" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="模拟值">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.mock" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="delHandler(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
const DATA = {
  arg: "",
  alias: "",
  mock: "",
};
export default {
  props: {
    store: Object,
  },
  methods: {
    addHandler() {
      this.store.paperConfig.args.push({ ...DATA });
    },
    delHandler(index) {
      this.store.paperConfig.args.splice(index, 1);
    },
  },
};
</script>
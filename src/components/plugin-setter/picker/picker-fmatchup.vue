<template>
  <div>
    <el-button style="margin-bottom: 10px" size="mini" type="primary" plain @click="addParam">添加参数</el-button>
    <el-table border size="mini" :data="data" style="width: 100%">
      <el-table-column type="index" label="序号" :index="1" width="50" align="center"></el-table-column>
      <el-table-column prop="field" label="源字段" align="center">
        <template slot-scope="scope">
          <el-select filterable clearable size="mini" v-model="scope.row.src">
            <el-option v-for="(s, i) in sources" :key="i" :label="s.fieldDisplay" :value="s.field_name"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="field" label="目标字段" align="center">
        <template slot-scope="scope">
          <el-select filterable clearable size="mini" v-model="scope.row.trg">
            <el-option v-for="(s, i) in targets" :key="i" :label="s.fieldDisplay" :value="s.field_name"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" plain @click="delHandler(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table> 
  </div>
</template>
<script>
export default {
  props: {
    sources: Array,
    targets: Array,
    data: Array,
  },
  methods: {
    addParam() {
      this.data.push({ src: "", trg: "" });
    },
    delHandler(index) {
      this.data.splice(index, 1);
    },
  },
};
</script>
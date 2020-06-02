<template>
  <div>
    <el-button size="mini" type="primary" plain @click="handleAdd">添加列</el-button>
    <el-table key="list" :data="data" style="width: 100%" height="300">
      <el-table-column type="index" :index="1"></el-table-column>
      <el-table-column label="字段">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.field" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="显示名名称">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.name" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="列宽">
        <template slot-scope="scope">
          <el-input-number
            size="small"
            v-model="scope.row.width"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="显示" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.show" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="统计" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.cal" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="对齐方式">
        <template slot-scope="scope">
          <el-select size="small" v-model="scope.row.align">
            <el-option label="居中" value="center"></el-option>
            <el-option label="居左" value="left"></el-option>
            <el-option label="居右" value="right"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="顺序">
        <template slot-scope="scope">
          <el-input-number
            size="small"
            v-model="scope.row.number"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain @click="handleDel(scope.$index)">删除</el-button>
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
    handleAdd() {
      this.data.push({
        field: "",
        name: "",
        width: 120,
        show: "1",
        cal: "0",
        align: "left",
        number: 0
      });
    },
    handleDel(index) {
      this.data.splice(index, 1);
    }
  }
};
</script>
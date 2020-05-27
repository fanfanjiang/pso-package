<template>
  <div>
    <div class="pso-table-controller">
      <el-button size="small" @click="$emit('save')">保存</el-button>
      <el-button size="small" type="primary" plain @click="addHandler">添加属性</el-button>
    </div>
    <el-table key="status" :data="data" style="width: 100%">
      <el-table-column label="状态值" width="200">
        <template slot-scope="scope">
          <el-input-number
            size="small"
            v-model="scope.row.value"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="显示名称">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.name" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="显示颜色" align="center">
        <template slot-scope="scope">
          <el-color-picker size="small" v-model="scope.row.color"></el-color-picker>
        </template>
      </el-table-column>
      <el-table-column label="显示方式">
        <template slot-scope="scope">
          <el-select size="small" v-model="scope.row.display">
            <el-option label="仅自身文字" value="1"></el-option>
            <el-option label="整行文字" value="2"></el-option>
            <el-option label="整行背景色" value="3"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="delHandler(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: ["data"],
  methods: {
    addHandler() {
      this.data.push({ value: "", name: "", color: "", display: "" });
    },
    delHandler(index) {
      this.data.splice(index, 1);
    }
  }
};
</script>
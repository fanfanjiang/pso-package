<template>
  <div>
    <div class="pso-table-controller">
      <el-button size="small" type="primary" plain @click="addHandler">添加脚本</el-button>
    </div>
    <el-table key="status" :data="data" style="width: 100%">
      <el-table-column label="提交脚本" width="600">
        <template slot-scope="scope">
          <el-input type="textarea" :row="8" size="small" v-model="scope.row.sql" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="参数" width="200">
        <template slot-scope="scope">
          <el-select size="small" v-model="scope.row.param" filterable clearable multiple>
            <el-option
              v-for="item in fields"
              :key="item.field_name"
              :label="showName(item)"
              :value="item.field_name"
            ></el-option>
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
  props: ["data", "fields"],
  created() {
    console.log(this.data);
    this.data.forEach(item => {
      item.param = item.param.split(",");
      Object.assign({ sql: "", ...item });
    });
  },
  methods: {
    addHandler() {
      this.data.push({ sql: "", param: [] });
    },
    delHandler(index) {
      this.data.splice(index, 1);
    },
    showName(item) {
      return `${item.field_display}(${item.field_name})`;
    }
  }
};
</script>
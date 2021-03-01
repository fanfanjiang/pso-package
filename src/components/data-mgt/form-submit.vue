<template>
  <div>
    <div class="pso-table-controller">
      <el-button size="mini" type="primary" plain @click="addHandler">添加脚本</el-button>
    </div>
    <el-table key="status" size="mini" border :data="data" style="width: 100%">
      <el-table-column label="类型" width="120">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.subtype" clearable>
            <el-option v-for="s in subtypes" :key="s.n" :value="s.v" :label="s.n"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="参数" width="200">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.param" filterable clearable multiple>
            <el-option v-for="item in fields" :key="item.field_name" :label="showName(item)" :value="item.field_name"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="提交脚本" width="440">
        <template slot-scope="scope">
          <el-input type="textarea" :row="8" size="mini" v-model="scope.row.sql" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="错误提示">
        <template slot-scope="scope">
          <el-input type="textarea" :row="8" size="mini" v-model="scope.row.error" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
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
  data() {
    return {
      subtypes: [
        { n: "操作", v: "1" },
        { n: "验证", v: "2" },
      ],
    };
  },
  created() {
    this.data.forEach((item) => {
      item.param = item.param.split(",");
      Object.assign({ sql: "", param: [], error: "", subtype: "", ...item });
    });
  },
  methods: {
    addHandler() {
      this.data.push({ sql: "", param: [], error: "", subtype: "" });
    },
    delHandler(index) {
      this.data.splice(index, 1);
    },
    showName(item) {
      return `${item.field_display}(${item.field_name})`;
    },
  },
};
</script>
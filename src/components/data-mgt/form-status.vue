<template>
  <div>
    <div class="pso-table-controller">
      <el-button size="mini" type="primary" plain @click="addHandler">添加属性</el-button>
    </div>
    <el-table key="status" :data="data" style="width: 100%">
      <el-table-column label="状态值" width="160">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.value" controls-position="right" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="显示名称" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.name" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="显示颜色" align="center" width="100">
        <template slot-scope="scope">
          <el-color-picker size="mini" v-model="scope.row.color"></el-color-picker>
        </template>
      </el-table-column>
      <el-table-column label="显示方式">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.display">
            <el-option label="仅自身文字" value="1"></el-option>
            <el-option label="整行文字" value="2"></el-option>
            <el-option label="整行背景色" value="3"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="目标值">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.target" multiple>
            <template v-for="(d, i) in data">
              <el-option v-if="i !== scope.$index" :label="d.name" :value="d.value" :key="i"></el-option>
            </template>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="goDesigner(scope.$index)">设计脚本</el-button>
          <el-button size="mini" type="danger" @click="delHandler(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <sql-designer :opener="showDeisgner" :scode="code" :sql="curSql"></sql-designer>
  </div>
</template>
<script>
import SqlDesigner from "../sql-designer";
import { FORM_STATUS_FIELDS } from "../../const/sys";
import { formatJSONList } from "../../utils/util";

export default {
  components: { SqlDesigner },
  props: ["data", "fields", "code"],
  data() {
    return {
      curSql: null,
      showDeisgner: { show: false },
    };
  },
  created() {
    formatJSONList(this.data, FORM_STATUS_FIELDS);
  },
  methods: {
    goDesigner(index) {
      this.curSql = this.data[index].script;
      this.showDeisgner.show = true;
    },
    addHandler() {
      this.data.push(_.cloneDeep(FORM_STATUS_FIELDS));
    },
    delHandler(index) {
      this.data.splice(index, 1);
    },
  },
};
</script>
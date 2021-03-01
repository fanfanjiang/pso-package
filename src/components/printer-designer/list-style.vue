<template>
  <div style="margin: 20px 0">
    <div style="margin-bottom: 10px">
      <el-button size="mini" type="primary" @click="addHandler">添加样式</el-button>
      <el-button size="mini" type="danger" @click="delHandler">删除样式</el-button>
    </div>
    <el-table border size="mini" :data="data" style="width: 100%" @selection-change="changeHandler">
      <el-table-column type="selection" width="40" header-align="center" align="center"></el-table-column>
      <el-table-column prop="name" label="名称" fixed="left">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.name" controls-position="right"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="左边距" width="160">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.margin[0]" controls-position="right" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="上边距" width="160">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.margin[1]" controls-position="right" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="右边距" width="160">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.margin[2]" controls-position="right" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="下边距" width="160">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.margin[3]" controls-position="right" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="尺寸" width="160">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.fontSize" controls-position="right" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="对齐" width="160">
        <template slot-scope="scope">
          <el-select size="mini" clearable v-model="scope.row.alignment">
            <el-option label="中" value="center"></el-option>
            <el-option label="左" value="left"></el-option>
            <el-option label="右" value="right"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="颜色" width="50">
        <template slot-scope="scope">
          <el-color-picker size="mini" v-model="scope.row.color"></el-color-picker>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import shortid from "shortid";
import { formatJSONList } from "../../utils/util";
const FIELDS = {
  id: "",
  name: "",
  margin: [5, 5, 5, 5],
  fontSize: 10,
  alignment: "center",
  color: "#000000",
};

export default {
  props: {
    data: Array,
    selected: [],
  },
  created() {
    formatJSONList(this.data, FIELDS);
  },
  methods: {
    addHandler() {
      this.data.push({
        ..._.cloneDeep(FIELDS),
        id: shortid.generate(),
        name: shortid.generate(),
      });
    },
    delHandler() {
      this.selected.forEach(({ id }) => {
        const index = _.findIndex(this.data, { id });
        if (index !== -1) {
          this.data.splice(index, 1);
        }
      });
    },
    changeHandler(data) {
      this.selected = data;
    },
  },
};
</script>
<template>
  <div style="margin: 20px 0">
    <div style="margin-bottom: 10px">
      <el-button size="mini" type="primary" @click="addHandler">添加数据</el-button>
      <el-button size="mini" type="danger" @click="delHandler" :disabled="!selected.length">删除数据</el-button>
    </div>
    <el-table border size="mini" :data="data" style="width: 100%" @selection-change="changeHandler">
      <el-table-column type="selection" width="40" header-align="center" align="center"></el-table-column>
      <el-table-column prop="text" label="数据" fixed="left"></el-table-column>
      <el-table-column prop="style" label="样式" width="120">
        <template slot-scope="scope">
          <el-select clearable size="mini" v-model="scope.row.style">
            <el-option v-for="(t, i) in styles" :key="i" :label="t.name" :value="t.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="widthType" label="宽度类型" width="120">
        <template slot-scope="scope">
          <el-select size="mini" clearable v-model="scope.row.widthType">
            <el-option label="自适应" value="auto"></el-option>
            <el-option label="占满剩余" value="*"></el-option>
            <el-option label="自定义" value="custom"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="width" label="宽度" width="160">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.width" controls-position="right" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="colSpan" label="colSpan" width="160">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.colSpan" controls-position="right" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="rowSpan" label="rowSpan" width="160">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.rowSpan" controls-position="right" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="goDesigner(scope.$index)">设计数据</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pso-drawer size="50%" :visible="showDesigner" title="设计脚本" @close="showDesigner = false">
      <template v-slot:whole>
        <formula-designer
          v-if="curCell"
          :value="curCell.text"
          :cpnts="fields"
          @cancel="showDesigner = false"
          @confirm="confirmHandler"
        ></formula-designer>
      </template>
    </pso-drawer>
  </div>
</template>
<script>
import formulaDesigner from "../form-designer/formula-designer";
import { formatJSONList } from "../../utils/util";
import shortid from "shortid";
const FIELDS = {
  id: "",
  text: "",
  style: "",
  colSpan: 0,
  rowSpan: 0,
  widthType: "auto",
  width: 0,
  border: [false, false, false, false],
};

export default {
  components: { formulaDesigner },
  props: {
    data: Array,
    styles: Array,
    fields: Array,
  },
  data() {
    return {
      curCell: null,
      showDesigner: false,
      selected: [],
    };
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
    goDesigner(index) {
      this.curCell = null;
      this.$nextTick(() => {
        this.curCell = this.data[index];
        this.showDesigner = true;
      });
    },
    confirmHandler(text) {
      this.curCell.text = text;
      this.showDesigner = false;
    },
  },
};
</script>
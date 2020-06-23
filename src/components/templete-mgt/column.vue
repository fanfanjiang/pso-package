<template>
  <div>
    <el-button size="mini" type="primary" plain @click="handleAdd">添加列</el-button>
    <el-table key="list" :data="data" style="width: 100%" height="300">
      <el-table-column type="index" :index="1"></el-table-column>
      <el-table-column label="字段" width="140">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.field" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="显示名名称" width="140">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.name" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="列宽" width="140">
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
      <el-table-column label="计算字段" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.formulable" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="对齐方式" width="120">
        <template slot-scope="scope">
          <el-select size="small" v-model="scope.row.align">
            <el-option label="居中" value="center"></el-option>
            <el-option label="居左" value="left"></el-option>
            <el-option label="居右" value="right"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="顺序" width="160">
        <template slot-scope="scope">
          <el-input-number
            size="small"
            v-model="scope.row.number"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" plain @click="formulaHandler(scope.$index)">设置公式</el-button>
          <el-button size="mini" plain @click="handleDel(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pso-drawer size="50%" :visible="showDesigner" title="设计脚本" @close="showDesigner=false">
      <template v-slot:whole>
        <formula-designer
          v-if="curCol"
          :value="curCol.formula"
          :cpnts="cpnts"
          @cancel="showDesigner=false"
          @confirm="handleConfirm"
        ></formula-designer>
      </template>
    </pso-drawer>
  </div>
</template>
<script>
import formulaDesigner from "../form-designer/formula-designer";
import { genComponentData } from "../form-designer/helper";
export default {
  props: ["data"],
  components: { formulaDesigner },
  data() {
    return {
      showDesigner: false,
      cpnts: [],
      curCol: null
    };
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
        number: 0,
        formulable: "0",
        formula: ""
      });
    },
    handleDel(index) {
      this.data.splice(index, 1);
    },
    makeCpnts() {
      const cpnts = [];
      this.data.forEach(item => {
        if (item.formulable === "0") {
          if (!item.field) throw new Error("请填写字段");
          cpnts.push(genComponentData({ componentid: "text", fid: item.field, _fieldName: item.name }));
        }
      });
      this.cpnts = cpnts;
    },
    handleConfirm(val) {
      this.curCol.formula = val;
      this.showDesigner = false;
    },
    formulaHandler(index) {
      this.curCol = this.data[index];
      try {
        this.makeCpnts();
      } catch (error) {
        return this.$message(error.message);
      }
      this.showDesigner = true;
    }
  }
};
</script>
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
      <el-table-column label="计算字段" width="100" v-if="formulable">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.formulable" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="是否查询" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.searchable" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="是否时间段" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.timerange" active-value="1" inactive-value="0"></el-switch>
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
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button size="mini" plain @click="handleParams(scope.$index)">设置参数</el-button>
          <el-button v-if="formulable" size="mini" plain @click="formulaHandler(scope.$index)">设置公式</el-button>
          <el-button size="mini" plain @click="handleDel(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="header">
      <pso-title>表头设置</pso-title>
      <el-tree
        :data="header"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        draggable
      >
        <span class="tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => append(data)">添加</el-button>
            <el-button v-if="data.id!=='0'" type="text" size="mini" @click="() => edit(data)">编辑</el-button>
            <el-button
              v-if="data.id!=='0'"
              type="text"
              size="mini"
              @click="() => remove(node, data)"
            >删除</el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <el-dialog
      v-if="header"
      title="设置表头"
      append-to-body
      :visible.sync="showHEditor"
      :width="'400px'"
    >
      <el-form label-width="80px" v-if="showHEditor">
        <el-form-item label="真实字段">
          <el-switch size="small" v-model="hData.isField" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="名称" v-if="hData.isField==='0'">
          <el-input size="small" v-model="hData.label" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择字段" v-else>
          <el-select filterable size="small" v-model="hData.field">
            <el-option
              v-for="item in data"
              :key="item.field"
              :label="item.name"
              :value="item.field"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showHEditor = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置查询参数" append-to-body :visible.sync="showParamsditor" :width="'600px'">
      <template v-if="curCol">
        <el-button size="mini" plain @click="handleParamsAdd()">添加参数</el-button>
        <el-table key="params" :data="curCol.searchList" style="width: 100%" height="300">
          <el-table-column label="字段">{{curCol.name}}</el-table-column>
          <el-table-column label="参数名" width="140">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.n" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column label="参数值" width="140">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.v" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="90">
            <template slot-scope="scope">
              <el-button size="mini" plain @click="handleParamsDel(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
    <pso-drawer
      v-if="formulable"
      size="50%"
      :visible="showDesigner"
      title="设计脚本"
      @close="showDesigner=false"
    >
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
import shortid from "shortid";
export default {
  props: {
    data: {
      type: Array
    },
    header: {
      type: Array
    },
    formulable: {
      type: Boolean,
      default: true
    },
    extend: {
      type: Object,
      default: () => ({})
    }
  },
  components: { formulaDesigner },
  data() {
    return {
      showDesigner: false,
      showHEditor: false,
      showParamsditor: false,
      cpnts: [],
      curCol: null,
      curNode: null,
      hData: {
        isField: "1",
        label: "",
        field: ""
      },
      op: ""
    };
  },
  created() {
    if (this.header && !this.header.length) {
      this.header.push({ label: "表头", id: "0", field: "0", children: [] });
    }
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
        formula: "",
        searchable: "0",
        searchList: [],
        timerange: "0",
        ...this.extend
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
    },
    append(data) {
      this.op = "1";
      this.curNode = data;
      this.showHEditor = true;
    },
    edit(data) {
      this.op = "2";
      this.curNode = data;
      Object.assign(this.hData, data);
      delete this.hData.children;
      this.showHEditor = true;
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    save() {
      if (this.op === "1") {
        const newChild = { id: shortid.generate(), ...this.hData };
        if (this.hData.isField === "1" && this.hData.field) {
          const f = _.find(this.data, { field: this.hData.field });
          if (f) {
            newChild.label = f.name;
          }
        }
        if (!this.curNode.children) {
          this.$set(this.curNode, "children", []);
        }
        this.curNode.children.push(newChild);
      } else if (this.op === "2") {
        if (this.hData.isField === "1" && this.hData.field) {
          const f = _.find(this.data, { field: this.hData.field });
          if (f) {
            this.hData.label = f.name;
          }
        }
        Object.assign(this.curNode, { ...this.hData });
      }

      this.showHEditor = false;
    },
    handleParams(index) {
      this.curCol = this.data[index];
      if (this.curCol.searchList.length && typeof this.curCol.searchList[0] === "string") {
        this.curCol.searchList = [];
      }
      this.showParamsditor = true;
    },
    handleParamsAdd() {
      this.curCol.searchList.push({ n: "", v: "" });
    },
    handleParamsDel(index) {
      this.curCol.searchList.splice(index, 1);
    }
  }
};
</script>
<style scoped>
.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
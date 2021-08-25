<template>
  <div style="margin-top: 20px">
    <el-button size="mini" type="primary" plain @click="addParam">添加参数</el-button>
    <el-button size="mini" type="primary" plain @click="addFormParam">添加表单通用参数</el-button>
    <el-button size="mini" type="primary" plain @click="addFlowParam">添加流程通用参数</el-button>
    <el-button size="mini" type="primary" plain @click="addAssParam">添加关联表通用参数</el-button>
    <el-table border size="mini" :data="data" style="width: 100%; margin-top: 10px" key="param">
      <el-table-column label="参数名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" size="mini" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="参数字段">
        <template slot-scope="scope">
          <el-input v-model="scope.row.field" size="mini" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="控件类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.picker" size="mini" clearable>
            <el-option v-for="item in TP_CTL_TYPE" :key="item.v" :label="item.n" :value="item.v"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="关联参数">
        <template slot-scope="scope">
          <el-select v-model="scope.row.relateParam" size="mini" clearable>
            <el-option v-for="item in data" :key="item.field" :label="item.name" :value="item.field"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="存储方式">
        <template slot-scope="scope">
          <el-select v-model="scope.row.saveType" size="mini" clearable @change="typeChange($event, scope.$index)">
            <el-option label="字符串" value="1"></el-option>
            <el-option label="数组" value="2"></el-option>
            <el-option label="对象" value="3"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="delParam(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="参数前缀" append-to-body :visible.sync="showEditor" :width="'480px'">
      <el-input size="mini" v-model="prefix"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showEditor = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleAssParams">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { TP_CTL_TYPE } from "../../const/menu";
import { PLUGIN_PARAMS } from "../../const/sys";
import { PLUGIN_PARAMS_FORM, PLUGIN_PARAMS_WORKFLOW } from "../../const/app";

export default {
  props: ["data"],
  data() {
    return {
      TP_CTL_TYPE: TP_CTL_TYPE,
      showEditor: false,
      prefix: "",
    };
  },
  created() {
    this.data.forEach((d) => Object.assign(d, { ...PLUGIN_PARAMS }, { ...d }));
  },
  methods: {
    addParam() {
      this.data.push(_.cloneDeep(PLUGIN_PARAMS));
    },
    delParam(index) {
      this.data.splice(index, 1);
    },
    typeChange(type, index) {
      if (type === "1") {
        this.data[index].value = "";
      } else if (type === "2") {
        this.data[index].value = [];
      } else if (type === "3") {
        this.data[index].value = {};
      }
    },
    addFormParam() {
      this.addParams(PLUGIN_PARAMS_FORM);
    },
    addFlowParam() {
      this.addParams(PLUGIN_PARAMS_WORKFLOW);
    },
    addParams(source, prefix = "") {
      source.forEach((d) => {
        const field = `${prefix}${d.field}`;
        const name = `${prefix}${d.name}`;
        const exist = _.find(this.data, { field });
        if (!exist) {
          this.data.splice(this.data.length, 0, { ...d, field, name });
        }
      });
    },
    addAssParam() {
      this.prefix = "";
      this.showEditor = true;
    },
    handleAssParams() {
      this.showEditor = false;
      this.addParams(PLUGIN_PARAMS_FORM, this.prefix);
    },
  },
};
</script>
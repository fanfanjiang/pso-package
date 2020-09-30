<template>
  <div>
    <el-button size="mini" type="primary" plain @click="addParam">添加参数</el-button>
    <el-button size="mini" type="primary" plain @click="addFormParam">添加表单通用参数</el-button>
    <el-button size="mini" type="primary" plain @click="addFlowParam">添加流程通用参数</el-button>
    <el-button size="mini" type="primary" plain @click="addAssParam">添加关联表通用参数</el-button>
    <el-table :data="data" style="width: 100%" key="param">
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
      <el-table-column label="默认值">
        <template slot-scope="scope">
          <el-input v-model="scope.row.value" size="mini" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="存储方式">
        <template slot-scope="scope">
          <el-select v-model="scope.row.saveType" size="mini" clearable @change="typeChange($event, scope.$index)">
            <el-option label="非列表" value="1"></el-option>
            <el-option label="列表" value="2"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain @click="delParam(scope.$index)">删除</el-button>
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
const _DATA = { field: "", value: "", picker: "", name: "", saveType: "1", relateParam: "" };
const FORM = [
  { field: "cfgId", value: "", picker: "picker-form", name: "表单源", saveType: "1", relateParam: "" },
  { field: "where", value: "", picker: "input", name: "条件约束", saveType: "1", relateParam: "" },
  { field: "textGroup", value: "", picker: "picker-text", name: "文本组", saveType: "1", relateParam: "" },
  { field: "defKeys", value: "", picker: "input", name: "初始keys", saveType: "1", relateParam: "" },
  { field: "searchType", value: "", picker: "input", name: "搜索参数", relateParam: "", saveType: "1" },
  { field: "useCloumn", value: "", picker: "picker-column", name: "列表配置", relateParam: "cfgId", saveType: "1" },
  { field: "hideAuthTab", value: "", picker: "picker-yes", name: "权限视图切换", saveType: "1", relateParam: "" },
  { field: "hideStatusTab", value: "", picker: "picker-yes", name: "状态视图切换", saveType: "1", relateParam: "" },
  { field: "hideNewBtn", value: "", picker: "picker-yes", name: "隐藏新增按钮", saveType: "1", relateParam: "" },
  { field: "hideChangeBtn", value: "", picker: "picker-yes", name: "隐藏更改按钮", saveType: "1", relateParam: "" },
  { field: "hideStage", value: "", picker: "picker-yes", name: "隐藏阶段按钮", saveType: "1", relateParam: "" },
  { field: "hideCopyBtn", value: "", picker: "picker-yes", name: "隐藏复制按钮", saveType: "1", relateParam: "" },
  { field: "hideMoreBtn", value: "", picker: "picker-yes", name: "隐藏更多按钮", saveType: "1", relateParam: "" },
];

const WORKFLOW = [
  { field: "wfId", value: "", picker: "picker-wf", name: "流程", saveType: "1", relateParam: "" },
  { field: "textGroup", value: "", picker: "picker-text", name: "文本", saveType: "1", relateParam: "" },
  { field: "defKeys", value: "", picker: "input", name: "初始keys", saveType: "1", relateParam: "" },
  { field: "searchType", value: "", picker: "input", name: "项目参数", relateParam: "", saveType: "1" },
  { field: "useCloumn", value: "", picker: "picker-column", name: "列表配置", relateParam: "wfId", saveType: "1" },
  { field: "hideAuthTab", value: "", picker: "picker-yes", name: "权限视图切换", saveType: "1", relateParam: "" },
  { field: "hideStatusTab", value: "", picker: "picker-yes", name: "状态视图切换", saveType: "1", relateParam: "" },
  { field: "hideNewBtn", value: "", picker: "picker-yes", name: "隐藏新增按钮", saveType: "1", relateParam: "" },
  { field: "hideChangeBtn", value: "", picker: "picker-yes", name: "隐藏更改按钮", saveType: "1", relateParam: "" },
  { field: "hideStage", value: "", picker: "picker-yes", name: "隐藏阶段按钮", saveType: "1", relateParam: "" },
  { field: "hideCopyBtn", value: "", picker: "picker-yes", name: "隐藏复制按钮", saveType: "1", relateParam: "" },
  { field: "hideMoreBtn", value: "", picker: "picker-yes", name: "隐藏更多按钮", saveType: "1", relateParam: "" },
  { field: "hideArchiveBtn", value: "", picker: "picker-yes", name: "隐藏归档按钮", saveType: "1", relateParam: "" },
  { field: "hideBackBtn", value: "", picker: "picker-yes", name: "隐藏撤销按钮", saveType: "1", relateParam: "" },
];

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
    this.data.forEach((d) => Object.assign(d, { ..._DATA }, { ...d }));
  },
  methods: {
    addParam() {
      this.data.push({ ..._DATA });
    },
    delParam(index) {
      this.data.splice(index, 1);
    },
    typeChange(type, index) {
      if (type === "1") {
        this.data[index].value = "";
      } else {
        this.data[index].value = [];
      }
    },
    addFormParam() {
      this.addParams(FORM);
    },
    addFlowParam() {
      this.addParams(WORKFLOW);
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
      this.addParams(FORM, this.prefix);
    },
  },
};
</script>
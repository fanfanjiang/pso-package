<template>
  <div class="pso-form">
    <el-button style="margin-bottom: 10px" size="mini" type="primary" plain @click="addParam">添加目标表单配置</el-button>
    <el-form label-position="top" size="mini" style="margin-bottom: 40px" v-for="(d, i) in data" :key="i">
      <picker-form from-text="选择目标表单" form-field="fid" source="3" :data="d" @loaded="formLoaded"></picker-form>
      <el-form-item label="视图名称">
        <el-input size="mini" v-model="d.name"></el-input>
      </el-form-item>
      <el-form-item label="组件类型">
        <el-select filterable clearable size="mini" v-model="d.cid">
          <el-option v-for="(s, i) in COMPONENTS" :key="i" :label="s.n" :value="s.v"></el-option>
        </el-select>
      </el-form-item>
      <div>
        <picker-fmatchup v-bind="getMatchup(i)"></picker-fmatchup>
      </div>
      <template v-if="d.cid !== 'pso-form-interpreter'">
        <el-button size="mini" plain @click="setCurItem(i)">设置目标视图参数</el-button>
        <el-form-item label="反哺字段">
          <el-select filterable clearable size="mini" v-model="d.feed">
            <el-option v-for="(s, i) in sources" :key="i" :label="s.fieldDisplay" :value="s.field_name"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <el-button size="mini" type="danger" plain @click="delHandler(i)">删除配置项</el-button>
    </el-form>
    <pso-dialog :visible="showEditor" width="70%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>详细配置</span>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content" v-if="curItem">
        <setter :node="node" :code="code" :data="curItem.opts" @tploaded="tpLoadedHandler"></setter>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import PickerFmatchup from "./picker-fmatchup";
import PickerForm from "../../picker/pso-picker-form";
import { formatJSONList } from "../../../utils/util";

const COMPONENTS = [
  { n: "表单视图", v: "pso-form-view" },
  { n: "表单详情", v: "pso-form-interpreter" },
];

const FIELDS = { fid: "", name: "", cid: "pso-form-view", feed: "", relate: [], opts: [] };

export default {
  components: { PickerFmatchup, PickerForm, Setter: () => import("../setter") },
  props: {
    node: Object,
    sources: Array,
    data: Array,
  },
  data() {
    this.COMPONENTS = COMPONENTS;
    return {
      showEditor: false,
      curItem: null,
      fProxy: {},
      code: "P000000131415923",
    };
  },
  created() {
    formatJSONList(this.data, FIELDS);
  },
  methods: {
    addParam() {
      this.data.push(_.cloneDeep(FIELDS));
    },
    delHandler(index) {
      this.data.splice(index, 1);
    },
    formLoaded({ fields, store }) {
      if (!this.fProxy[store.data_code]) {
        this.$set(this.fProxy, store.data_code, fields);
      }
    },
    getMatchup(index) {
      const { relate, fid } = this.data[index];
      return { data: relate, sources: this.sources, targets: this.fProxy[fid] };
    },
    setCurItem(index) {
      this.curItem = this.data[index];
      this.showEditor = true;
    },
    tpLoadedHandler() {
      const exist = _.find(this.curItem.opts, { field: "cfgId" });
      if (exist) {
        exist.value = this.curItem.fid;
      }
    },
  },
};
</script>
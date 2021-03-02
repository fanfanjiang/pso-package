<template>
  <div class="fvtree-set">
    <el-button style="margin-bottom: 10px" size="mini" type="primary" plain @click="addParam">添加参数</el-button>
    <el-table border size="mini" :data="cfg" style="width: 100%">
      <el-table-column type="index" label="序号" :index="1" width="50" align="center"></el-table-column>
      <el-table-column label="表单" align="center" width="160">
        <template slot-scope="scope">
          <picker-form :from-text="''" form-field="fid" source="3" :data="scope.row" @loaded="formLoaded"></picker-form>
        </template>
      </el-table-column>
      <el-table-column prop="pid" label="父表单" align="center" width="160">
        <template slot-scope="scope">
          <el-select v-model="scope.row.pid" size="mini" clearable @change="pChangeHandler(scope.row)">
            <template v-for="(d, i) in cfg">
              <el-option v-if="d.id !== scope.row.id" :key="i" :label="getFormName(d.fid)" :value="d.id"></el-option>
            </template>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="field" label="表单字段" align="center" width="160">
        <template slot-scope="scope">
          <el-select v-if="scope.row.fid" v-model="scope.row.field" size="mini" clearable>
            <el-option v-for="(f, i) in getFormFields(scope.row.fid)" :key="i" :label="f.fieldDisplay" :value="f._fieldValue"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="pfield" label="父表单字段" align="center" width="160">
        <template slot-scope="scope">
          <el-select v-if="scope.row.pid" v-model="scope.row.pfield" size="mini" clearable>
            <el-option
              v-for="(f, i) in getFieldsFromParent(scope.row.pid)"
              :key="i"
              :label="f.fieldDisplay"
              :value="f._fieldValue"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="other" label="其它关系" align="center">
        <template slot-scope="scope">
          <div style="display: flex; align-items: center; justify-content: space-between" v-for="(v, k, i) in scope.row.other" :key="i">
            <span>{{ getFormNameById(k) }}：</span>
            <el-select v-if="scope.row.fid" v-model="scope.row.other[k].field" size="mini" clearable placeholder="表单字段">
              <el-option v-for="(f, i) in getFormFields(scope.row.fid)" :key="i" :label="f.fieldDisplay" :value="f._fieldValue"></el-option>
            </el-select>
            <el-select v-if="scope.row.pid" v-model="scope.row.other[k].pfield" size="mini" clearable placeholder="关联字段">
              <el-option v-for="(f, i) in getFieldsFromParent(k)" :key="i" :label="f.fieldDisplay" :value="f._fieldValue"></el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" plain @click="delHandler(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import PickerForm from "../../picker/pso-picker-form";
import { formatJSONList } from "../../../utils/util";

import shortid from "shortid";
const FIELDS = { id: "", pid: "", fid: "", field: "", pfield: "leaf_id", other: {} };
const OTHER = { field: "", pfield: "leaf_id" };
export default {
  components: { PickerForm },
  props: {
    node: Object,
    data: Array,
  },
  data() {
    return {
      forms: [],
      fProxy: {},
    };
  },
  computed: {
    cfg() {
      const exist = _.find(this.data, { field: "fvtree" });
      if (exist) {
        return exist.value;
      }
    },
  },
  created() {
    let exist = _.find(this.data, { field: "fvtree" });
    if (!exist) {
      this.data.push({ field: "fvtree", value: [], saveType: "2" });
    } else {
      if (!Array.isArray(exist.value)) this.$set(exist, "value", []);
    }
    formatJSONList(this.cfg, FIELDS);
  },
  methods: {
    addParam() {
      this.cfg.push({ ..._.cloneDeep(FIELDS), id: shortid.generate() });
    },
    formLoaded({ fields, store, config, forms }) {
      if (!this.forms.length) {
        this.forms = forms;
      }
      if (!this.fProxy[store.data_code]) {
        this.$set(this.fProxy, store.data_code, fields);
      }
    },
    getFormNameById(id) {
      const data = _.find(this.cfg, { id });
      return this.getFormName(data.fid);
    },
    getFormName(node_name) {
      const exist = _.find(this.forms, { node_name });
      if (exist) {
        return exist.node_display;
      }
    },
    getFormFields(id) {
      return this.fProxy[id] || [];
    },
    getFieldsFromParent(id) {
      const exist = _.find(this.cfg, { id });
      return exist ? this.getFormFields(exist.fid) : [];
    },
    delHandler(index) {
      this.cfg.splice(index, 1);
    },
    pChangeHandler(data) {
      const { pid } = data;
      const ancestor = this.getAncestor(pid);
      data.other = {};
      ancestor.forEach((d) => {
        this.$set(data.other, d, _.cloneDeep(OTHER));
      });
    },
    getAncestor(id) {
      const ancestor = [];
      while (id) {
        const p = _.find(this.cfg, { id });
        if (p && p.pid) {
          id = p.pid;
          ancestor.push(id);
        } else {
          id = "";
        }
      }
      return ancestor;
    },
  },
};
</script>
<style lang="less">
.fvtree-set {
  margin-bottom: 20px;
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
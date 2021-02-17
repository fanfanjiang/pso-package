<template>
  <div class="fvtree-set">
    <el-button size="mini" type="primary" plain @click="addParam">添加参数</el-button>
    <el-table key="list" size="mini" :data="cfg" style="width: 100%">
      <el-table-column type="index" :index="1" fixed="left" width="50"></el-table-column>
      <el-table-column label="表单">
        <template slot-scope="scope">
          <picker-form :from-text="''" form-field="fid" source="3" :data="scope.row" @loaded="formLoaded"></picker-form>
        </template>
      </el-table-column>
      <el-table-column prop="pid" label="父表单">
        <template slot-scope="scope">
          <el-select v-model="scope.row.pid" size="mini" clearable>
            <template v-for="(d, i) in cfg">
              <el-option v-if="d.id !== scope.row.id" :key="i" :label="getFormName(d.fid)" :value="d.id"></el-option>
            </template>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="field" label="表单字段">
        <template slot-scope="scope">
          <el-select v-if="scope.row.fid" v-model="scope.row.field" size="mini" clearable>
            <el-option v-for="(f, i) in getFormFields(scope.row.fid)" :key="i" :label="f.fieldDisplay" :value="f._fieldValue"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="pfield" label="父表单字段">
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" plain @click="delHandler(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import PickerForm from "../../picker/pso-picker-form";
import shortid from "shortid";
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
  },
  methods: {
    addParam() {
      this.cfg.push({ id: shortid.generate(), pid: "", fid: "", field: "", pfield: "" });
    },
    formLoaded({ fields, store, config, forms }) {
      if (!this.forms.length) {
        this.forms = forms;
      }
      if (!this.fProxy[store.data_code]) {
        this.$set(this.fProxy, store.data_code, fields);
      }
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
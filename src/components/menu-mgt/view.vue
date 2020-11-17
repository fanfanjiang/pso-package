<template>
  <el-table key="status" :data="data" style="width: 100%" v-loading="initializing">
    <el-table-column prop="n" label="视图项" width="100" fixed="left"></el-table-column>
    <el-table-column label="显示值">
      <template slot-scope="scope">
        <el-input size="mini" v-model="scope.row.text" placeholder></el-input>
      </template>
    </el-table-column>
    <el-table-column label="关联表单" width="200">
      <template slot-scope="scope">
        <el-select
          size="mini"
          v-model="scope.row.form"
          filterable
          clearable
          @change="handleFormChange($event)"
        >
          <el-option
            v-for="item in forms"
            :key="item.node_name"
            :label="item.node_display"
            :value="item.node_name"
          ></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="关联字段" width="200">
      <template slot-scope="scope">
        <el-select
          size="mini"
          v-model="scope.row.field"
          filterable
          clearable
          v-if="!loadingFields&&scope.row.form"
        >
          <el-option
            v-for="item in formFields[scope.row.form]"
            :key="item.field_name"
            :label="item.field_display"
            :value="item.field_name"
          ></el-option>
        </el-select>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { formOp } from "../form-designer/mixin.js";
import { MENU_LEAF_AUTH } from "../../const/menu";
const _DATA = { text: "", form: "", field: "" };
export default {
  mixins: [formOp],
  props: ["data", "defForm"],
  data() {
    return {
      initializing: false,
      forms: [],
      loadingFields: false,
      formFields: {}
    };
  },
  async created() {
    this.initializing = true;
    this.forms = await this.API.getFormTree();
    for (let item of MENU_LEAF_AUTH) {
      const exist = _.find(this.data, { v: item.v });
      let temp = exist;
      if (exist) {
        Object.assign(exist, { ..._DATA, ...exist });
      } else {
        temp = { ...item, ..._DATA, form: this.defForm || "" };
        this.data.push(temp);
      }
      if (temp.form) {
        this.handleFormChange(temp.form);
      }
    }
    this.initializing = false;
  },
  methods: {
    handleFormChange(val) {
      if (!this.formFields[val]) {
        this.getFormFields(val);
      }
    },
    async getFormFields(value) {
      this.loadingFields = true;
      const formStore = await this.makeFormStore(value);
      const ret = await this.API.getFormDict({ data_code: value });
      ret.data.forEach(item => {
        const field = formStore.search({ options: { fid: item.field_name }, onlyData: true });
        item.field_display = (field ? field._fieldName : "系统字段") + `(${item.field_name})`;
      });
      this.formFields[value] = ret.data;
      this.loadingFields = false;
    }
  }
};
</script>
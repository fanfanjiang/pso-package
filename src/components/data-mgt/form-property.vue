<template>
  <el-form label-position="left" label-width="120px">
    <div class="pso-table-controller">
      <el-button size="mini" @click="$emit('save')">保存</el-button>
    </div>
    <el-form-item label="计量规则">
      <el-select size="mini" v-model="data.cal_mark" clearable>
        <el-option v-for="item in marks" :key="item.n" :label="item.n" :value="item.v"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="计量数值字段">
      <el-select size="mini" v-model="data.cal_amount_field" clearable>
        <el-option
          v-for="item in fields"
          :key="item.field_name"
          :label="item.display_name"
          :value="item.field_name"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="计量标签字段">
      <el-select size="mini" v-model="data.cal_tag_field" clearable>
        <el-option
          v-for="item in fields"
          :key="item.field_name"
          :label="item.display_name"
          :value="item.field_name"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="计量单位字段">
      <el-select size="mini" v-model="data.cal_unit_field" clearable>
        <el-option
          v-for="item in fields"
          :key="item.field_name"
          :label="item.display_name"
          :value="item.field_name"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="计量父标签">
      <el-select size="mini" v-model="data.cal_parent_tag" clearable>
        <el-option
          v-for="item in fields"
          :key="item.field_name"
          :label="item.display_name"
          :value="item.field_name"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="数据来源主表">
      <el-select size="mini" v-model="data.cal_source_main_form" @change="makeFormStore" clearable>
        <el-option
          v-for="item in trees"
          :key="item.node_id"
          :label="item.node_display"
          :value="item.node_name"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="数据来源子表">
      <el-select size="mini" v-model="data.cal_source_leaf_form" clearable>
        <el-option
          v-for="item in sourceSubForms"
          :key="item._fieldValue"
          :label="item._fieldName"
          :value="item._option"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="数据结算子表">
      <el-select size="mini" v-model="data.cal_end_leaf_form" clearable>
        <el-option
          v-for="item in subForms"
          :key="item._fieldValue"
          :label="item._fieldName"
          :value="item._option"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
import { formOp } from "../form-designer/mixin.js";

export default {
  mixins: [formOp],
  props: ["data", "fields", "store"],
  data() {
    return {
      marks: [
        { n: "不计量", v: 0 },
        { n: "计量不输出", v: 1 },
        { n: "计量输出", v: 2 },
        { n: "入库", v: 8 },
        { n: "出库", v: 9 },
      ],
      trees: [],
    };
  },
  computed: {
    subForms() {
      return this.store.search({ options: { componentid: "asstable" }, onlyData: true });
    },
    sourceSubForms() {
      if (this.formStore) {
        return this.formStore.search({ options: { componentid: "asstable" }, onlyData: true });
      } else {
        return [];
      }
    },
  },
  async created() {
    this.trees = await this.API.getFormTree();
  },
};
</script>
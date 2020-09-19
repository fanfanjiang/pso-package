<template>
  <div class="sql-block">
    <div class="sql-block__base">
      <el-form label-position="left" label-width="90px">
        <el-form-item label="名称">
          <el-input size="mini" v-model="block.name"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="block.script_type">
            <el-radio v-for="itm in TYPE" :key="itm.v" :label="itm.v">{{itm.n}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="执行">
          <el-radio-group v-model="block.action_type">
            <el-radio v-for="itm in OP" :key="itm.v" :label="itm.v">{{itm.n}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联">
          <el-radio-group v-model="block.relate_type">
            <el-radio v-for="itm in RELATE" :key="itm.v" :label="itm.v">{{itm.n}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参数" v-if="params">
          <el-select size="mini" v-model="block.params" filterable multiple>
            <el-option v-for="(p,i) in params" :key="i" :label="p[paramsN]" :value="p[paramsV]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作">
          <el-radio-group v-model="block.optype">
            <el-radio v-for="itm in OPTYPE" :key="itm.v" :label="itm.v">{{itm.n}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="脚本">
          <el-input size="mini" :rows="8" type="textarea" v-model="block.script"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="sql-block__extend" v-if="extendable">
      <picker-form
        :data="block"
        form-field="data_code" 
        source="3"
        :fields="[{n:'插入字段',f:'_lastField'}]"
        position="left"
        @select="handleFieldCheck"
      ></picker-form>
      <el-table size="mini" :data="block.field_config" style="width: 100%" height="400">
        <el-table-column type="index" :index="1"></el-table-column>
        <el-table-column prop="display" label="目标字段" width="200"></el-table-column>
        <el-table-column label="来源字段">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.efield"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="delHandler(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import PickerForm from "../picker/pso-picker-form";

const TYPE = [
  { v: "0", n: "纯脚本" },
  { v: "1", n: "psoscript" },
  { v: "2", n: "pso纯脚本" },
];

const OP = [
  { v: "0", n: "选择" },
  { v: "1", n: "插入" },
  { v: "2", n: "更新" },
];

const OPTYPE = [
  { v: "0", n: "表单" },
  { v: "1", n: "包含记录" },
];

const RELATE = [
  { v: "0", n: "单表" },
  { v: "1", n: "关联主表" },
  { v: "2", n: "关联子表" },
];

export default {
  components: { PickerForm },
  props: {
    block: {
      type: Object,
    },
    params: Array,
    paramsN: String,
    paramsV: String,
  },
  data() {
    this.TYPE = TYPE;
    this.OP = OP;
    this.OPTYPE = OPTYPE;
    this.RELATE = RELATE;
    return {};
  },
  computed: {
    extendable() {
      return this.block.script_type === "1" && this.block.action_type && this.block.action_type !== "0";
    },
  },
  created() {
    this.$set(this.block, "_lastField", "");
  },
  methods: {
    handleFieldCheck({ field }) {
      this.block.field_config.push({
        field_format: field.field_format,
        output_format: field.output_format,
        is_sys: field.is_sys,
        display: field.fieldDisplay,
        sfield: field._fieldValue,
        efield: "",
      });
    },
    delHandler(index) {
      this.block.field_config.splice(index, 1);
    },
  },
};
</script>
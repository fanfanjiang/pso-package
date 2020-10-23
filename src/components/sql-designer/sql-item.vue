<template>
  <div class="sql-block">
    <div class="sql-block__base">
      <el-form label-position="left" label-width="110px" size="mini">
        <el-form-item label="名称">
          <el-input size="mini" v-model="block.name"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="block.script_type">
            <el-radio v-for="itm in TYPE" :key="itm.v" :label="itm.v">{{ itm.n }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="执行">
          <el-radio-group v-model="block.action_type">
            <el-radio v-for="itm in OP" :key="itm.v" :label="itm.v">{{ itm.n }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联">
          <el-radio-group v-model="block.relate_type">
            <el-radio v-for="itm in RELATE" :key="itm.v" :label="itm.v">{{ itm.n }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参数" v-if="params">
          <el-select size="mini" v-model="block.params" filterable multiple>
            <el-option v-for="(p, i) in params" :key="i" :label="p[paramsN]" :value="p[paramsV]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作">
          <el-radio-group v-model="block.optype">
            <el-radio v-for="itm in OPTYPE" :key="itm.v" :label="itm.v">{{ itm.n }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="组件分块匹配">
          <el-switch size="mini" v-model="block.is_split" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="匹配字段" v-if="block.is_split === '1'">
          <el-input size="mini" :rows="2" type="textarea" v-model="block.split_field"></el-input>
        </el-form-item>
        <div class="sql-editor">
          <codemirror ref="codemirror" :options="sqlOptions" v-model="block.script" @ready="onCodemirrorReady" />
        </div>
      </el-form>
    </div>
    <div class="sql-block__extend" v-if="extendable">
      <picker-form
        :data="block"
        form-field="data_code"
        source="3"
        :fields="[{ n: '插入字段', f: '_lastField' }]"
        position="left"
        @select="handleFieldCheck"
      ></picker-form>
      <el-table size="mini" :data="block.field_config" style="width: 100%">
        <el-table-column type="index" :index="1" width="20"></el-table-column>
        <el-table-column prop="display" label="目标字段" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column label="来源字段">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.efield"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="公式" width="100">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.formula" filterable>
              <el-option v-for="(f, i) in FORMULAR" :key="i" :label="f.n" :value="f.v"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="条件" width="80">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.condition" filterable>
              <el-option v-for="(d, i) in CONDITION" :key="i" :label="d.n" :value="d.v"></el-option>
            </el-select>
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

const FORMULAR = [
  { v: "0", n: "无" },
  { v: "1", n: "等于" },
  { v: "2", n: "加" },
  { v: "3", n: "减" },
  { v: "4", n: "乘" },
  { v: "5", n: "除" },
];

const CONDITION = [
  { v: "0", n: "否" },
  { v: "1", n: "是" },
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
    this.FORMULAR = FORMULAR;
    this.CONDITION = CONDITION;
    return {
      sqlOptions: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        lineWrapping: true,
        mode: "text/x-mysql",
        extraKeys: { Ctrl: "autocomplete" },
      },
    };
  },
  computed: {
    extendable() {
      return this.block.script_type === "1" && this.block.action_type && this.block.action_type !== "0";
    },
    codeRef() {
      return this.$refs.codemirror.codemirror;
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
        formula: FORMULAR[0].v,
        condition: CONDITION[0].v,
      });
    },
    delHandler(index) {
      this.block.field_config.splice(index, 1);
    },
    onCodemirrorReady(cm) {
      cm.on("keypress", () => {
        cm.showHint({ completeSingle: false });
      });
    },
  },
};
</script>
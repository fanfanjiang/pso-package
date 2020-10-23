<template>
  <div class="sql-designer">
    <div class="sql-designer-l">
      <el-collapse v-model="activeMenu">
        <el-collapse-item title="基础信息" name="base">
          <el-form class="sql-designer-base" size="mini" label-position="left" label-width="110px">
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
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="脚本生成" name="generate">
          <div class="sql-designer-gen">
            <div class="sql-designer-gen__header">
              <el-tooltip :visible-arrow="false" effect="dark" content="选择源表单" placement="top-start">
                <picker-form :data="source" form-field="data_code" source="3" position="top" @loaded="sourceFormCheck"></picker-form>
              </el-tooltip>
              <el-tooltip :visible-arrow="false" effect="dark" content="选择目标表单" placement="top-start" v-if="extendable">
                <picker-form form-field="data_code" source="3" position="top" :data="block" @loaded="targetFormCheck"></picker-form>
              </el-tooltip>
            </div>
            <div class="sql-designer__op">
              <el-button v-if="extendable" size="mini" type="success" :disabled="!selectedSrc.length" @click="genTarget"
                >生成目标字段</el-button
              >
              <el-button size="mini" type="success" @click="genSql">生成脚本</el-button>
            </div>
            <el-table size="mini" style="width: 100%" :data="sourceFields" @selection-change="srcSelectHandler">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="fieldDisplay" label="源字段" show-overflow-tooltip></el-table-column>
              <el-table-column label="目标字段" v-if="extendable">
                <template slot-scope="scope">
                  <el-select size="mini" v-model="scope.row.tfield" filterable clearable>
                    <el-option v-for="(tf, i) in targetFields" :key="i" :label="tf.fieldDisplay" :value="tf.field_name"></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item title="字段设置" name="field" v-if="extendable">
          <div class="sql-designer-field">
            <div class="sql-designer__op">
              <el-button size="mini" type="danger" :disabled="!selectedTarget.length" @click="delTarget">删除</el-button>
            </div>
            <el-table size="mini" style="width: 100%" :data="block.field_config" @selection-change="targetSelectHandler">
              <el-table-column type="index" :index="1" width="20"></el-table-column>
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="display" label="目标字段" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column prop="efield" label="来源字段">
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
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="sql-designer-r">
      <div class="sql-designer-ctl">
        <el-tooltip v-if="textMarks.length" effect="dark" content="隐藏字段名称" placement="top-start">
          <div class="sql-designer-ctl__btn" @click="clearTextMarks">
            <i class="fa fa-eye-slash"></i>
          </div>
        </el-tooltip>
        <el-tooltip v-else effect="dark" content="显示字段名称" placement="top-start">
          <div class="sql-designer-ctl__btn" @click="decorate">
            <i class="fa fa-eye"></i>
          </div>
        </el-tooltip>
        <el-tooltip effect="dark" content="调试" placement="top-start">
          <div class="sql-designer-ctl__btn" @click="debugScript">
            <i class="fa fa-bug"></i>
          </div>
        </el-tooltip>
      </div>
      <codemirror ref="codemirror" :options="sqlOptions" v-model="block.script" @ready="onCodemirrorReady" />
    </div>
  </div>
</template>
<script>
import SQLCONST from "./const";
import PickerForm from "../picker/pso-picker-form";

export default {
  components: { PickerForm },
  props: {
    block: {
      type: Object,
    },
    scode: {
      type: String,
      default: "",
    },
    params: Array,
    paramsN: String,
    paramsV: String,
  },
  data() {
    Object.assign(this, SQLCONST);
    return {
      source: { data_code: this.scode },
      sourceFields: [],
      targetFields: [],
      selectedSrc: [],
      selectedTarget: [],
      textMarks: [],
      activeMenu: ["base", "generate", "field"],
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
    tablePrefix() {
      let fix = "";
      switch (this.block.relate_type) {
        case "0":
          fix = "psotable";
          break;
        case "1":
          fix = "psomain";
          break;
        case "2":
          fix = "psoleaf";
          break;
      }
      return fix;
    },
    tableFields() {
      return this.sourceFields.concat(this.targetFields);
    },
  },
  methods: {
    onCodemirrorReady(cm) {
      cm.on("keypress", () => {
        cm.showHint({ completeSingle: false });
      });
    },
    sourceFormCheck(data) {
      data.forEach((d) => {
        this.$set(d, "tfield", "");
      });
      this.sourceFields = data;
    },
    targetFormCheck(data) {
      this.targetFields = data;
    },
    srcSelectHandler(data) {
      this.selectedSrc = data;
    },
    genTarget() {
      this.selectedSrc.forEach(({ field_name, tfield }) => {
        if (tfield) {
          const target = _.find(this.targetFields, { field_name: tfield });
          this.makeTarget(target, field_name);
        }
      });
    },
    wrapTable(code = "") {
      if (this.block.script_type === "0") {
        return `DATA_EXT_${this.source.data_code}`;
      } else {
        return `T[${this.tablePrefix}${this.source.data_code}${code}]`;
      }
    },
    genSql() {
      let fields = "*";
      if (this.selectedSrc.length) {
        fields = "";
        this.selectedSrc.forEach((s, i) => {
          fields += s.field_name + (i === this.selectedSrc.length - 1 ? "" : ",");
        });
      }

      this.codeRef.replaceSelection(`SELECT ${fields} FROM ${this.wrapTable()}\nWHERE`);
      this.codeRef.focus();
    },
    clearTextMarks() {
      this.textMarks.forEach((m) => {
        m.clear();
      });
      this.textMarks = [];
    },
    decorate() {
      const codeRef = this.codeRef;
      let n = 0;
      const matches = [];
      codeRef.eachLine((line) => {
        const fMaps = {};
        this.tableFields.forEach((f) => {
          const { field_name: regText } = f;
          if (!fMaps.hasOwnProperty(regText)) {
            fMaps[regText] = regText;
            const reg = new RegExp(regText, "g");

            while (true) {
              const match = reg.exec(line.text);
              if (!match) break;
              matches.push({ n, match, field: f });
            }
          }
        });
        n++;
      });
      for (let { n, match, field } of matches) {
        this.textMarks.push(
          codeRef.markText(
            { line: n, ch: match.index },
            { line: n, ch: match.index + match[0].length },
            {
              replacedWith: $(`<span class="code-widget"><span>${field.fieldDisplay || field._fieldName}</span></span>`)[0],
              selectLeft: true,
              selectRight: true,
            }
          )
        );
      }
    },
    makeTarget(field, efield = "") {
      this.block.field_config.push({
        field_format: field.field_format,
        output_format: field.output_format,
        is_sys: field.is_sys,
        display: field.fieldDisplay,
        sfield: field._fieldValue,
        efield,
        formula: this.FORMULAR[0].v,
        condition: this.CONDITION[0].v,
      });
    },
    targetSelectHandler(data) {
      this.selectedTarget = data;
    },
    delTarget(list) {
      this.selectedTarget.forEach((t) => {
        this.block.field_config.splice(_.findIndex(this.block.field_config, t), 1);
      });
    },
    async debugScript() {
      const ret = await this.API.debugSQLScript({ script: this.block, scode: this.scode });
    },
  },
};
</script>
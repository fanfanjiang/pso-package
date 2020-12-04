<template>
  <div class="sql-designer">
    <div class="sql-designer-l">
      <el-collapse v-model="activeMenu">
        <el-collapse-item title="基础信息" name="base">
          <el-form class="sql-designer-base" size="mini" label-position="top">
            <div class="form-wrapper">
              <el-form-item label="名称" required>
                <el-input v-if="!names" size="mini" v-model="block.name"></el-input>
                <el-select v-else size="mini" v-model="block.name" filterable>
                  <el-option v-for="(n, i) in names" :key="i" :label="n" :value="n"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="类型" required>
                <el-select size="mini" v-model="block.script_type" filterable>
                  <el-option v-for="(itm, i) in TYPE" :key="i" :label="itm.n" :value="itm.v"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-wrapper">
              <picker-form
                from-text="来源表"
                :data="source"
                form-field="data_code"
                source="3"
                position="top"
                required
                @loaded="sourceCheck"
              ></picker-form>
              <el-form-item label="参数">
                <el-select size="mini" v-model="block.params" filterable multiple collapse-tags>
                  <el-option v-for="(p, i) in paramsOptions" :key="i" :label="p._fieldName" :value="p._fieldValue"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-wrapper">
              <el-form-item label="数据来源" required>
                <el-select size="mini" v-model="block.relate_type" filterable>
                  <el-option v-for="(itm, i) in RELATE" :key="i" :label="itm.n" :value="itm.v"></el-option>
                </el-select>
              </el-form-item>
              <picker-form
                from-text="查询主表"
                :data="querySource"
                form-field="data_code"
                source="3"
                position="top"
                required
                @loaded="sourceFormCheck"
              ></picker-form>
            </div>
            <div class="form-wrapper" v-if="showSubSource">
              <picker-form
                from-text="查询子表"
                :filter="subFilter"
                :data="querySubSource"
                form-field="data_code"
                source="3"
                position="top"
                required
                @loaded="sourceSubFormCheck"
              ></picker-form>
            </div>
            <div class="form-wrapper">
              <el-form-item label="索引">
                <el-checkbox v-model="block.is_index" true-label="1" false-label="0">开启索引</el-checkbox>
              </el-form-item>
              <el-form-item label="目标类型" required>
                <el-select size="mini" v-model="block.action_type" filterable>
                  <el-option v-for="(itm, i) in OP" :key="i" :label="itm.n" :value="itm.v"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-wrapper" v-if="extendable">
              <picker-form
                from-text="目标表"
                form-field="data_code"
                source="3"
                position="top"
                :data="block"
                required
                @loaded="targetFormCheck"
              ></picker-form>
            </div>
            <div v-if="copyProxy.length">
              <el-divider content-position="left">子表配置</el-divider>
              <div class="sql-designer-copyitem" v-for="(d, i) in copyProxy" :key="i">
                <el-checkbox v-model="d.checked">{{ d.name }}</el-checkbox>
                <div>
                  <el-radio v-model="d.f_type" label="1">复制</el-radio>
                  <el-radio v-model="d.f_type" label="2">链式</el-radio>
                </div>
              </div>
            </div>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="脚本生成" name="generate">
          <div class="sql-designer-gen" v-show="trueSource.length">
            <div class="sql-designer__op">
              <el-button size="mini" type="success" @click="genSql">生成脚本</el-button>
            </div>
            <el-tabs key="sourceTab" v-model="activeTab" type="card">
              <el-tab-pane v-for="tab in sourceTabs" :key="tab.v" :label="tab.n" :name="tab.v"> </el-tab-pane>
            </el-tabs>
            <el-table ref="sourceTable" size="mini" style="width: 100%" :data="decidedSource" @selection-change="srcSelectHandler">
              <el-table-column :selectable="() => (showSubSource ? !showParamSetting : true)" type="selection" width="55"></el-table-column>
              <el-table-column prop="fieldDisplay" label="源字段" show-overflow-tooltip></el-table-column>
              <el-table-column prop="param" label="参数" width="180" v-if="showParamSetting">
                <template slot-scope="scope">
                  <el-select size="mini" v-model="scope.row.param" filterable clearable @change="paramChange">
                    <el-option v-for="(p, i) in paramsOptions" :key="i" :label="p._fieldName" :value="p._fieldValue"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="condition" label="条件" width="80" v-if="showParamSetting">
                <template slot-scope="scope">
                  <el-select size="mini" v-model="scope.row.condition" filterable>
                    <el-option v-for="(d, i) in CONDITION" :key="i" :label="d.n" :value="d.v"></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <pso-empty v-show="!trueSource.length" text="请选择查询主表或查询子表"></pso-empty>
        </el-collapse-item>
        <el-collapse-item title="字段设置" name="field" v-if="extendable && block.field_config.length">
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
              <el-table-column label="条件" width="80">
                <template slot-scope="scope">
                  <el-select size="mini" v-model="scope.row.condition" filterable>
                    <el-option v-for="(d, i) in CONDITION" :key="i" :label="d.n" :value="d.v"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="公式" width="100">
                <template slot-scope="scope">
                  <el-select size="mini" v-model="scope.row.formula" filterable>
                    <el-option v-for="(f, i) in FORMULAR" :key="i" :label="f.n" :value="f.v"></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="sql-designer-c">
      <div class="sql-designer-ctl">
        <div class="sql-designer-ctl__l">
          <div v-if="extendable" class="sql-designer-ctl__btn" @click="showSelector = true">
            <i class="el-icon-finished"></i><span>选择目标字段</span>
          </div>
        </div>
        <div class="sql-designer-ctl__r">
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
      </div>
      <codemirror ref="codemirror" :options="sqlOptions" v-model="block.script" @ready="onCodemirrorReady" />
      <div class="sql-designer-debug">
        <div class="sql-designer-debug__header">
          <el-tabs key="debugTab" v-model="activeDebugTab" @tab-click="showDebugPanel = true">
            <el-tab-pane label="参数设置" name="params"></el-tab-pane>
            <el-tab-pane label="输出" name="result"></el-tab-pane>
          </el-tabs>
          <div v-if="showDebugPanel" class="sql-designer-ctl__btn" @click="showDebugPanel = false">
            <i class="el-icon-close"></i>
          </div>
        </div>
        <div class="sql-designer-debug__body" v-show="showDebugPanel">
          <div class="sql-designer-debug__params" v-show="activeDebugTab === 'params'">
            <div class="sql-designer__op">
              <el-button size="mini" type="success" @click="showInstancePicker = true">选择已有数据</el-button>
            </div>
            <pso-form-interpreter
              v-if="formCfg"
              ref="formImage"
              :form-entity="formCfg"
              :data-instance="instance"
              @data-loaded="formLoaded"
            ></pso-form-interpreter>
          </div>
          <div class="sql-designer-debug__result" v-show="activeDebugTab === 'result'">
            <div v-html="debugResult"></div>
            <pso-skeleton v-show="debuging" :lines="1"></pso-skeleton>
          </div>
        </div>
      </div>
    </div>
    <div class="sql-designer-r" v-show="block.is_index === '1'">
      <div class="sql-designer-ctl">
        <div class="sql-designer-ctl__l"></div>
        <div class="sql-designer-ctl__r">
          <el-dropdown @command="indexAddHandler" size="mini" trigger="click">
            <div class="sql-designer-ctl__btn">
              <i class="el-icon-plus"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(dex, i) in INDEX" :key="i" :command="dex.n">{{ dex.n }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="sql-designer-tip">
        <el-input type="textarea" placeholder="请输入" v-model="block.index_script"> </el-input>
      </div>
    </div>
    <pso-dialog :visible="showSelector" width="50%" @close="showSelector = false">
      <template #title>
        <div class="form-executor-header sql-designer-header">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-finished"></i>
              <span>选择目标字段</span>
            </div>
          </div>
        </div>
      </template>
      <div class="sql-designer-gen">
        <div class="sql-designer__op">
          <el-button size="mini" type="success" :disabled="!selectedTargetSrc.length" @click="genTarget">生成目标字段</el-button>
        </div>
        <el-tabs key="targetTab" v-model="activeTargetTab" type="card">
          <el-tab-pane label="系统字段" name="sys"> </el-tab-pane>
          <el-tab-pane label="非系统字段" name="nosys"> </el-tab-pane>
        </el-tabs>
        <el-table size="mini" style="width: 100%" :data="decidedTarget" @selection-change="tarSelectHandler">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="fieldDisplay" label="目标字段" show-overflow-tooltip></el-table-column>
          <el-table-column label="源字段">
            <template slot-scope="scope">
              <el-select size="mini" v-model="scope.row._sfield" filterable clearable>
                <el-option v-for="(tf, i) in trueSource" :key="i" :label="tf.fieldDisplay" :value="tf.field_name"></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </pso-dialog>
    <pso-dialog
      width="70%"
      append-to-body
      close-on-click-modal
      custom-class="form-table-dialog"
      title="选择数据"
      @close="showInstancePicker = false"
      :visible="showInstancePicker"
    >
      <pso-form-view
        :cfgId="scode"
        checkbox
        :deletable="false"
        selection-type="radio"
        :view-auth="4"
        :addable="false"
        :edtail-editable="false"
        selectable
        :changable="false"
        :stageable="false"
        @selection-confirm="instanceChange"
      ></pso-form-view>
    </pso-dialog>
  </div>
</template>
<script>
import SQLCONST from "./const";
import PickerForm from "../picker/pso-picker-form";
import dayjs from "dayjs";
import { makeSysFormFields } from "../../tool/form";
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
    names: Array,
  },
  data() {
    Object.assign(this, SQLCONST);
    this.TABS = [
      { n: "主表系统字段", v: "sys", o: 1 },
      { n: "主表业务字段", v: "nosys", o: 1 },
      { n: "子表系统字段", v: "sub_sys", o: 2 },
      { n: "子表业务字段", v: "sub_nosys", o: 2 },
    ];
    this.forms = [];
    return {
      source: { data_code: this.scode },
      querySource: { data_code: this.scode },
      querySubSource: { data_code: "" },
      activeTab: "sys",
      paramsOptions: [],
      sourceFields: [],
      subSourceFields: [],
      targetFields: [],
      selectedSrc: [],
      selectedTargetSrc: [],
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
      showSelector: false,
      activeDebugTab: "result",
      showDebugPanel: false,
      debugParams: {},
      debuging: false,
      debugResult: "",
      activeTargetTab: "sys",
      formCfg: null,
      store: null,
      showInstancePicker: false,
      instance: null,
      copyProxy: [],
    };
  },
  computed: {
    copyTarget() {
      const asts = [];
      if (this.paramsOptions.length && this.targetFields.length) {
        this.paramsOptions.forEach((d) => {
          if (d.componentid === "asstable") {
            const exist = _.find(this.targetFields, { _option: d._option });
            if (exist) {
              asts.push(exist);
            }
          }
        });
      }
      return asts;
    },
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
      return this.sourceFields.concat(this.subSourceFields, this.paramsOptions, this.targetFields);
    },
    showSubSource() {
      return this.block.relate_type !== "0";
    },
    subFilter() {
      return _.map(
        this.sourceFields.filter((f) => f.componentid === "asstable"),
        "_option"
      );
    },
    decidedTarget() {
      return this.targetFields.filter((d) => (this.activeTargetTab === "sys" ? d.is_sys === "1" : d.is_sys !== "1"));
    },
    searchSub() {
      return this.block.relate_type === "2";
    },
    trueSource() {
      return this.searchSub ? this.subSourceFields : this.sourceFields;
    },
    paramsSource() {
      return this.block.relate_type !== "2" ? this.sourceFields : this.subSourceFields;
    },
    parmsTabs() {
      return this.searchSub ? ["sys", "nosys"] : ["sub_sys", "sub_nosys"];
    },
    decidedSource() {
      const source = ["sys", "nosys"].includes(this.activeTab) ? this.sourceFields : this.subSourceFields;
      const isSysTab = ["sys", "sub_sys"].includes(this.activeTab);
      return source.filter((d) => (isSysTab ? d.is_sys === "1" : d.is_sys !== "1"));
    },
    sourceTabs() {
      return _.orderBy(
        this.TABS.filter((t) => (!this.showSubSource ? !["sub_sys", "sub_nosys"].includes(t.v) : true)),
        ["o"],
        [this.searchSub ? "desc" : "asc"]
      );
    },
    showParamSetting() {
      return this.showSubSource ? this.parmsTabs.includes(this.activeTab) : true;
    },
  },
  watch: {
    "block.params"(params, preParams) {
      for (let p of preParams) {
        this.$delete(this.debugParams, p);
        delete this.debugParams[p];
      }
      for (let p of params) {
        this.$set(this.debugParams, p);
      }
      this.checkParams();
    },
    "block.relate_type"() {
      this.$refs.sourceTable.clearSelection();
    },
    copyTarget: {
      deep: true,
      handler() {
        if (this.block.data_code && !this.targetFields.length) return;
        this.getCopyTarget();
      },
    },
    copyProxy: {
      deep: true,
      handler() {
        this.block.child_config = this.copyProxy.filter((d) => d.checked);
      },
    },
  },
  methods: {
    getCopyTarget() {
      const list = [];
      this.copyTarget.forEach((d) => {
        const item = { name: this.getForm(d._option).node_display, efield: d._option };
        const exist = _.find(this.block.child_config, { efield: d._option });
        let checked = false;
        let f_type = "1";
        if (exist) {
          checked = exist.checked;
          f_type = exist.f_type;
        }
        this.$set(item, "checked", checked);
        this.$set(item, "f_type", f_type);
        list.push(item);
      });
      this.copyProxy = list;
    },
    getForm(node_name) {
      return _.find(this.forms, { node_name }) || {};
    },
    onCodemirrorReady(cm) {
      cm.on("keypress", () => {
        cm.showHint({ completeSingle: false });
      });
    },
    sourceCheck({ fields, config, forms }) {
      this.paramsOptions = fields;
      const data_design = makeSysFormFields().concat(JSON.parse(config.data_design));
      this.formCfg = { ...config, data_design };
      if (!this.forms.length) {
        this.forms = forms;
      }
    },
    formLoaded(store) {
      this.store = store;
      this.checkParams();
    },
    instanceChange(instances) {
      if (instances.length) {
        this.instance = instances[0];
      }
      this.showInstancePicker = false;
    },
    checkParams() {
      if (this.store) {
        this.store._forEach((cpnt) => {
          if (this.block.params.includes(cpnt.data._fieldValue)) {
            cpnt.data._hideForever = false;
            cpnt.data._read = false;
            this.$set(cpnt.data, "forceShow", true);
          } else if (!cpnt.CPNT.layout) {
            cpnt.data._hideForever = true;
            this.$set(cpnt.data, "forceShow", false);
          }
          cpnt.data._required = false;
        });
      }
    },
    prepareSource(data) {
      data.forEach((d) => {
        this.$set(d, "param", "");
        this.$set(d, "condition", "1");
      });
    },
    sourceFormCheck({ fields }) {
      this.prepareSource(fields);
      this.sourceFields = fields;
      this.subSourceFields = [];
    },
    sourceSubFormCheck({ fields }) {
      this.prepareSource(fields);
      this.subSourceFields = fields;
    },
    targetFormCheck({ fields }) {
      fields.forEach((d) => {
        this.$set(d, "_sfield", "");
      });
      this.targetFields = fields;
    },
    srcSelectHandler(data) {
      this.selectedSrc = data;
    },
    tarSelectHandler(data) {
      this.selectedTargetSrc = data;
    },
    genTarget() {
      this.selectedTargetSrc.forEach((target) => {
        if (target._sfield) {
          this.makeTarget(target, target._sfield);
        }
      });
      this.showSelector = false;
    },
    wrapTable() {
      if (this.block.script_type === "0") {
        return `DATA_EXT_${this.querySource.data_code}`;
      } else {
        return `T[${this.tablePrefix}${this.querySource.data_code}` + (this.showSubSource ? `;${this.querySubSource.data_code}]` : "]");
      }
    },
    paramChange(value) {
      this.paramsSource.forEach((d) => {
        if (d.param && this.block.params.indexOf(d.param) === -1) {
          this.block.params.push(d.param);
        }
      });
    },
    genSql() {
      //检查数据是否合法
      if (!this.querySource.data_code) {
        return this.$message({ message: "请选择查询主表", type: "warning" });
      }
      if (this.showSubSource && !this.querySource.data_code) {
        return this.$message({ message: "请选择查询子表", type: "warning" });
      }

      let fields = "*";
      let where = [];
      console.log(this.paramsSource);
      this.paramsSource.forEach((s) => {
        if (s.param) {
          where.push(`${s.field_name}=@${s.param}`);
        }
      });

      if (this.selectedSrc.length) {
        fields = "";
        this.selectedSrc.forEach((s, i) => {
          fields += s.field_name + (i === this.selectedSrc.length - 1 ? "" : ",");
        });
      }
      this.codeRef.replaceSelection(`SELECT ${fields} FROM ${this.wrapTable()}\nWHERE\n${where.join(" AND\n")}`);
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
        this.forms.forEach((f) => {
          const reg = new RegExp(f.node_name, "g");
          while (true) {
            const match = reg.exec(line.text);
            if (!match) break;
            matches.push({ n, match, field: { fieldDisplay: f.node_display } });
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
        field_format: field._field_format,
        output_format: field._output_format,
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
      this.showDebugPanel = true;
      this.activeDebugTab = "result";

      try {
        let data = { dataArr: [{}] };
        if (this.$refs.formImage) {
          data = await this.$refs.formImage.makeData();
        }
        this.debuging = true;
        const ret = await this.API.debugSQLScript({ script: this.block, scode: this.scode, paramvalue: data.dataArr[0] });
        this.debugResult += `[${dayjs().format("HH:mm:ss")}]     ${JSON.stringify(ret)}</br>`;
        this.debuging = false;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    indexAddHandler(n) {
      const sql = _.find(this.INDEX, { n });
      let text = sql.v;
      text = text.replace("@main@", this.wrapTable());
      text = text.replace("@sub@", `DATA_EXT_${this.querySubSource.data_code || ""}`);
      this.block.index_script += text;
    },
  },
};
</script>
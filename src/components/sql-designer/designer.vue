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
                v-if="block.is_msg !== '1'"
                from-text="目标表"
                form-field="data_code"
                source="3"
                position="top"
                :data="block"
                required
                @loaded="targetFormCheck"
              ></picker-form>
              <el-form-item v-else label="目标表" required>
                <span>消息表</span>
              </el-form-item>
            </div>
          </el-form>
        </el-collapse-item>
        <el-collapse-item v-if="block.is_msg === '1'" title="消息设置" name="message">
          <el-form class="sql-designer-base" size="mini" label-position="left">
            <div class="sql-designer__search">
              <span></span>
              <el-button size="mini" type="success" @click="genColumn">发布列表</el-button>
            </div>
            <div class="form-wrapper">
              <el-form-item label="标题" required>
                <option-input :data="block.msgData" id-field="msg_title" t-field="title_is_field" :options="columns"></option-input>
              </el-form-item>
              <el-form-item label="提醒方式" required>
                <el-select size="mini" v-model="block.msgData.msg_notice" filterable clearable>
                  <el-option v-for="(o, i) in NOTICE_WAY" :key="i" :label="o.n" :value="o.v"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-wrapper">
              <el-form-item label="分类" required>
                <el-select size="mini" v-model="block.msgData.msg_type" filterable clearable>
                  <el-option v-for="(o, i) in msgMains" :key="i" :label="o.map_key2" :value="o.map_key0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="子类" required>
                <el-select size="mini" v-model="block.msgData.msg_sub_type" filterable clearable>
                  <el-option v-for="(o, i) in msgSubs" :key="i" :label="o.map_key2" :value="o.map_key0"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-wrapper">
              <el-form-item label="主体" required>
                <option-input :data="block.msgData" id-field="msg_body" t-field="body_is_field" :options="columns"></option-input>
              </el-form-item>
              <el-form-item label="数据ID" required>
                <option-input :data="block.msgData" id-field="data_id" t-field="data_is_field" :options="columns"></option-input>
              </el-form-item>
            </div>
            <div class="form-wrapper">
              <el-form-item label="URL" required>
                <el-tag style="margin-right: 10px" v-if="msgUrlProxy" size="medium" closable @close="delMsgUrl"
                  >{{ msgUrlProxy.node_display || msgUrlProxy.menu_name }}
                </el-tag>
                <pso-picker-tree :request-options="{ dimen: '1' }" pattern="radio" rootable @confirm="confirmMsgUrl">
                  <el-button size="mini" type="primary" plain>选择菜单</el-button>
                </pso-picker-tree>
              </el-form-item>
            </div>
            <div class="form-wrapper">
              <el-form-item label="发送主体" required>
                <el-select size="mini" v-model="block.msgData.msg_sender" filterable clearable>
                  <el-option v-for="(o, i) in MSG_SENDER" :key="i" :label="o.n" :value="o.v"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="消息目标" required>
                <el-select size="mini" v-model="block.msgData.msg_goal" filterable clearable>
                  <el-option v-for="(o, i) in MSG_TARGET" :key="i" :label="o.n" :value="o.v"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-wrapper">
              <el-form-item label="收件人类型" required>
                <el-select size="mini" v-model="block.msgData.receiver_type" filterable clearable>
                  <el-option v-for="(o, i) in MSG_RECEIVER" :key="i" :label="o.n" :value="o.v"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="到期处理方式" required>
                <el-select size="mini" v-model="block.msgData.msg_act" filterable clearable>
                  <el-option v-for="(o, i) in MSG_EXPIRE_HANDLER" :key="i" :label="o.n" :value="o.v"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-wrapper" v-if="block.msgData.receiver_type !== '4'">
              <msg-receiver :block="block" :columns="columns"></msg-receiver>
            </div>
            <div class="form-wrapper">
              <el-form-item label="到期日期" required>
                <el-date-picker v-model="block.msgData.msg_expire" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
              </el-form-item>
              <el-form-item label="提醒日期" required>
                <el-date-picker v-model="block.msgData.msg_call" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
              </el-form-item>
            </div>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="脚本生成" name="generate">
          <div class="sql-designer-gen" v-show="trueSource.length">
            <div class="sql-designer__search">
              <div class="">
                <pso-search text="查询字段" v-model="sourcekyd"></pso-search>
              </div>
              <div>
                <el-button size="mini" @click="genColumn">发布列表</el-button>
                <el-button size="mini" type="success" @click="genSql">生成脚本</el-button>
              </div>
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
            <el-tab-pane label="列表" name="column"></el-tab-pane>
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
          <div class="sql-designer-debug__column" v-show="activeDebugTab === 'column'">
            <el-table size="mini" style="width: 100%" :data="columns">
              <el-table-column type="index" :index="1" width="40"></el-table-column>
              <el-table-column prop="field" label="字段" show-overflow-tooltip></el-table-column>
              <el-table-column prop="name" label="名称" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="name" label="显示">
                <template slot-scope="scope">
                  <el-input size="mini" v-model="scope.row.display"></el-input>
                </template>
              </el-table-column>
            </el-table>
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
        <div class="sql-designer__search">
          <pso-search text="查询字段" v-model="targetkyd"></pso-search>
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
        :cfgId="source_code"
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
import { formatJSONList } from "../../utils/util";
import { SQL_FEILDS } from "../../const/sys";
import OptionInput from "./option-input";
import MsgReceiver from "./msg-receiver";

export default {
  components: { PickerForm, OptionInput, MsgReceiver },
  props: {
    block: {
      type: Object,
    },
    scode: {
      type: String,
      default: "",
    },
    names: Array,
    msgMains: Array,
    msgSubs: Array,
  },
  data() {
    Object.assign(this, SQLCONST);
    this.TABS = [
      { n: "主表字段", v: "main", o: 1 },
      { n: "子表字段", v: "sub", o: 2 },
    ];
    this.forms = [];
    return {
      source: { data_code: "" },
      querySource: { data_code: "" },
      querySubSource: { data_code: "" },
      activeTab: "main",
      paramsOptions: [],
      sourceFields: [],
      subSourceFields: [],
      targetFields: [],
      selectedSrc: [],
      selectedTargetSrc: [],
      selectedTarget: [],
      textMarks: [],
      activeMenu: ["base", "generate", "field", "message"],
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
      sourcekyd: "",
      targetkyd: "",
      initializing: true,
      columning: false,
      columns: [],
      msgUrlProxy: null,
    };
  },
  computed: {
    source_code() {
      return this.block.scode || this.scode;
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
        case "3":
          fix = "psoall";
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
      return this.targetFields.filter(
        (d) =>
          (this.activeTargetTab === "sys" ? d.is_sys === "1" : d.is_sys !== "1") &&
          (this.targetkyd ? d.fieldDisplay.search(this.targetkyd) !== -1 : true)
      );
    },
    searchSub() {
      return this.block.relate_type === "2";
    },
    trueSource() {
      return this.searchSub ? this.subSourceFields : this.sourceFields;
    },
    paramsSource() {
      return this.block.relate_type === "1" ? this.subSourceFields : this.sourceFields;
    },
    parmsTabs() {
      return this.searchSub ? ["main"] : ["sub"];
    },
    decidedSource() {
      const data = ["main"].includes(this.activeTab) ? this.sourceFields : this.subSourceFields;
      return data.filter((d) => (this.sourcekyd ? d.fieldDisplay.search(this.sourcekyd) !== -1 : true));
    },
    sourceTabs() {
      return _.orderBy(
        this.TABS.filter((t) => (!this.showSubSource ? !["sub"].includes(t.v) : true)),
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
      this.clearSourceParam();
    },
    "source.data_code"(val) {
      this.block.scode = val;
    },
    "querySource.data_code"(val) {
      this.block.query_code = val;
    },
    "querySubSource.data_code"(val) {
      this.block.query_sub_code = val;
    },
    columns: {
      deep: true,
      handler() {
        this.$emit("gencolumn", this.columns);
      },
    },
  },
  async created() {
    this.source.data_code = this.source_code;
    this.querySource.data_code = this.block.query_code || this.source_code || "";
    this.querySubSource.data_code = this.block.query_sub_code || "";

    if (this.block.is_msg === "1") {
      this.targetFields = _.cloneDeep(this.MSG_FIELDS);

      formatJSONList([this.block.msgData], SQL_FEILDS.msgData);

      if (this.block.msgData.msg_url) {
        const ret = await this.API.getTreeNode({ code: this.block.msgData.msg_url });
        if (ret.success && ret.data && ret.data.data) {
          this.confirmMsgUrl([ret.data.data]);
        }
      }
    }
  },
  methods: {
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
    clearSourceParam() {
      this.prepareSource(this.sourceFields);
      this.prepareSource(this.subSourceFields);
    },
    sourceFormCheck({ fields }) {
      this.prepareSource(fields);
      this.sourceFields = fields;
      //避免初始化的时候把子表置为空
      if (!this.initializing) {
        this.subSourceFields = [];
      }
      this.initializing = false;
      if (!this.searchSub) {
        this.genColumn();
      }
    },
    sourceSubFormCheck({ fields }) {
      this.prepareSource(fields);
      this.subSourceFields = fields;
      if (this.searchSub) {
        this.genColumn();
      }
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
        if (line.text) {
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
        }
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
        field_format: field._field_format || "",
        output_format: field._output_format || "",
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
    delTarget() {
      this.selectedTarget.forEach((t) => {
        this.block.field_config.splice(_.findIndex(this.block.field_config, t), 1);
      });
    },
    async debugScript() {
      this.showDebugPanel = true;
      this.activeDebugTab = "result";

      try {
        const paramvalue = await this.getDebugParams();
        this.debuging = true;
        const ret = await this.API.debugSQLScript({ script: this.block, paramvalue });
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
      text = text.replace("@main@", this.querySource.data_code);
      text = text.replace("@sub@", `${this.querySubSource.data_code || ""}`);
      this.block.index_script += text;
    },
    async getDebugParams() {
      try {
        if (this.$refs.formImage) {
          return (await this.$refs.formImage.makeData()).dataArr[0];
        }
      } catch (error) {}
      return {};
    },
    async genColumn() {
      if (!this.block.script) return;
      this.showDebugPanel = true;
      this.activeDebugTab = "column";

      this.columning = true;
      const paramvalue = await this.getDebugParams();
      const ret = await this.API.getColumnBySql({ script: this.block, paramvalue });
      if (ret.success && ret.data) {
        this.columns = JSON.parse(ret.data.data).map((d) => {
          const exist = _.find(this.trueSource, { _fieldValue: d.field });
          if (exist) {
            d.name = exist.fieldDisplay;
            d.display = exist._fieldName || "";
          }
          return d;
        });
        this.$emit("gencolumn", this.columns);
      }
      this.columning = false;
    },
    confirmMsgUrl(data) {
      if (data.length) {
        this.msgUrlProxy = data[0];
        this.block.msgData.msg_url = this.msgUrlProxy.node_name || this.msgUrlProxy.menu_code;
      }
    },
    delMsgUrl() {
      this.msgUrlProxy = null;
      this.block.msgData.msg_url = "";
    },
  },
};
</script>
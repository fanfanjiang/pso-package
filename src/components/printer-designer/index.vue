<template>
  <div style="padding: 10px">
    <el-row :gutter="10">
      <el-col :xs="8" :sm="8" :md="6" v-for="(t, i) in templates" :key="i">
        <p-template @click="showTemplate(i)" @command="commandHandler($event, i)" :data="t"></p-template>
      </el-col>
      <el-col :xs="8" :sm="8" :md="6">
        <p-template @click="addTemplate">
          <template #top>
            <i class="el-icon-plus" style="font-size: 20px"></i>
          </template>
          <div>添加模板</div>
        </p-template>
      </el-col>
    </el-row>
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>新增模板</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <el-form label-position="left" label-width="100px" size="small">
          <el-form-item label="参考模板" required>
            <pso-picker-print @selected="onCopyTemp"></pso-picker-print>
          </el-form-item>
          <el-form-item label="模板名称" required>
            <el-input size="small" v-model="curInstance.name"></el-input>
          </el-form-item>
          <el-form-item label="数据源类型" required>
            <el-select filterable clearable size="small" v-model="curInstance.source" @change="sourceChange">
              <el-option label="表单" value="1"></el-option>
              <el-option label="统计数据" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="统计插件" required v-if="curInstance.source === '2'">
            <el-select filterable clearable size="small" v-model="curInstance.code">
              <el-option v-for="(t, i) in statsList" :key="i" :label="t.node_display" :value="t.node_name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板类型" required>
            <el-select filterable clearable size="small" v-model="curInstance.type">
              <el-option label="通用模板" value="1"></el-option>
              <el-option label="富文本模板" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模式" required>
            <el-select filterable clearable size="small" v-model="curInstance.mode">
              <el-option label="关联表自增" value="1"></el-option>
              <el-option label="主表自增" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
    <pso-dialog :visible="showDesigner" width="100%" top="0px" @close="showDesigner = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>编辑模板</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveTemplate()">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div style="height: 100%">
        <print-god
          ref="god"
          v-if="curTemplate && curTemplate.type === '1'"
          :source="curTemplate.source"
          :code="curTemplate.code"
          :data="curTemplate.config"
          :mode="curTemplate.mode"
          headless
        ></print-god>
        <rich-designer
          ref="rich"
          v-if="curTemplate && curTemplate.type === '2'"
          :source="curTemplate.source"
          :code="curTemplate.code"
          :content="curTemplate.content"
          :saveButton="false"
        ></rich-designer>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { formatJSONList } from "../../utils/util";
import PTemplate from "./template";
import shortid from "shortid";
import RichDesigner from "../rich-designer";
import PrintGod from "../print-god";
import PsoPickerPrint from "../picker/pso-picker-print";

const PRINTER_FIELDS = {
  id: "",
  name: "", //名称
  source: "1", //数据源类型
  code: "", //数据源ID
  type: "1", //模板类型
  mode: "1",
  content: "", //模板内容
  config: {}, //模板配置
};

export default {
  components: { PTemplate, RichDesigner, PrintGod, PsoPickerPrint },
  props: {
    formId: String,
  },
  data() {
    return {
      showEditor: false,
      showDesigner: false,
      templates: [],
      statsList: [],
      statsCache: {},
      curInstance: {},
      curTemplate: null,
    };
  },
  created() {
    this.fetchTemplate(this.formId);
    this.fetchStats();
  },
  methods: {
    async fetchTemplate(code) {
      const ret = await this.API.getTreeNode({ code });
      if (ret.success) {
        const { printer_config } = ret.data.data;
        if (printer_config) {
          this.templates = formatJSONList(printer_config, PRINTER_FIELDS);
        }
      }
    },
    async fetchStats() {
      //获取所有统计插件
      this.statsList = await this.API.getTempleteTree([1]);
    },
    addTemplate() {
      this.curInstance = _.cloneDeep(PRINTER_FIELDS);
      this.curInstance.id = shortid.generate();
      this.curInstance.code = this.formId;
      this.showEditor = true;
    },
    onCopyTemp(data) {
      delete data.id;
      delete data.code;
      Object.assign(this.curInstance, data);
    },
    removeTemplate(index) {
      this.templates.splice(index, 1);
      this.save();
    },
    showTemplate(index) {
      this.curTemplate = null;
      this.$nextTick(() => {
        this.curTemplate = this.templates[index];
        this.showDesigner = true;
      });
    },
    saveHandler() {
      this.templates.push(this.curInstance);
      this.showEditor = false;
      this.showTemplate(this.templates.length - 1);
    },
    commandHandler(command, i) {
      if (command === "remove") {
        this.removeTemplate(i);
      }
    },
    sourceChange() {
      this.curInstance.code = this.curInstance.source === "1" ? this.formId : "";
    },
    async saveTemplate() {
      const { type } = this.curTemplate;
      if (type === "1") {
        this.curTemplate.config = await this.$refs.god.save();
      } else {
        this.curTemplate.content = this.$refs.rich.exportHtml();
      }
      this.save();
    },
    async save() {
      const ret = await this.API.updateFormTree({ data_code: this.formId, printer_config: JSON.stringify(this.templates) });
      this.ResultNotify(ret);
    },
  },
};
</script>
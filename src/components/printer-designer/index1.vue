<template>
  <div class="printer-designer" v-loading="initializing">
    <template v-if="!initializing">
      <div class="printer-designer-header">
        <pso-header title="打印模板" :backable="false">
          <template v-slot:btn>
            <el-button type="primary" size="mini" @click="newTemplate"> 新建模板 </el-button>
            <el-button v-if="curTemplate" type="danger" size="mini" @click="delTemplate"> 删除模板 </el-button>
            <el-button size="mini" icon="fa fa-floppy-o" :loading="saving" :disabled="saving" @click="saveHandler"> 保存 </el-button>
          </template>
        </pso-header>
      </div>
      <div class="printer-designer-body" v-if="curTemplate">
        <div class="printer-designer-l">
          <div class="printer-designer-menu">
            <el-form size="small" label-position="top">
              <el-form-item label="选择模板">
                <el-select size="mini" v-model="curTemplateId">
                  <el-option v-for="(t, i) in templates" :key="i" :label="t.name" :value="t.id"></el-option>
                </el-select>
              </el-form-item>
              <template v-if="curTemplate">
                <el-form-item label="模板名称">
                  <el-input size="mini" v-model="curTemplate.name"></el-input>
                </el-form-item>
                <el-form-item label="模板类型">
                  <el-select size="mini" v-model="curTemplate.type">
                    <el-option label="富文本" value="1"></el-option>
                    <el-option label="列表" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-form>
          </div>
        </div>
        <div class="printer-designer-c">
          <rich-designer
            v-if="curTemplate.type === '1'"
            ref="rich"
            :options="options"
            :content="curTemplate.content"
            :saveButton="false"
          ></rich-designer>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import PsoHeader from "../header";
import RichDesigner from "../rich-designer";
import { formOp } from "../form-designer/mixin";
import { makeSysFormFields } from "../../tool/form";
import { formatJSONList } from "../../utils/util";
import shortid from "shortid";

const PRINTER_FIELDS = {
  id: "",
  source: "1",
  code: "",
  type: "1",
  name: "",
  content: "",
  img: "",
  config: {},
};

export default {
  mixins: [formOp],
  props: ["params"],
  components: { PsoHeader, RichDesigner },
  data() {
    return {
      initializing: true,
      saving: false,
      options: [],
      templates: [],
      curTemplateId: "",
      curTemplate: null,
    };
  },
  computed: {
    code() {
      return this.params.code;
    },
    asstables() {
      return this.options.filter((d) => d.componentid === "asstable");
    },
  },
  watch: {
    curTemplateId() {
      this.setCurTemplate();
    },
  },
  async created() {
    await this.makeFormStore(this.code);
    if (this.formStore) {
      this.options = this.formStore.search({ onlyData: true, options: { db: true } }).concat(makeSysFormFields());
      await this.loadTemplate();
    }
    this.initializing = false;
  },
  methods: {
    async loadTemplate() {
      const ret = await this.API.getTreeNode({ code: this.code });
      if (ret.success) {
        const { printer_config } = ret.data.data;
        if (printer_config) {
          this.templates = formatJSONList(printer_config, PRINTER_FIELDS);
          this.setCurTemplateId();
        } else {
          this.newTemplate();
        }
      }
    },
    newTemplate() {
      this.templates.push({ ..._.cloneDeep(PRINTER_FIELDS), code: this.code, name: "新建模板", id: shortid.generate() });
      this.setCurTemplateId();
    },
    delTemplate() {
      const index = this.templates.indexOf(this.curTemplate);
      if (index !== -1) {
        this.templates.splice(index, 1);
      }
      this.setCurTemplateId();
    },
    setCurTemplateId() {
      if (this.templates.length) {
        this.curTemplateId = this.templates[this.templates.length - 1].id;
      } else {
        this.curTemplateId = "";
      }
    },
    setCurTemplate() {
      this.curTemplate = null;
      this.$nextTick(() => {
        this.curTemplate = this.curTemplateId ? _.find(this.templates, { id: this.curTemplateId }) : null;
      });
    },
    async saveHandler() {
      this.saving = true;
      if (this.curTemplate.type === "1") {
        this.curTemplate.content = this.$refs.rich.exportHtml();
      }
      const ret = await this.API.updateFormTree({
        data_code: this.code,
        printer_config: JSON.stringify(this.templates),
      });
      this.ResultNotify(ret);
      this.saving = false;
    },
  },
};
</script>
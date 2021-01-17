<template>
  <div class="printer-designer" v-loading="initializing">
    <template v-if="!initializing">
      <div class="printer-designer-header">
        <pso-header title="表单打印" :backable="false">
          <template v-slot:btn>
            <el-button v-if="curTemplate" type="primary" size="mini" icon="fa fa-floppy-o" @click="print"> 打印 </el-button>
          </template>
        </pso-header>
      </div>
      <div class="printer-designer-body">
        <div class="printer-designer-l">
          <div class="printer-designer-menu">
            <el-form size="small" label-position="top">
              <el-form-item label="选择模板">
                <el-select size="mini" v-model="curTemplateId">
                  <el-option v-for="(t, i) in templates" :key="i" :label="t.name" :value="t.id"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="printer-designer-c" v-if="curTemplate">
          <div class="printer-content">
            <div v-if="curTemplate.type === '1'" ref="printer" v-html="curTemplate.content"></div>
            <list-printer v-if="curTemplate.type === '2'" ref="printer" :config="curTemplate.config"></list-printer>
          </div>
          <pso-form-interpreter
            ref="formImage"
            v-show="false"
            :form-id="code"
            :data-id="instanceId"
            :editable="false"
            @value-change="formChangeHandler"
            @shownval-done="formChangeHandler"
            @data-loaded="formLoadedHandler"
          ></pso-form-interpreter>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import PsoHeader from "../header";
import { formOp } from "../form-designer/mixin";
import { Printer } from "../../mixin/form";
import ListPrinter from "./list";

export default {
  mixins: [formOp, Printer],
  props: ["params"],
  components: { PsoHeader, ListPrinter },
  data() {
    return {
      initializing: true,
      saving: false,
      templates: [],
      curTemplateId: "",
      curTemplate: null,
    };
  },
  computed: {
    code() {
      return this.params.code;
    },
    instanceId() {
      return this.params.id;
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
          this.templates = JSON.parse(printer_config);
          this.setCurTemplateId();
        }
      }
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
    print() {
      if (this.curTemplate.type === "1") {
        this.createPDF(this.$refs.printer, this.formStore.data_name, true);
      } else if (this.curTemplate.type === "2") {
        this.$refs.printer.print();
      }
    },
    formChangeHandler(data) {
      if (this.curTemplate.type === "1") {
        this.setPrinterValue(data);
      } else if (this.curTemplate.type === "2") {
        this.$refs.printer.analyze(data);
      }
    },
    async formLoadedHandler(store) {
      this.printRef = this.$refs.printer;
      $(this.printRef).children("div table").addClass("bald");
      for (let key in store.instance) {
        if (store.cpntsMap[key]) {
          await this.formChangeHandler({ cpnt: store.cpntsMap[key], value: store.cpntsMap[key].data._val });
        } else {
          await this.formChangeHandler({ cpnt: { data: { _fieldValue: key } }, value: store.instance[key] });
        }
      }
    },
  },
};
</script>
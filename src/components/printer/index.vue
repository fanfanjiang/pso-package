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
        <div class="printer-designer-c" v-if="curTemplate && curTemplate.type === '2' && curTemplate.source === '1'">
          <div class="printer-content">
            <div ref="printer" v-html="curTemplate.content"></div>
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
import { Printer } from "../../mixin/form";
import FormProxy from "../printer-designer/formProxy";

export default {
  mixins: [Printer],
  props: ["params"],
  components: { PsoHeader },
  data() {
    return {
      initializing: true,
      saving: false,
      templates: [],
      curTemplateId: "",
      curTemplate: null,
      formProxy: null,
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
    await this.loadTemplate();
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
      this.$nextTick(async () => {
        this.curTemplate = this.curTemplateId ? _.find(this.templates, { id: this.curTemplateId }) : null;
        if (this.curTemplate.type === "1" || (this.curTemplate.type === "2" && this.curTemplate.source === "2")) {
          this.formProxy = new FormProxy({ code: this.code, source: this.curTemplate.source });
          await this.formProxy.analyze({ asstable: true });
        }
      });
    },
    formChangeHandler(data) {
      this.setPrinterValue(data);
    },
    formLoadedHandler(store) {
      this.printRef = this.$refs.printer;
      $(this.printRef).children("div table").addClass("bald");
      for (let key in store.instance) {
        if (store.cpntsMap[key]) {
          this.setPrinterValue({ cpnt: store.cpntsMap[key], value: store.cpntsMap[key].data._val });
        } else {
          this.setPrinterValue({ cpnt: { data: { _fieldValue: key } }, value: store.instance[key] });
        }
      }
    },
    async print() {
      const { type, mode } = this.curTemplate;
      if (type === "2") {
        this.createPDF(this.$refs.printer, this.formStore.data_name, true);
      } else if (type === "1") {
        const data = await this.formProxy.fetch({ ids: this.instanceId, mode });
        const ret = await this.API.request("/api/form/data/print", {
          data: { ...this.curTemplate, data, mainCode: this.formProxy.store.data_code, map: this.formProxy.getCpntMap() },
        });
        if (ret.success) {
          // window.open(`http://127.0.0.1:9002/static/temp/${ret.data.name}.pdf`);
          window.open(`/pdf?url=/static/temp/${ret.data.name}.pdf`);
        }
      }
    },
  },
};
</script>
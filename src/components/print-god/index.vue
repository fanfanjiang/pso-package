<template>
  <div class="printgod" v-loading="initializing">
    <div class="printgod-header">
      <pso-header title="打印设计">
        <template #btn v-if="!initializing">
          <el-button type="primary" size="mini" @click="save">保存</el-button>
        </template>
      </pso-header>
    </div>
    <div class="printgod-body">
      <div class="printgod-body-l">
        <div class="printgod-body-aside" v-if="!initializing">
          <div class="printgod-body-aside-tab">
            <el-tabs v-model="curTab">
              <el-tab-pane label="数据字段" name="biz"></el-tab-pane>
              <el-tab-pane label="系统字段" name="sys"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="printgod-fields dropable" put="false" pull="clone" sort="false">
            <div class="printgod-fields-section">
              <div class="printgod-fields-section-title">
                {{ print.store.data_name }}
              </div>
              <div class="printgod-fields-section-body">
                <div class="printgod-fields-item" v-for="(d, i) in print.store.search()" :key="i">
                  <template v-if="curTab === 'biz' ? d.data.__sys__ !== '1' : d.data.__sys__ === '1'">
                    <div class="dragable" :text="d.data._fieldName">[标题]{{ d.data._fieldName }}</div>
                    <div class="dragable" :fid="d.data._fieldValue" :text="d.data._fieldName">[字段]{{ d.data._fieldName }}</div>
                  </template>
                </div>
              </div>
            </div>
            <el-divider content-position="left" v-if="print.assStores.length">关联表</el-divider>
            <div class="printgod-fields-section" v-for="(ast, i) in print.assStores" :key="i">
              <div class="printgod-fields-section-title">
                {{ ast.data_name }}
              </div>
              <div class="printgod-fields-section-body">
                <div class="printgod-fields-item" v-for="(d, i) in ast.search()" :key="i">
                  <template v-if="curTab === 'biz' ? d.data.__sys__ !== '1' : d.data.__sys__ === '1'">
                    <div class="dragable" :text="d.data._fieldName">[标题]{{ d.data._fieldName }}</div>
                    <div class="dragable" :ast="ast.data_code" :fid="d.data._fieldValue" :text="d.data._fieldName">
                      [字段]{{ d.data._fieldName }}
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="printgod-body-r">
        <div class="printgod-designer">
          <div class="printgod-designer-menu">
            <print-menu v-if="!initializing" :print="print"></print-menu>
          </div>
          <div class="printgod-designer-sheet">
            <div ref="sheet" class="printgod-designer-sheet-body"></div>
            <sheet-tab :print="print"></sheet-tab>
            <template v-if="print.sheet">
              <paper-h :print="print"></paper-h>
              <paper-v :print="print"></paper-v>
              <backimg :print="print"></backimg>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PsoHeader from "../header";

import DragAndDrop from "../form-designer/drag-drop";
import FormStore from "../form-designer/model/store";
import Print from "./print";
import PrintMenu from "./menu";
import { makeFormByPluginModule } from "../../tool/form";
import PaperH from "./paper-h";
import PaperV from "./paper-v";
import Backimg from "./backimg";
import SheetTab from "./sheet-tab";

export default {
  components: { PsoHeader, PrintMenu, PaperH, PaperV, Backimg, SheetTab },
  props: {
    code: String,
  },
  data() {
    return {
      initializing: true,
      print: {},
      curTab: "biz",
    };
  },
  computed: {},
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      //初始化表单或脚本配置
      if (!this.code) return;
      this.initializing = true;

      let ret = await this.API.formsCfg({ data: { id: this.code, auth: 1 }, method: "get" });
      if (!ret.success) {
        ret = await makeFormByPluginModule({ code: this.chartCfg.formId });
      }
      const store = new FormStore({ ...ret.data, designMode: false, withSys: true });
      const assStores = await store.getAsstable();

      this.print = new Print({ $sheet: this.$refs.sheet, store, assStores, $vue: this });

      this.initializing = false;

      this.$nextTick(() => {
        this.dragAndDrop = DragAndDrop.init({
          onStart: (evt) => {
            this.print.sheet.addDragField(evt.item);
          },
          onDrop: (evt) => {
            this.print.sheet.checkDragField(evt.item);
          },
        });
      });
    },
    async save() {
      const children = {};
      const data = await this.print.save();
      const asstables = this.print.store.search({ options: { componentid: "asstable" } });
      asstables.forEach((d) => {
        children[d.data._fieldValue] = d.data._option;
      });

      const ret = await this.API.request("/api/form/data/print", { data: { ...data, code: this.code, children } });
      if (ret.success) {
        window.open(`http://127.0.0.1:9002/static/temp/${ret.data.name}.pdf`);
      }
    },
  },
};
</script>

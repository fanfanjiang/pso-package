<template>
  <div class="printgod" v-loading="initializing">
    <div class="printgod-header" v-if="!headless">
      <pso-header title="打印设计">
        <template #btn v-if="!initializing">
          <el-button type="primary" size="mini" @click="save">保存</el-button>
        </template>
      </pso-header>
    </div>
    <div class="printgod-body" :style="bodyStyle">
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
                    <div class="dragable" :title="d.data._fieldValue" :fid="d.data._fieldValue" :text="d.data._fieldName">
                      [字段]{{ d.data._fieldName }}
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <template v-if="mode === '1'">
              <el-divider content-position="left" v-if="print.assStores.length">关联表</el-divider>
              <div class="printgod-fields-section" v-for="(ast, i) in print.assStores" :key="i">
                <div class="printgod-fields-section-title">
                  {{ ast.data_name }}
                </div>
                <div class="printgod-fields-section-body">
                  <div class="printgod-fields-item" v-for="(d, i) in ast.search()" :key="i">
                    <template v-if="curTab === 'biz' ? d.data.__sys__ !== '1' : d.data.__sys__ === '1'">
                      <div class="dragable" :text="d.data._fieldName">[标题]{{ d.data._fieldName }}</div>
                      <div
                        class="dragable"
                        :title="d.data._fieldValue"
                        :ast="ast.data_code"
                        :fid="d.data._fieldValue"
                        :text="d.data._fieldName"
                      >
                        [字段]{{ d.data._fieldName }}
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </template>
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
import FormProxy from "../printer-designer/formProxy";

import PsoHeader from "../header";
import DragAndDrop from "../form-designer/drag-drop";
import Print from "./print";
import PrintMenu from "./menu";
import PaperH from "./paper-h";
import PaperV from "./paper-v";
import Backimg from "./backimg";
import SheetTab from "./sheet-tab";

export default {
  components: { PsoHeader, PrintMenu, PaperH, PaperV, Backimg, SheetTab },
  props: {
    code: String,
    source: {
      type: String,
      default: "1",
    },
    mode: {
      type: String,
      default: "1",
    },
    headless: {
      type: Boolean,
      default: false,
    },
    data: Object,
  },
  data() {
    return {
      initializing: true,
      print: {},
      curTab: "biz",
    };
  },
  computed: {
    bodyStyle() {
      return {
        height: `calc(100% - ${this.headless ? "0px" : "50px"})`,
      };
    },
  },
  created() {
    this.initialize();
  },
  destroyed() {
    if (this.print.hot) {
      this.print.hot.destroy();
    }
  },
  methods: {
    async initialize() {
      //初始化表单或脚本配置
      if (!this.code) return;
      this.initializing = true;

      const formProxy = new FormProxy({ code: this.code, source: this.source });
      await formProxy.analyze({ asstable: true });

      this.print = new Print({
        $vue: this,
        $sheet: this.$refs.sheet,
        store: formProxy.store,
        assStores: formProxy.assStores,
        ...this.data,
      });

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
      return await this.print.save();
    },
  },
};
</script>
<style lang="less">
.htContextMenu:not(.htGhostTable) {
  z-index: 9999999 !important;
}
</style>

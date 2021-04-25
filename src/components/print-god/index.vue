<template>
  <div class="printgod" v-loading="initializing">
    <div class="printgod-header">
      <pso-header title="打印设计"></pso-header>
    </div>
    <div class="printgod-body">
      <div class="printgod-body-l">
        <div class="printgod-body-aside" v-if="print && print.store">
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
            <print-menu :print="print"></print-menu>
          </div>
          <div class="printgod-designer-sheet">
            <div ref="sheet"></div>
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

export default {
  components: { PsoHeader, PrintMenu },
  props: {
    code: String,
  },
  data() {
    return {
      initializing: true,
      print: null,
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

      this.initializing = false;

      this.$nextTick(() => {
        this.print = new Print({ $sheet: this.$refs.sheet, store, assStores });

        this.dragAndDrop = DragAndDrop.init({
          onStart: (evt) => {
            this.print.addDragField(evt.item);
          },
          onDrop: (evt) => {
            this.print.checkDragField(evt.item);
          },
        });
      });
    },
  },
};
</script>
<style lang="less">
.printgod {
  height: 100%;
  .printgod-header {
    height: 50px;
  }
  .printgod-body {
    display: flex;
    height: calc(100% - 50px);
    .printgod-body-l {
      width: 200px;
      height: 100%;
    }
    .printgod-body-r {
      flex: 1;
      height: 100%;
    }
  }
  .printgod-body-aside-tab {
    .el-tabs__nav-scroll {
      text-align: center;
      .el-tabs__nav {
        float: none;
        display: inline-block;
      }
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
  }
  .printgod-body-aside {
    height: 100%;
  }
  .printgod-fields {
    overflow: auto;
    height: calc(100% - 40px);
  }
  .printgod-designer {
    height: 100%;
    .printgod-designer-menu {
      height: 39px;
      border-left: 1px solid #cccccc;
      border-right: 1px solid #cccccc;
      padding: 0 10px;
    }
    .printgod-designer-sheet {
      height: calc(100% - 39px);
      overflow: auto;
    }
  }
}
</style>
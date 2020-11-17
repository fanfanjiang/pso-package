<template>
  <div class="pso-view-designer" v-loading="initializing">
    <div class="pso-view-designer__header">
      <pso-header title="页面设计" @back="$emit('back')" v-if="storeReady">
        <template v-slot:btn>
          <el-button
            :disabled="!formStore.canUndo"
            type="primary"
            size="small"
            icon="fa fa-undo"
            plain
            @click="()=>formStore.undo()"
          ></el-button>
          <el-button
            :disabled="!formStore.canRedo"
            type="primary"
            size="small"
            icon="fa fa-repeat"
            plain
            @click="()=>formStore.redo()"
          ></el-button>
          <el-button v-if="step===1" type="text" @click="step=2">添加脚本</el-button>
          <el-button v-if="step===2" type="text" @click="step=1">上一步</el-button>
          <el-button
            type="primary"
            size="small"
            icon="fa fa-floppy-o"
            :loading="saving"
            :disabled="saving"
            @click="formSaveHandler"
          >保存</el-button>
        </template>
      </pso-header>
    </div>
    <div class="pso-view-designer__body">
      <designer-body
        @store-ready="formReadyHandler"
        :components="formMenu"
        :data="formCfg"
        v-if="step===1&&!initializing"
      ></designer-body>
      <pso-script-designer :cpnts="cpnts" :code="code" v-if="step===2"></pso-script-designer>
    </div>
  </div>
</template>
<script>
import PsoHeader from "../header";
import PsoScriptDesigner from "../script-designer";
import DesignerBody from "../form-designer/designer-body";

export default {
  props: ["params"],
  components: { DesignerBody, PsoHeader, PsoScriptDesigner },
  data() {
    return {
      saving: false,
      storeReady: false,
      initializing: true,
      formCfg: {},
      formStore: {},
      formMenu: {
        布局组件: ["row", "div"],
        基础组件: ["carousel", "chart", "graphiccard"],
      },
      step: 1,
      code: null,
      tpType: 2,
    };
  },
  computed: {
    cpnts() {
      return this.code ? null : (this.formStore.root && this.formStore.root.data) || null;
    },
  },
  async created() {
    this.initializing = true;
    if (this.params.tpCode) {
      const ret = await this.API.templates({ data: { tp_type: this.tpType, tp_code: this.params.tpCode } });
      if (ret.success && ret.data.tp.data_list) {
        const data = JSON.parse(ret.data.tp.data_list);
        if (Array.isArray(data)) {
          this.formCfg.data_config = data;
        } else {
          this.code = data;
          this.step = 2;
        }
      }
    }
    this.formCfg.forceInsertSys = false;
    this.initializing = false;
  },
  methods: {
    async formSaveHandler() {
      this.saving = true;
      let data = {
        tp_code: this.params.tpCode,
        tp_type: this.tpType,
      };
      if (this.step === 1) {
        data.data_list = JSON.stringify(this.formStore.root.data.children);
      } else {
        data.data_list = JSON.stringify({
          jsCode: this.viewEidtor.jsCode,
          htmlCode: this.viewEidtor.htmlCode,
          cssCode: this.viewEidtor.cssCode,
        });
      }
      const ret = await this.API.templates({ data, method: "put" });
      this.ResultNotify(ret);
      this.$emit("saved", data);
      this.saving = false;
    },
    formReadyHandler(store) {
      this.formStore = store;
      this.storeReady = true;
    },
  },
};
</script>
<style lang="less" scoped>
.pso-view-designer {
  height: 100%;
  position: relative;
  .pso-view-designer__header {
    height: 50px;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
  .pso-view-designer__body {
    height: 100%;
    padding-top: 50px;
    position: relative;
    z-index: 1;
  }
}
</style>
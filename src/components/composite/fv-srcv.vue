<template>
  <div :class="layoutClass">
    <div class="lay-vv__t" :style="topStyle">
      <pso-form-view
        key="main"
        v-bind="params"
        :params="params"
        :def-limit="20"
        :table-row-click="mainRowClickHandler"
        :title-text="params.menu_name"
        :addable="opable"
        :deletable="opable"
        :detailEditable="opable"
        :modifiable="opable"
        :checkbox="opable"
        :changable="opable"
        :stageable="opable"
        @initialized="handleInitialized"
        @data-loaded="mainLoadedHandler"
      >
      </pso-form-view>
    </div>
    <div class="lay-vv__b" :style="bottomStyle" v-loading="initializing || initializingAst || fileDemanding">
      <div style="margin-top: 15px; position: relative" v-if="mainCurRow">
        <pso-form-interpreter
          v-if="!initializingAst && mainDataId"
          key="asstable"
          ref="formImage"
          :data-id="mainDataId"
          :form-entity="mainCfg"
          :data-default="mainDefForm"
          :editable="bodyEditable"
          @data-loaded="shitLoadedHandler"
          @cpnt-value-changed="shitChangeHandler"
        ></pso-form-interpreter>
        <el-button
          v-if="opable"
          style="position: absolute; top: 0px; right: 0px; z-index: 99"
          type="danger"
          size="small"
          plain
          :disabled="!selected.length"
          @click="delHandler"
          >删除</el-button
        >
        <knowl-table :opable="false" :checkable="opable" :instances="resources" @selection-change="knowChangeHandler"></knowl-table>
      </div>
    </div>
  </div>
</template>
<script>
import { FormAsMainMixin } from "../../mixin/composite";
import { Resource } from "../../mixin/resource";
import KnowlTable from "../knowl/table";
export default {
  mixins: [FormAsMainMixin, Resource],
  components: { KnowlTable },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      initializing: true,
      resources: [],
      selected: [],
    };
  },
  computed: {
    opable() {
      return !!this.params.opable;
    },
  },
  methods: {
    async handleInitialized(option) {
      this.mainInitedHandler(option);
      this.initializing = false;
    },
    async shitResource() {
      this.resources = [];
      const fileCpnts = this.shitStore.search({ options: { componentid: "attachment" }, onlyData: true });
      const files = [];
      fileCpnts.forEach((cpnt) => {
        const resourceVal = cpnt._val;
        if (resourceVal) {
          files.push(...resourceVal.split(","));
        }
      });
      if (files.length) {
        this.resources = await this.demandFiles(files.join(","));
      }
    },
    shitLoadedHandler(store) {
      this.shitStore = store;
      this.shitStore._forEach((cpnt) => {
        const invisible = cpnt.data.componentid !== "attachment" ? true : !this.opable;
        cpnt.data._hideFieldName = true;
        cpnt.data._hideForever = cpnt.data._hideOnNew = invisible;
        this.$set(cpnt.data, "forceShow", !invisible);
        if (cpnt.data.componentid === "attachment") {
          this.$set(cpnt.data, "_hideShowBox", true);
        }
      });
      this.shitResource();
    },
    shitChangeHandler({ cpnt }) {
      if (cpnt.data.componentid === "attachment") {
        this.$nextTick(async () => {
          await this.saveAst();
          this.shitResource();
        });
      }
    },
    delHandler() {
      const fileCpnts = this.shitStore.search({ options: { componentid: "attachment" } });
      fileCpnts.forEach((cpnt) => {
        this.selected.forEach((d) => cpnt.__deleteCpntValue(d));
      });
    },
    knowChangeHandler(data) {
      this.selected = data;
    },
  },
};
</script>

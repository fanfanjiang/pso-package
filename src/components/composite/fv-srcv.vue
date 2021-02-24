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
      <div style="margin-top: 15px" v-if="mainCurRow">
        <knowl-table :opable="false" :checkable="false" :instances="resources"></knowl-table>
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
    async onMainRowClick() {
      this.resources = [];
      const fileCpnts = this.vStore.store.search({ options: { componentid: "attachment" }, onlyData: true });
      const files = [];
      fileCpnts.forEach((cpnt) => {
        const resourceVal = this.mainCurRow[cpnt._fieldValue];
        if (resourceVal) {
          files.push(...resourceVal.split(","));
        }
      });
      if (files.length) {
        this.resources = await this.demandFiles(files.join(","));
      }
    },
  },
};
</script>

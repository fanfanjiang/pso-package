<template>
  <div :class="layoutClass" v-loading="saving">
    <div class="lay-vv__t" :style="topStyle">
      <pso-form-view
        key="main"
        v-bind="params"
        :params="{ ...params, hideAuthTab: true, hideStatusTab: true, hideTablefun: true, hideViewTitle: true }"
        :def-limit="20"
        :table-row-click="mainRowClickHandler"
        :addable="opable"
        :deletable="opable"
        :detailEditable="opable"
        :modifiable="opable"
        :checkbox="opable"
        :changable="opable"
        :stageable="opable"
        simple-pagination
        @initialized="handleInitialized"
        @data-loaded="mainLoadedHandler"
      >
      </pso-form-view>
    </div>
    <div class="lay-vv__b" :style="bottomStyle" v-loading="initializing || initializingAst">
      <template v-if="mainCurRow">
        <pso-statistics :params="statsParams"></pso-statistics>
      </template>
    </div>
  </div>
</template>
<script>
import { FormAsMainMixin } from "../../mixin/composite";
export default {
  mixins: [FormAsMainMixin],
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      initializing: true,
      saving: false,
      pluginParams: {},
    };
  },
  computed: {
    opable() {
      return !!this.params.opable;
    },
    statsCode() {
      if (this.params.__relatedstatus__) {
        return this.params.__relatedstatus__.statsId;
      }
      return "";
    },
    relation() {
      if (this.params.__relatedstatus__) {
        return this.params.__relatedstatus__.relation;
      }
      return [];
    },
    statsParams() {
      let defKeys = "";
      const list = [];
      this.relation.forEach(({ s, t }) => {
        if (s && t) {
          list.push(`${t}#${this.mainCurRow[s]}#1`);
        }
      });
      defKeys = list.join(";");
      return { plug_code: this.statsCode, pluginParams: this.pluginParams, viewAuth: this.params.viewAuth, defKeys };
    },
  },
  methods: {
    async handleInitialized(option) {
      this.mainInitedHandler(option);
      const ret = await this.API.getTreeNode({ code: this.statsCode });
      const { route_setting } = ret.data.data;
      if (route_setting) {
        const pluginParams = JSON.parse(route_setting);
        pluginParams.forEach(({ field }) => {
          this.$set(this.pluginParams, field, "");
        });
      }
      this.initializing = false;
    },
  },
};
</script>

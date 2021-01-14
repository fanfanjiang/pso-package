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
        <pso-form-view v-bind="assParams" :params="assParams"></pso-form-view>
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
    };
  },
  computed: {
    opable() {
      return !!this.params.opable;
    },
    assParams() {
      let defForm = null;
      const params = {};
      if (this.mainCurRow) {
        if (this.params.sourceField && this.params.targetField) {
          defForm = {
            [this.params.targetField]: this.mainCurRow[this.params.sourceField],
          };
        }
      }
      for (let key in this.params) {
        if (/^ass__/.test(key)) {
          params[key.replace("ass__", "")] = this.params[key];
        }
      }
      return { ...this.params, ...params, defComplexity: "", defForm, useCloumn: this.params.ass_useCloumn || "" };
    },
  },
  methods: {
    async handleInitialized(option) {
      this.mainInitedHandler(option);
      this.initializing = false;
    },
  },
};
</script>

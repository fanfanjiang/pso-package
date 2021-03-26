<template>
  <div :class="layoutClass" v-loading="saving">
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
    <div class="lay-vv__b" :style="bottomStyle" v-loading="initializing || initializingAst">
      <template v-if="mainCurRow">
        <pso-wf-view :params="workflowParams"></pso-wf-view>
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
    workflowParams() {
      let defForm = null;
      if (this.mainCurRow) {
        if (this.params.formSourceField && this.params.wfTargetField) {
          defForm = { [this.params.wfTargetField]: this.mainCurRow[this.params.formSourceField] };
          if (this.params.fmatchup) {
            for (let mup of this.params.fmatchup) {
              if (mup.trg && typeof this.mainCurRow[mup.src] !== "undefined" && this.mainCurRow[mup.src] !== "") {
                defForm[mup.trg] = this.mainCurRow[mup.src];
              }
            }
          }
        }
      } 
      return {
        wfId: this.params.wfId,
        textGroup: this.params.wfTextGroup,
        searchType: this.params.wfSearchType,
        defKeys: this.params.wfDefKeys,
        viewAuth: this.params.viewAuth,
        hideTitle: true,
        defForm,
      };
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

<template>
  <div :class="viewClass" v-loading="saving">
    <div class="lay-vv__t" :style="topStyle">
      <pso-wf-view :params="wfParams" op-column @initialized="handleInitialized" @data-loaded="mainLoadedHandler"> </pso-wf-view>
    </div>
    <div class="lay-vv__b" :style="bottomStyle" v-loading="initializing">
      <template v-if="asstables.length">
        <div class="lay-vv__b-header" v-show="asstables.length > 1">
          <el-tabs v-model="activeAst" @tab-click="changeAst">
            <el-tab-pane :label="t.name" :name="t.id" v-for="t in asstables" :key="t.id"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="lay-vv__b__body">
          <pso-form-interpreter
            v-if="!initializingAst && mainDataId"
            key="asstable"
            ref="formImage"
            :data-id="mainDataId"
            :form-entity="mainCfg"
            :data-default="mainDefForm"
            :editable="bodyEditable"
            @data-loaded="astLoadedHandler"
            @cpnt-value-changed="astChangeHandler"
            @asstable-change="astChangeHandler"
          ></pso-form-interpreter>
        </div>
      </template>
      <template v-else>
        <pso-empty title="无关联数据"></pso-empty>
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
    viewClass() {
      return { "no-b-header": this.asstables.length < 2, ...this.layoutClass };
    },
    astFilter() {
      return this.params.asstables && Array.isArray(this.params.asstables) && this.params.asstables;
    },
    opable() {
      return !!this.params.opable;
    },
    wfParams() {
      return { ...this.params, tableRowClick: this.mainRowClickHandler };
    },
  },
  methods: {
    async handleInitialized(option) {
      this.mainInitedHandler({ ...option, vStore: option.wvStore });
      await this.analyzeAsts(this.vStore.store);

      if (this.asstables.length) {
        this.activeAst = this.asstables[0].id;
      }
      this.initializing = false;
    },
  },
};
</script>


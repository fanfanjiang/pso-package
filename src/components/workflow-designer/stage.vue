<template>
  <div class="pso-wf-stage-wrapper">
    <div class="pso-wf-stage-body" v-bar>
      <div class="pso-wf-stage-scroll" ref="wfStageScroll">
        <div class="pso-wf-stage pso-wf-container" ref="wfStage" :style="stageStyle">
          <wf-node-start
            @clickNode="$emit('clickNode',$event)"
            :readMode="readMode"
            :workflowImage="workflowImage"
            :node="workflowImage.node[0]"
          ></wf-node-start>
          <wf-node-el
            @clickNode="$emit('clickNode',$event)"
            :readMode="readMode"
            :workflowImage="workflowImage"
            v-for="nodeItem in workflowImage.node[0].children"
            :key="nodeItem.nid"
            :node="nodeItem"
            :pnode="workflowImage.node[0]"
          ></wf-node-el>
          <div class="pso-wf-node-end">结束</div>
        </div>
      </div>
    </div>
    <div class="pso-wf-stage__controller">
      <wf-controller ref="wfController" @downloadStage="downloadStage"></wf-controller>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { WF_NODE_PANEL_SET, WF_CONDITION_MAKE, WF_SAVE } from "@/store/mutation-types";

import WfController from "./controller";

import WfNodeStart from "./node/nodeStart";
import WfNodeEl from "./nodeEl";

import FreeDrag from "@/mixin/free-drag";

export default {
  components: { WfNodeEl, WfNodeStart, WfController },
  mixins: [FreeDrag("wfStageScroll", "wfStage")],
  props: {
    workflowData: Object,
    readMode: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(["workflowEditor"]),
    stageStyle() {
      return {
        transform: `scale(${this.workflowEditor.stageScale})`
      };
    },
    workflowImage() {
      //workflowImage是流程图数据集，为了方便图例展示，如果传入workflowData，则不使用vuex，直接使用传入的参数workflowData
      return this.workflowData || this.workflowEditor;
    }
  },
  methods: {
    downloadStage() {
      this.$refs.wfController.download(this.$refs.wfStage);
    }
  }
};
</script>
<style lang="less">
@import "~@/assets/less/component/wfEditor.less";
</style>

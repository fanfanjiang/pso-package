<template>
  <div class="pso-wf-item">
    <div class="pso-wf-linebox">
      <div :class="nodeClass" @click="selected">
        <i class="pso-wf-node__del el-icon-error" v-if="!readMode" @click.stop="delNode"></i>
        <slot></slot>
      </div>
      <wf-plus :readMode="readMode" :node="node" :pnode="pnode"></wf-plus>
    </div>
  </div>
</template>
<script>
import WfPlus from "./plus";
import { mapState, mapGetters, mapMutations } from "vuex";
import { WF_NODE_DEL, WF_SET_SELECTED } from "../../../store/mutation-types";

export default {
  components: { WfPlus },
  props: ["node", "pnode", "readMode", "workflowImage"],
  data() {
    return {};
  },
  computed: {
    nodeClass() {
      return {
        "pso-wf-node": true,
        "pso-wf-node__selected": this.workflowImage.selectedNode ? this.workflowImage.selectedNode.nid === this.node.nid : false,
        "pso-wf-node__start": this.node.tid === "start",
        "pso-wf-node__done": this.node.done,
        "pso-wf-node__read": this.readMode,
        "pso-wf-node__click": this.workflowImage.clickedNode ? this.workflowImage.clickedNode.nid === this.node.nid : false,
        "pso-wf-node__excuting": this.workflowImage.executingNodes
          ? _.find(this.workflowImage.executingNodes, { step: this.node.nid })
          : false
      };
    }
  },
  methods: {
    ...mapMutations([WF_NODE_DEL, WF_SET_SELECTED]),
    delNode() {
      if (this.readMode) return;
      this[WF_NODE_DEL]({ node: this.node, pnode: this.pnode });
    },
    selected() {
      this.$emit("click-node", this.node);
      if (this.readMode) return;
      this[WF_SET_SELECTED](this.node);
    }
  }
};
</script>


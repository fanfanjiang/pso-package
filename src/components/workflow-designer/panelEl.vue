<template>
  <div class="pso-wf-panel-node">
    <template v-for="node in nodesMap">
      <div :key="node.nid" v-show="workflowEditor.selectedNode.nid===node.nid">
        <panel-header
          :icon="getPanelType(node).icon"
          :info="getPanelType(node).tip"
          :name="getPanelType(node).name"
        ></panel-header>
        <component v-bind:is="currentEL(node)" :node="node"></component>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { WF_NODE_PANEL_SET, WF_FIND_NODE } from "@/store/mutation-types";

import NODE_TYPE from "./nodeType";

import panelHeader from "@/components/form-designer/common/panel-header";

import WfPanelStart from "./panel/panelStart";
import WfPanelReview from "./panel/panelReview";
import WfPanelBranchitem from "./panel/panelBranchitem";

export default {
  components: { panelHeader, WfPanelStart, WfPanelReview, WfPanelBranchitem },
  computed: {
    ...mapState(["workflowEditor"]),
    nodesMap() {
      const map = {};
      this.$store.getters[WF_FIND_NODE]({ cb: item => (map[item.nid] = item) });
      return map;
    }
  },
  methods: {
    getPanelType(node) {
      return NODE_TYPE[node.tid];
    },
    currentEL(node) {
      return `wf-panel-${node.tid}`;
    }
  }
};
</script>
<style lang="less" scoped>
.pso-wf-panel-node {
  padding: 15px;
}
</style>
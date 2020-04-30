<template>
  <component
    v-bind:is="currentEl"
    @clickNode="$emit('clickNode',$event)"
    :pnode="pnode"
    :node="node"
    :workflowImage="workflowImage"
    :readMode="readMode"
  >
    <wf-node-el
      v-for="nodeItem in node.children"
      @clickNode="$emit('clickNode',$event)"
      :key="nodeItem.nid"
      :node="nodeItem"
      :pnode="node"
      :workflowImage="workflowImage"
      :readMode="readMode"
    ></wf-node-el>
  </component>
</template>
<script>
import WfNodeBranch from "./node/nodeBranch";
import WfNodeReview from "./node/nodeReview";
import WfNodeBranchitem from "./node/nodeBranchItem";

export default {
  name: "wfNodeEl",
  props: ["node", "pnode", "workflowImage", "readMode"],
  components: { WfNodeBranch, WfNodeReview, WfNodeBranchitem },
  computed: {
    currentEl() {
      return `wf-node-${this.node.tid}`;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
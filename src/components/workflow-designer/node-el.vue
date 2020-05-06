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
import WfNodeBranch from "./node/node-branch";
import WfNodeReview from "./node/node-review";
import WfNodeBranchitem from "./node/node-branchitem";

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
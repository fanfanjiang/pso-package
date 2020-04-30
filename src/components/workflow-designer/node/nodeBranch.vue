<template>
  <div class="pso-wf-item">
    <div class="pso-wf-branch">
      <div class="pso-wf-branch__add" v-if="!readMode" @click="WF_BRANCH_ADD(node)">
        <span>+</span>
      </div>
      <slot></slot>
    </div>
    <wf-plus :node="node" :pnode="pnode" :readMode="readMode"></wf-plus>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { WF_BRANCH_ADD } from "@/store/mutation-types";

import WfPlus from "../common/plus";

export default {
  props: ["node", "pnode", "readMode"],
  components: { WfPlus },
  methods: {
    ...mapMutations([WF_BRANCH_ADD])
  }
};
</script>
<style lang="less" scoped>
</style>
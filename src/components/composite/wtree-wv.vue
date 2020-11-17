<template>
  <div class="pso-lay-ttable-wrapper">
    <div class="pso-lay-ttable">
      <div class="pso-lay-ttable__l" v-bar>
        <div>
          <pso-tree-common
            ref="tree"
            :request-options="treeOptions"
            :edit-mode="false"
            :draggable="false"
            @node-click="nodeClickHandler"
          ></pso-tree-common>
        </div>
      </div>
      <div class="pso-lay-ttable__r">
        <div class="pso-lay-ttable__content">
          <pso-wf-view :params="options" v-if="curNode"></pso-wf-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["params"],
  data() {
    return {
      initializing: true,
      curNode: null,
    };
  },
  computed: {
    treeOptions() {
      return {
        data_type: this.params.data_type,
        dimen: 7,
      };
    },
    options() {
      return { ...this.params, wfId: this.curNode.node_name };
    },
  },
  methods: {
    nodeClickHandler(node) {
      if (!node.is_leaf) return;
      this.curNode = null;
      this.$nextTick(() => {
        this.curNode = node;
      });
    },
  },
};
</script>

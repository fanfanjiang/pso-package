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
          <pso-form-view :cfg-id="curNode.node_name"></pso-form-view>
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
      curNode: {}
    };
  },
  computed: {
    treeOptions() {
      return {
        data_type: this.params.data_type,
        dimen: 3
      };
    }
  },
  methods: {
    nodeClickHandler(node) {
      if (!node.is_leaf) return;
      this.curNode = node;
    }
  }
};
</script>

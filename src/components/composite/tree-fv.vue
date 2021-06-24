<template>
  <div :class="viewClass">
    <div class="pso-view-extend">
      <div class="pso-tree">
        <div class="pso-tree__body">
          <pso-tree-common
            ref="tree"
            :edit-mode="false"
            :draggable="false"
            :request-options="treeOptions"
            @node-click="nodeClickHandler"
          ></pso-tree-common>
        </div>
      </div>
    </div>
    <div class="pso-view-body">
      <div class="pso-view-table" style="height: 100%" v-if="curNode">
        <pso-form-view v-bind="formParams" :params="formParams"></pso-form-view>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      initializing: true,
      curNode: null,
    };
  },
  computed: {
    viewClass() {
      return {
        "pso-view__expand": true,
        "pso-view__expand-wider": true,
        "pso-view-mgt": true,
        "pso-view": true,
        "pso-fvtree": true,
      };
    },
    treeOptions() {
      return {
        data_type: this.params.tree_data_type,
        dimen: this.params.tree_dimen,
      };
    },
    formParams() {
      let defForm = null;
      if (this.curNode) {
        if (this.params.sourceField && this.params.targetField) {
          defForm = {
            [this.params.targetField]: this.curNode[this.params.sourceField],
          };
        }
      }
      return { ...this.params, defForm };
    },
  },
  methods: {
    nodeClickHandler(node) {
      if (!node.is_leaf) return;
      this.curNode = node;
    },
  },
};
</script>

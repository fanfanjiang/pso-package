<template>
  <div class="pso-page">
    <div class="pso-page-body">
      <div class="pso-page__tree">
        <pso-tree-common
          ref="tree"
          :edit-mode="false"
          :draggable="false"
          :request-options="treeOptions"
          @node-click="nodeClickHandler"
        ></pso-tree-common>
      </div>
      <div class="pso-page-body__content">
        <div class="pso-page-body__wrapper" v-if="curNode">
          <pso-form-view v-bind="formParams" :params="formParams"></pso-form-view>
        </div>
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

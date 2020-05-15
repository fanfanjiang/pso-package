<template>
  <pso-picker-common
    :pattern="pattern"
    :source="source"
    :tree-option="treeOption"
    :props="props"
    :table-field="tableField"
    :tree-filter="treeFilter"
    :node-click-fun="nodeClickFun"
    :fetch-table-fun="fetchTableFun"
    @confirm="$emit('confirm',$event)"
  >
    <slot></slot>
  </pso-picker-common>
</template>
<script> 
import PsoPickerCommon from "./pso-picker-common";
 
export default {
  components: { PsoPickerCommon },
  props: {
    pattern: {
      type: String,
      default: "radio"
    },
    source: {
      type: String,
      default: "tree"
    },
    options: Object
  },
  data() {
    return {
      treeOption: {
        node_dimen: "NODEDIMEN06",
        data_type: this.options.data_type,
        resource_type: this.options.resource_type,
        searchtype: "Resource"
      },
      props: {
        tableIdName: "leaf_id",
        tableDisplayName: "r_name"
      },
      tableField: [
        { prop: "r_name", label: "资源名" },
        { prop: "r_time", label: "添加时间" }
      ],
      currentNode: null
    };
  },
  methods: {
    treeFilter(list) {
      return list.filter(item => item.is_leaf);
    },
    nodeClickFun(node) {
      this.currentNode = node;
    },
    async fetchTableFun(option) {
      return await this.API.resource({
        data: {
          ...option,
          keys: JSON.stringify({ node_id: { type: 1, value: this.currentNode.node_id } }),
          start: option.start - 1
        }
      });
    }
  }
};
</script>
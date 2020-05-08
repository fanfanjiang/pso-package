<template>
  <div class="pso-lay-btt">
    <div class="pso-lay-btt__header">
      <pso-typebar skey="GetDataTypeBar" v-model="typeVal"></pso-typebar>
    </div>
    <div class="pso-lay-btt__body" v-if="treeOptions.node_id===90">
      <data-design :appid="params.appid" :tree-options="treeOptions"></data-design>
    </div>
    <div class="pso-lay-btt__body" v-else-if="treeOptions.node_id!==''">
      <div class="pso-lay-btt__bl" v-bar>
        <div>
          <pso-tree-common
            ref="tree"
            :request-options="treeOptions"
            :default-node-data="{data_type:treeOptions.data_type}"
            @after-node-new="nodeNewdHandler"
            @before-edit-submit="nodeBeforeEditHandler"
            @node-click="nodeClickHandler"
            @before-node-edit="nodeEditHandler"
          ></pso-tree-common>
        </div>
      </div>
      <div class="pso-lay-btt__br" v-bar></div>
    </div>
  </div>
</template>
<script>
import PsoTypebar from "../type-bar";
import DataDesign from "./data";
import shortid from "shortid";

export default {
  components: { PsoTypebar, DataDesign },
  props: ["params"],
  data() {
    return {
      typeVal: {
        feildvalue: ""
      },
      selectedNode: {}
    };
  },
  computed: {
    treeOptions() {
      return {
        data_type: this.typeVal.data_type,
        node_id: this.typeVal.feildvalue,
        node_dimen: this.typeVal.node_dimen,
        searchtype: "Data"
      };
    }
  },
  methods: {
    nodeNewHandler() {
      this.$refs.tree.nodePayload.show = true;
      this.$refs.tree.nodePayload.label = `${this.typeVal.feildname}名称`;
    },
    nodeBeforeEditHandler(data) {
      if (data.is_leaf !== 0) {
        data.tp_name = data.node_name;
        data.tp_code = shortid.generate();
        data.tp_status = "0";
        data.tp_type = this.typeVal.feildvalue;
      }
    },
    nodeClickHandler(node) {
      this.selectedNode = node;
    },
    nodeEditHandler(node) {
      node.data.is_leaf && this.handleCenterEdit(node.data.tp_code);
    },
    nodeNewdHandler(data) {
      this.handleCenterEdit(data.tp_code);
    },
    handleCenterEdit(tpCode) {}
  }
};
</script>

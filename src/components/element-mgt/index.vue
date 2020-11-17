<template>
  <div class="pso-lay-btt">
    <div class="pso-lay-btt__header">
      <pso-typebar skey="getTpEleBar" v-model="typeVal"></pso-typebar>
    </div>
    <div class="pso-lay-btt__body" v-if="treeOptions.tp_type!==''">
      <div class="pso-lay-tt__bl" v-bar>
        <div>
          <pso-tree-common
            ref="tree"
            :request-options="treeOptions"
            :default-node-data="defalutNodeData"
            @after-node-new="nodeNewdHandler"
            @before-edit-submit="nodeBeforeEditHandler"
            @node-click="nodeClickHandler"
            @before-node-edit="nodeEditHandler"
          ></pso-tree-common>
        </div>
      </div>
      <div class="pso-lay-tt__br" v-bar>
        <div class="pso-lay-tt__br-content">
          <pso-chart-viewer v-if="selectedNode.tp_code" :chartId="selectedNode.tp_code"></pso-chart-viewer>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PsoTypebar from "../type-bar";
import shortid from "shortid";

export default {
  components: { PsoTypebar },
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
        data_type: "ele",
        tp_type: this.typeVal.feildvalue,
        node_id: this.typeVal.node_id,
        searchtype: "Tp",
        node_dimen: "NODEDIMEN04"
      };
    },
    defalutNodeData() {
      return {
        data_type: "ele",
        tp_type: this.typeVal.feildvalue,
        searchtype: "Tp",
        node_dimen: "NODEDIMEN04"
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
    nodeEditHandler(payload) {
      payload.node.data.is_leaf && this.handleCenterEdit(payload.node.data.tp_code);
    },
    nodeNewdHandler(data) {
      this.handleCenterEdit(data.tp_code);
    },
    handleCenterEdit(tpCode) {
      this.$emit("designer", { tpCode, tpType: this.typeVal.feildvalue });
    }
  }
};
</script>

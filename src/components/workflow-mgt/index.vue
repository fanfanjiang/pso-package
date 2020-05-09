<template>
  <div class="pso-page">
    <div class="pso-page-header">
      <pso-typebar skey="GeWorkFlowBar" v-model="typeVal"></pso-typebar>
    </div>
    <div class="pso-page-body" v-if="typeVal.node_dimen">
      <div class="pso-page__tree" v-bar>
        <div>
          <pso-tree-common
            ref="tree"
            :request-options="treeOptions"
            :default-node-data="defaultNodeData"
            :auto-edit="false"
            @before-node-new="handleNewNode"
            @before-node-edit="nodeEditHandler"
            @node-click="nodeClickHandler"
            @before-node-delete-submit="handleNodeDelete"
          ></pso-tree-common>
        </div>
      </div>
      <div class="pso-page-body__content">
        <div class="pso-page-wf__stage" v-if="!loading">
          <pso-wf-stage :workflow-data="wfImage" read-mode v-if="wfImage"></pso-wf-stage>
        </div>
        <pso-skeleton v-else :lines="5"></pso-skeleton>
      </div>
    </div>
  </div>
</template>
<script>
import PsoWfStage from "../workflow-designer/stage";
import PsoTypebar from "../type-bar";

export default {
  components: { PsoWfStage, PsoTypebar },
  props: ["params"],
  data() {
    return {
      loading: false,
      copying: false,
      currentNode: {},
      wfCfg: {},
      typeVal: {
        feildvalue: "",
        node_dimen: "",
        data_type: ""
      }
    };
  },
  computed: {
    treeOptions() {
      return {
        node_id: this.typeVal.feildvalue,
        data_type: this.typeVal.data_type,
        node_dimen: this.typeVal.node_dimen,
        searchtype: "Flow"
      };
    },
    defaultNodeData() {
      return {
        data_type: this.typeVal.data_type,
        node_dimen: this.typeVal.node_dimen
      };
    },
    wfImage() {
      return this.wfCfg.wf_map_tp;
    }
  },
  methods: {
    handleNodeDelete({ subData, data }) {
      subData.wf_code = data.wf_code;
    },
    nodeClickHandler(nodeData) {
      if (nodeData.is_leaf) {
        this.currentNode = nodeData;
        this.getWfCfg();
      }
    },
    handleNewNode(payload) {
      if (this.defaultNodeData.data_type === "flowtp") {
        this.goDesigner({});
      } else {
        this.goDesigner({ pid: payload.parent.data.node_id });
      }
    },
    nodeEditHandler(payload) {
      if (this.defaultNodeData.data_type === "flowtp") {
        this.goDesigner({ templateId: payload.node.data.node_id });
      } else {
        this.goDesigner({ node_id: payload.node.data.node_id });
      }
    },
    goDesigner(query) {
      this.$emit("designer", query);
    },
    async getWfCfg() {
      this.loading = true;
      const ret = await this.API.workflowcfg({ data: { node_id: this.currentNode.node_id } });
      this.loading = false;
      const node = JSON.parse(ret.data.wf_map_tp);
      node[0].children = node.splice(1);
      ret.data.wf_map_tp = { wfName: ret.data.wf_name, formName: "", node };
      this.wfCfg = ret.data;
    }
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
.pso-page {
  height: 100%;
  position: relative;
  .pso-page-header {
    border-bottom: 1px solid #e6e6e6;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
  }
  .pso-page-body {
    position: absolute;
    top: 41px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    overflow: hidden;
    .pso-page__tree {
      height: 100%;
      min-width: 300px;
    }
    .pso-page-body__content {
      flex: 1;
    }
  }
}
.pso-page-wf__stage {
  height: 100%;
  overflow: hidden;
}
@{deep} {
  .pso-wf-stage-wrapper {
    padding: 0;
  }
}
</style>
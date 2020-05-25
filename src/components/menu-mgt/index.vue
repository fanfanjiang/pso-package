<template>
  <div class="pso-page has-header">
    <div class="pso-page-header">
      <pso-typebar skey="getTpEleBar" v-model="typeVal"></pso-typebar>
    </div>
    <div class="pso-page-body">
      <div class="pso-page__tree" v-bar>
        <div>
          <pso-tree-common
            ref="tree"
            :request-options="treeOptions"
            :default-node-data="defaultNodeData"
            :auto-edit="true"
            @node-click="nodeClickHandler"
            @before-edit-submit="beforeNodeUpdate"
          >
            <template v-slot:default="nodeData">
              <el-form-item label="插件类型" v-if="!nodeData.node.node_id&&nodeData.node.is_leaf">
                <el-select v-model="tpType">
                  <el-option
                    v-for="item in tpTypes"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </pso-tree-common>
        </div>
      </div>
      <div class="pso-page-body__content" v-bar>
        <div>
          <div class="pso-page-body__wrapper" v-if="currentNode">
            <div class="pso-page-body__header">
              <pso-title>菜单：{{currentNode.node_display}}</pso-title>
              <div class="pso-page-body__btns"></div>
            </div>
          </div>
          <div class="pso-page-body__tab">
            <el-tabs v-model="curTab">
              <el-tab-pane label="权限设置" name="auth"></el-tab-pane>
              <el-tab-pane label="参数设置" name="preview"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="pso-page-body__body">
            <div v-if="curTab==='auth'">
              <pso-nodeauth :node="currentNode"></pso-nodeauth>
            </div>
            <div v-if="curTab==='preview'"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PsoNodeauth from "../node-auth";

export default {
  components: { PsoNodeauth },
  props: ["params"],
  data() {
    return {
      loading: false,
      copying: false,
      currentNode: {},
      tpTypes: [
        {
          name: "页面插件",
          value: 0
        },
        {
          name: "统计插件",
          value: 1
        }
      ],
      tpType: 0
    };
  },
  computed: {
    treeOptions() {
      return {
        dimen: 1,
        node_id: "3"
      };
    },
    defaultNodeData() {
      return {
        node_dimen: 1
      };
    }
  },
  methods: {
    async nodeClickHandler(nodeData) {
      if (nodeData.is_leaf) {
        this.currentNode = nodeData;
        const ret = await this.API.templates({ data: { tp_code: nodeData.node_name }, method: "get" });
        if (ret.success) {
          Object.assign(this.currentNode, ret.data.tp);
        }
      }
    },
    beforeNodeUpdate(data) {
      if (data.is_leaf) {
        data.tp_type = this.tpType;
      }
    }
  }
};
</script>
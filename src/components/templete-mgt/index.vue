<template>
  <div class="pso-page">
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
              <div v-if="nodeData.node.is_leaf">
                <el-form-item label="插件类型">
                  <el-select size="small" v-model="tpType">
                    <el-option
                      v-for="item in tpTypes"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="插件地址">
                  <el-input v-model="uri" size="small" placeholder></el-input>
                </el-form-item>
              </div>
            </template>
          </pso-tree-common>
        </div>
      </div>
      <div class="pso-page-body__content" v-bar>
        <div>
          <div class="pso-page-body__wrapper" v-if="currentNode">
            <div class="pso-page-body__header">
              <pso-title>插件：{{currentNode.node_display}}</pso-title>
              <div class="pso-page-body__btns"></div>
            </div>
            <pso-view-page
              v-if="currentNode.tp_type===tpTypes[0].value&&currentNode.node_id"
              :node="currentNode"
            ></pso-view-page>
            <pso-view-statistics
              v-if="currentNode.tp_type===tpTypes[1].value&&currentNode.node_id"
              :node="currentNode"
            ></pso-view-statistics>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PsoViewPage from "./page";
import PsoViewStatistics from "./statistics";
import PsoNodeauth from "../node-auth";

export default {
  components: { PsoViewPage, PsoNodeauth, PsoViewStatistics },
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
      tpType: 0,
      uri: ""
    };
  },
  computed: {
    treeOptions() {
      return {
        dimen: 4
      };
    },
    defaultNodeData() {
      return {
        node_dimen: 4
      };
    }
  },
  methods: {
    async nodeClickHandler(nodeData) {
      if (nodeData.is_leaf) {
        this.currentNode = nodeData;
        const ret = await this.API.templates({ data: { tp_code: nodeData.node_name }, method: "get" });
        if (ret.success) {
          for (let key in ret.data.tp) {
            this.$set(this.currentNode, key, ret.data.tp[key]);
          }
        }
      }
    },
    beforeNodeUpdate(data) {
      if (data.is_leaf) {
        data.tp_type = this.tpType;
        data.tp_route = this.uri;
      }
    }
  }
};
</script>
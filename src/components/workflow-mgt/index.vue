<template>
  <div class="pso-page">
    <div class="pso-page-body">
      <div class="pso-page__tree" v-bar>
        <div>
          <pso-tree-common
            ref="tree"
            :request-options="treeOptions"
            :default-node-data="defaultNodeData"
            :auto-edit="false"
            @before-node-new="handleNewNode"
            @node-click="nodeClickHandler"
          ></pso-tree-common>
        </div>
      </div>
      <div class="pso-page-body__content" v-bar>
        <div>
          <div class="pso-page-body__wrapper" v-if="currentNode">
            <div class="pso-page-body__header">
              <pso-title>流程：{{currentNode.node_display}}</pso-title>
              <div class="pso-page-body__btns">
                <el-button size="small" type="primary" plain @click="handleEditWf">设计流程</el-button>
                <el-button size="small" type="primary" plain @click="handleSaveWf">保存设置</el-button>
              </div>
            </div>
            <div class="pso-page-body__tab">
              <el-tabs v-model="curTab">
                <el-tab-pane label="预览" name="preview"></el-tab-pane>
                <el-tab-pane label="权限" name="auth"></el-tab-pane>
                <el-tab-pane label="签单" name="table"></el-tab-pane>
                <el-tab-pane label="用户代理" name="proxy"></el-tab-pane>
                <el-tab-pane label="文件类型" name="file"></el-tab-pane>
                <el-tab-pane label="快捷标签" name="tag"></el-tab-pane>
                <el-tab-pane label="文本设置" name="text"></el-tab-pane>
                <el-tab-pane label="子流程" name="subwf"></el-tab-pane>
              </el-tabs>
            </div>
            <div class="pso-page-body__tabbody">
              <div class="pso-page-wf__stage" v-if="curTab==='preview'">
                <pso-wf-stage :workflow-data="wfImage" read-mode v-if="wfImage"></pso-wf-stage>
              </div>
              <pso-nodeauth v-if="curTab==='auth'&&!wfDesigner.initializing" :node="currentNode"></pso-nodeauth>
              <pso-wf-table v-if="curTab==='table'"></pso-wf-table>
              <pso-wf-agent v-if="curTab==='proxy'" :data="agents"></pso-wf-agent>
              <div v-if="curTab==='file'">
                <pso-title>设置文号</pso-title>
                <el-form>
                  <el-form-item>
                    <el-select :multiple="true" v-model="wfDesigner.wfFiletype" placeholder="请选择">
                      <el-option
                        v-for="item in wfDesigner.fileTypes"
                        :key="item.wf_filetype"
                        :label="item.wf_filetype"
                        :value="item.wf_filetype"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
              <pso-wf-tag v-if="curTab==='tag'" :data="tagData"></pso-wf-tag>
              <pso-wf-text v-if="curTab==='text'" :data="textData"></pso-wf-text>
              <pso-wf-subwf v-if="curTab==='subwf'" :data="subWfData" @go-designer="goDesigner"></pso-wf-subwf>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PsoWfStage from "../workflow-designer/stage";
import PsoTypebar from "../type-bar";
import PsoWfTable from "../workflow-designer/table-editor";
import { WF_INIT, WF_RESET } from "../../store/mutation-types";
import { mapState } from "vuex";
import PsoWfTageditor from "./tag-editor";
import PsoWfAgent from "./agent";
import PsoWfTag from "./tag";
import PsoWfText from "./text";
import PsoWfSubwf from "./wf-sub";

export default {
  components: { PsoWfStage, PsoTypebar, PsoWfTable, PsoWfTageditor, PsoWfAgent, PsoWfTag, PsoWfText, PsoWfSubwf },
  props: ["params"],
  data() {
    return {
      loading: false,
      copying: false,
      currentNode: {},
      wfCfg: {},
      curTab: "preview",
      tagData: [
        {
          tagType: "通过",
          showTag: false,
          tagVal: ["通过", "同意", "没问题"]
        },
        {
          tagType: "退回",
          showTag: false,
          tagVal: ["不同意", "请完善"]
        }
      ],
      textData: [
        {
          type: "提交按钮",
          value: "提交",
          show: true
        },
        {
          type: "下一步按钮",
          value: "提交",
          show: true
        },
        {
          type: "文件编号",
          value: "文件编号",
          show: true
        },
        {
          type: "重要等级",
          value: "重要等级",
          show: true
        },
        {
          type: "秘密等级",
          value: "秘密等级",
          show: true
        },
        {
          type: "加急程度",
          value: "加急程度",
          show: true
        }
      ],
      subWfData: [],
      agents: []
    };
  },
  computed: {
    ...mapState(["wfDesigner"]),
    treeOptions() {
      return {
        dimen: 7
      };
    },
    defaultNodeData() {
      return {
        node_dimen: 7
      };
    },
    wfImage() {
      return this.wfCfg.wf_map_tp;
    }
  },
  destroyed() {
    this.$store.commit(WF_RESET);
  },
  methods: {
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
    handleEditWf() {
      if (this.currentNode.data_type === "flowtp") {
        this.goDesigner({ templateId: this.currentNode.node_id });
      } else {
        this.goDesigner({ node_id: this.currentNode.node_id });
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

      await this.$store.dispatch(WF_INIT, { node_id: this.currentNode.node_id });

      this.subWfData = [];
      if (this.wfDesigner.formStore) {
        const wfTrees = await this.API.trees({ data: this.treeOptions });

        const subWfs = this.wfDesigner.formStore.search({ options: { componentid: "asstable" }, onlyData: true });

        subWfs.forEach(item => {
          this.subWfData.push({
            subForm: item._fieldName,
            subCode: item._option
            // wfOptions: wfTrees.data.tagtree.filter(wfItem => wfItem.node_id === item._option)
          });
        });
        console.log(wfTrees.data.tagtree);
        console.log(this.subWfData);
      }
    },
    async handleSaveWf() {
      
    }
  }
};
</script>
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
                <el-button size="small" type="primary" plain @click="handleEditWf">编辑流程</el-button>
              </div>
            </div>
            <div class="pso-page-body__tab">
              <el-tabs v-model="curTab">
                <el-tab-pane label="流程预览" name="preview"></el-tab-pane>
                <el-tab-pane label="权限设置" name="auth"></el-tab-pane>
                <el-tab-pane label="会签主体" name="table"></el-tab-pane>
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
              <div v-if="curTab==='auth'">
                <pso-nodeauth v-if="!wfDesigner.initializing" :node="currentNode"></pso-nodeauth>
              </div>
              <div v-if="curTab==='table'">
                <pso-wf-table></pso-wf-table>
              </div>
              <div v-if="curTab==='proxy'">
                <pso-title>设置代理用户</pso-title>
                <el-form>
                  <pso-form-user :cpnt="{data:user}"></pso-form-user>
                </el-form>
              </div>
              <div v-if="curTab==='file'">
                <pso-title>设置问号</pso-title>
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
              <div v-if="curTab==='tag'">
                <pso-title>设置标签文本</pso-title>
                <el-table :data="tagData" style="width: 100%" key="tag">
                  <el-table-column prop="tagType" label="文本类型" width="180"></el-table-column>
                  <el-table-column prop="tagVal" label="文本值">
                    <template slot-scope="scope">
                      <el-tag
                        v-for="(itemVal,index) in scope.row.tagVal"
                        :key="itemVal"
                        closable
                        @close="handleDelTag(index,scope.row)"
                      >{{itemVal}}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                      <pso-wf-tageditor :data="scope.row" @confirm="addTagText($event,scope.row)"></pso-wf-tageditor>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div v-if="curTab==='text'">
                <pso-title>设置文本</pso-title>
                <el-table :data="textData" style="width: 100%" key="text">
                  <el-table-column prop="type" label="功能" width="180"></el-table-column>
                  <el-table-column label="文本值">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.value" size="small" placeholder></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="是否显示">
                    <template slot-scope="scope">
                      <el-switch
                        v-model="scope.row.show"
                        size="small"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div v-if="curTab==='subwf'">
                <el-table :data="subWfData" style="width: 100%" key="tag">
                  <el-table-column prop="subForm" label="子表单" width="180"></el-table-column>
                  <el-table-column label="是否是流程">
                    <template slot-scope="scope">
                      <el-switch
                        v-model="scope.row.isFlow"
                        size="small"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column label="选择流程">
                    <template slot-scope="scope">
                      <el-select v-model="wfDesigner.wfFiletype" placeholder="请选择">
                        <el-option
                          v-for="item in wfDesigner.fileTypes"
                          :key="item.wf_filetype"
                          :label="item.wf_filetype"
                          :value="item.wf_filetype"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        plain
                        @click="goDesigner({node_id:scope.row.subCode})"
                      >设置流程</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
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
import PsoFormUser from "../form-interpreter/components/user";
import PsoWfTageditor from "./tag-editor";

export default {
  components: { PsoWfStage, PsoTypebar, PsoWfTable, PsoFormUser, PsoWfTageditor },
  props: ["params"],
  data() {
    return {
      loading: false,
      copying: false,
      currentNode: {},
      wfCfg: {},
      curTab: "preview",
      user: {
        _fieldName: "",
        _type: "checkbox",
        _val: ""
      },
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
      tagVal: "",
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
      subWfData: []
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
    addTagText(val, data) {
      data.tagVal.push(val);
    },
    handleDelTag(index, data) {
      data.tagVal.splice(index, 1);
    }
  }
};
</script>
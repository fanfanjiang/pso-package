<template>
  <div class="pso-view-withtop" v-loading="groupInitializing">
    <div class="pso-view-top" v-if="!groupInitializing">
      <pso-typebar :defBar="defGroup" v-model="curGroup"></pso-typebar>
    </div>
    <div :class="viewClass" v-if="curGroup.feildvalue">
      <div class="pso-view-extend">
        <pso-tree-common
          ref="tree"
          :request-options="treeOptions"
          :default-node-data="defaultNodeData"
          :auto-edit="true"
          @before-edit-submit="beforeNodeUpdate"
          @node-click="nodeClickHandler"
        >
          <template v-slot:default="nodeData">
            <div v-if="nodeData.node.is_leaf">
              <el-form-item label="插件类型">
                <el-select size="small" v-model="tpType">
                  <el-option v-for="(t, i) in TP_NEW_TYPES" :key="i" :label="t.name" :value="t.value"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </template>
        </pso-tree-common>
      </div>
      <div class="pso-view-body" v-loading="initializing">
        <template v-if="curNode && !initializing">
          <div class="pso-view-header">
            <div class="pso-view-header__l">
              <div class="pso-view-title">
                <i class="el-icon-document"></i>
                <span>插件：{{ curNode.node_display }}({{ curNode.node_name }})</span>
              </div>
            </div>
            <div class="pso-view-header__r">
              <el-button size="mini" type="primary" plain @click="savePulgin" :disabled="saving" :loading="saving">保存设置</el-button>
            </div>
          </div>
          <div class="pso-view-viewtab">
            <el-tabs v-model="curTab" type="card">
              <template v-if="!!curNode.is_leaf">
                <el-tab-pane v-if="curNode.tp_type === 1" label="脚本" name="stats"></el-tab-pane>
                <el-tab-pane v-if="curNode.tp_type === 2" label="设计" name="grid"></el-tab-pane>
                <el-tab-pane label="参数" name="param"></el-tab-pane>
                <el-tab-pane label="属性" name="base"></el-tab-pane>
                <el-tab-pane label="文本" name="text"></el-tab-pane>
              </template>
              <el-tab-pane label="权限" name="auth"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="pso-view-table" v-loading="saving">
            <template v-if="!!curNode.is_leaf">
              <plugin-param v-if="curTab === 'param'" :data="param"></plugin-param>
              <grid-designer v-if="curTab === 'grid'" :code="curNode.node_name"></grid-designer>
              <plugin-stats
                v-if="curTab === 'stats'"
                :column="column"
                :config="tpCfg"
                :node="curNode"
                :header="tpHeader"
                @save="savePulgin"
              ></plugin-stats>
              <plugin-text v-if="curTab === 'text'" :data="tpText" :def-text="tpButtons"></plugin-text>
              <plugin-base v-if="curTab === 'base'" :node="curNode"></plugin-base>
            </template>
            <pso-nodeauth v-if="curTab === 'auth'" :node="curNode"></pso-nodeauth>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { MgtMixin } from "../../mixin/view";
import PsoNodeauth from "../node-auth";
import PluginStats from "./stats";
import PluginParam from "./param";
import PluginText from "./text";
import PluginBase from "./base";
import { TP_NEW_TYPES, STATIC_COLUMN_FIELDS } from "../../const/sys";
import GridDesigner from "../grid-designer";

const _DATA = {
  column: [],
  param: [],
  tpText: [],
  tpButtons: [],
  tpHeader: [],
  tpCfg: {
    paging: "0",
    stats: "0",
  },
};

export default {
  mixins: [MgtMixin],
  components: { PluginStats, PluginParam, PluginText, PluginBase, PsoNodeauth, GridDesigner },
  props: {
    params: {
      type: Object,
      default: () => {
        data_type: "";
      },
    },
  },
  data() {
    this.TP_NEW_TYPES = TP_NEW_TYPES;
    return {
      groupInitializing: false,
      initializing: false,
      saving: false,
      defGroup: [],
      curGroup: {},
      curNode: null,
      curTab: "base",
      tpType: "",
      ..._DATA,
    };
  },
  computed: {
    treeOptions() {
      return {
        dimen: 4,
        node_id: this.curGroup.feildvalue,
        data_type: this.params.data_type,
      };
    },
    defaultNodeData() {
      return {
        node_dimen: 4,
      };
    },
  },
  async created() {
    await this.initializeGroup();
  },
  methods: {
    reset() {
      Object.assign(this.$data, _.cloneDeep(_DATA));
    },
    async initializeGroup() {
      this.groupInitializing = true;
      const ret = await this.API.getPluginGroup();
      if (ret.success) {
        this.defGroup = ret.data.map(({ node_display: feildname, node_name: feildvalue }) => ({ feildname, feildvalue }));
      }
      this.groupInitializing = false;
    },
    beforeNodeUpdate(data) {
      if (data.is_leaf) {
        data.tp_type = this.tpType;
        data.tp_head = "";
        data.tp_route = TP_NEW_TYPES[this.tpType].router || "";
      }
    },
    async nodeClickHandler(node) {
      this.initializing = true;
      this.curNode = node;
      this.reset();

      const { is_leaf, node_name: code } = this.curNode;

      if (is_leaf) {
        const ret = await this.API.getTreeNode({ code });

        if (ret.success) {
          const cfg = ret.data.data;
          const { tp_head, tp_buttons, tp_text } = cfg;

          for (let key in cfg) {
            this.$set(this.curNode, key, cfg[key]);
          }

          const { route_setting, tp_content, tp_type, tp_config } = this.curNode;

          if (tp_type === 1) {
            this.curTab = "stats";
          } else {
            this.curTab = "param";
          }

          if (route_setting) {
            this.param = JSON.parse(route_setting);
          }

          if (tp_content) {
            if (tp_type === 2) {
              this.column = formatJSONList(tp_content, STATIC_COLUMN_FIELDS);
            } else {
              this.column = JSON.parse(tp_content);
            }
          }

          if (tp_head) {
            this.tpHeader = JSON.parse(tp_head);
            if (!Array.isArray(this.tpHeader)) {
              this.tpHeader = [];
            }
          } else {
            this.tpHeader = [];
          }

          if (tp_buttons) {
            this.tpButtons = JSON.parse(tp_buttons);
          }

          if (tp_text) {
            JSON.parse(tp_text).forEach((item) => {
              let subList = [];
              for (let i = 0; i < this.tpButtons.length; i++) {
                const exist = _.find(item.list, { id: this.tpButtons[i].id }) || this.tpButtons[i];
                subList.push({ ...this.tpButtons[i], value: exist.value || exist.name });
              }
              this.tpText.push({ list: subList, id: item.id, name: item.name });
            });
          }

          if (tp_config) {
            this.tpCfg = JSON.parse(tp_config);
          }
        }
      } else {
        this.curTab = "auth";
      }

      this.initializing = false;
    },
    async savePulgin() {
      this.saving = true;
      const ret = await this.API.templates({
        data: {
          ...this.curNode,
          route_setting: JSON.stringify(this.param),
          tp_code: this.curNode.node_name,
          tp_content: JSON.stringify(this.column),
          tp_text: JSON.stringify(this.tpText),
          tp_buttons: JSON.stringify(this.tpButtons),
          tp_head: JSON.stringify(this.tpHeader),
          tp_config: JSON.stringify(this.tpCfg),
        },
        method: "put",
      });
      this.ResultNotify(ret);
      this.saving = false;
    },
  },
};
</script>

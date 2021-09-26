<template>
  <div :class="viewClass">
    <div class="pso-view-extend">
      <pso-tree-common
        ref="tree"
        :request-options="treeOptions"
        :default-node-data="defaultNodeData"
        :auto-edit="true"
        :rootable="rootable"
        @node-click="nodeClickHandler"
      ></pso-tree-common>
    </div>
    <div class="pso-view-body">
      <template v-if="curNode && !loading">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-document"></i>
              <span>菜单：{{ curNode.node_display }}</span>
            </div>
          </div>
          <div class="pso-view-header__r">
            <el-button size="mini" type="primary" plain @click="updateNode">保存设置</el-button>
          </div>
        </div>
        <div class="pso-view-viewtab">
          <el-tabs v-model="curTab">
            <el-tab-pane label="属性" name="param"></el-tab-pane>
            <el-tab-pane v-if="authable" label="权限" name="auth"></el-tab-pane>
            <el-tab-pane v-if="authable" label="权限参数" name="view"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="pso-view-table">
          <menu-auth v-if="curTab === 'auth'" :node="curNode"></menu-auth>
          <view-set v-if="curTab === 'view'" :data="viewData"></view-set>
          <div class="pso-menu-param" v-if="curTab === 'param'" v-loading="saving || loading">
            <el-form size="mini" label-position="right" label-width="150px" style="width: 500px; margin-top: 30px">
              <template v-if="authable">
                <el-form-item label="菜单名称">
                  <el-input size="small" v-model="curNode.menu_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="节点名称">
                  <el-input size="small" v-model="curNode.node_display" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标">
                  <el-input size="small" v-model="curNode.menu_icon">
                    <template slot="prepend">
                      <el-button icon="el-icon-edit" @click="showIconBox = true"></el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="菜单排序">
                  <el-input-number size="small" v-model="curNode.node_serial" controls-position="right" :min="0"></el-input-number>
                </el-form-item>
              </template>
              <template v-if="!!curNode.is_leaf">
                <el-form-item label="打开方式">
                  <el-select size="small" v-model="curNode.open_type">
                    <el-option v-for="item in OPEN_TYPE" :key="item.v" :label="item.n" :value="item.v"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="菜单类型">
                  <el-select size="small" v-model="curNode.menu_type" @change="curNode.menu_link = ''">
                    <el-option v-for="item in MENU_TYPE" :key="item.v" :label="item.n" :value="item.v"></el-option>
                  </el-select>
                </el-form-item>
              </template>
              <el-form-item v-if="curNode.menu_type === MENU_TYPE[1].v" label="菜单链接">
                <el-input size="small" v-model="curNode.menu_link" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <template v-if="curNode.menu_type === MENU_TYPE[0].v && curNode.is_leaf">
              <h4>插件设置</h4>
              <plugin-setter :data="curTpDetail" :node="curNode" field="menu_link"> </plugin-setter>
            </template>
          </div>
        </div>
      </template>
    </div>
    <el-dialog title="选择图标" append-to-body :visible.sync="showIconBox" width="80%">
      <pso-picker-icon @select="pickIcon"></pso-picker-icon>
    </el-dialog>
  </div>
</template>
<script>
import MenuAuth from "./auth";
import PluginSetter from "../plugin-setter";
import ViewSet from "./view";
import { MENU_TYPE, OPEN_TYPE, MENU_LEAF_AUTH } from "../../const/menu";
import PsoPickerIcon from "../picker/pso-picker-icon";
import { MgtMixin } from "../../mixin/view";

export default {
  mixins: [MgtMixin],
  components: { MenuAuth, PluginSetter, ViewSet, PsoPickerIcon },
  props: {
    nodeid: String,
    datatype: String,
    dimen: {
      type: Number,
      default: 1,
    },
    authable: {
      type: Boolean,
      default: true,
    },
    rootable: {
      type: Boolean,
      default: true,
    },
    nodefun: Function,
  },
  data() {
    return {
      loading: false,
      copying: false,
      curNode: null,
      curTab: "param",
      MENU_TYPE: MENU_TYPE,
      OPEN_TYPE: OPEN_TYPE,
      templetes: [],
      curTpDetail: [],
      saving: false,
      showIconBox: false,
      initTpCode: "",
      leafAuthcfg: MENU_LEAF_AUTH,
      viewData: [],
    };
  },
  computed: {
    treeOptions() {
      return { dimen: this.dimen, node_id: this.nodeid, data_type: this.datatype };
    },
    defaultNodeData() {
      return { node_dimen: this.dimen };
    },
  },
  methods: {
    async nodeClickHandler(nodeData) {
      this.curNode = nodeData;

      this.loading = true;

      let ret;
      if (this.nodefun) {
        ret = await this.nodefun(nodeData, this);
      } else {
        ret = await this.API.getMenuInfo({ menu_code: nodeData.node_name });
      }
      if (ret && ret.success) {
        for (let key in ret.data) {
          this.$set(this.curNode, key, ret.data[key]);
        }

        if (nodeData.is_leaf) {
          this.curTpDetail = this.curNode.param_value ? JSON.parse(this.curNode.param_value) : [];
          this.viewData = this.curNode.auth_config ? JSON.parse(this.curNode.auth_config) : [];
        }
      }
      this.loading = false;
    },
    async updateNode() {
      this.saving = true;

      const data = {};
      for (let key in this.curNode) {
        if (!_.isNull(this.curNode[key])) {
          data[key] = this.curNode[key];
        }
      }

      const params_value = this.curTpDetail.map(({ value, field }) => ({ value, field }));
      const ret = await this.API.trees({
        data: {
          ...data,
          dimen: data.node_dimen,
          code: data.node_name,
          param_value: JSON.stringify(params_value),
          auth_config: JSON.stringify(this.viewData),
        },
        method: "put",
      });

      this.saving = false;
      this.ResultNotify(ret);
    },
    pickIcon(icon) {
      this.curNode.menu_icon = icon;
      this.showIconBox = false;
    },
  },
};
</script>
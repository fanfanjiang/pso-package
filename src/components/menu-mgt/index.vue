<template>
  <div class="pso-view-withtop" v-loading="loadingBar">
    <div class="pso-view-top" v-if="!loadingBar">
      <pso-typebar :defBar="defBar" v-model="typeVal"></pso-typebar>
    </div>
    <div :class="viewClass" v-if="typeVal.feildvalue">
      <div class="pso-view-extend">
        <pso-tree-common
          ref="tree"
          :request-options="treeOptions"
          :default-node-data="defaultNodeData"
          :auto-edit="true"
          @node-click="nodeClickHandler"
        ></pso-tree-common>
      </div>
      <div class="pso-view-body">
        <template v-if="curNode && !loadingInfo">
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
              <el-tab-pane v-if="!params.hide" label="权限" name="auth"></el-tab-pane>
              <el-tab-pane v-if="!params.hide" label="权限参数" name="view"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="pso-view-table">
            <menu-auth v-if="curTab === 'auth'" :node="curNode"></menu-auth>
            <view-set v-if="curTab === 'view'" :data="viewData"></view-set>
            <div class="pso-menu-param" v-if="curTab === 'param'" v-loading="saving || loadingInfo">
              <great-panel>
                <template #header>
                  <i class="el-icon-edit-outline"></i>
                  <span>基本参数</span>
                </template>
                <el-form label-position="left" label-width="180px">
                  <template v-if="!params.hide">
                    <div class="form-wrapper">
                      <el-form-item label="菜单名称">
                        <el-input size="small" v-model="curNode.menu_name" autocomplete="off"></el-input>
                      </el-form-item>
                      <el-form-item label="节点名称">
                        <el-input size="small" v-model="curNode.node_display" autocomplete="off"></el-input>
                      </el-form-item>
                    </div>
                    <div class="form-wrapper">
                      <el-form-item label="菜单图标">
                        <el-input size="small" v-model="curNode.menu_icon">
                          <template slot="prepend">
                            <el-button icon="el-icon-edit" @click="handleIcon"></el-button>
                          </template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="排序">
                        <el-input-number size="small" v-model="curNode.node_serial" controls-position="right" :min="0"></el-input-number>
                      </el-form-item>
                    </div>
                  </template>
                  <div class="form-wrapper" v-if="!!curNode.is_leaf">
                    <el-form-item label="打开方式">
                      <el-select size="small" v-model="curNode.open_type">
                        <el-option v-for="item in OPEN_TYPE" :key="item.v" :label="item.n" :value="item.v"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="菜单类型">
                      <el-select size="small" v-model="curNode.menu_type" @change="typeChange">
                        <el-option v-for="item in MENU_TYPE" :key="item.v" :label="item.n" :value="item.v"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="form-wrapper">
                    <el-form-item v-if="curNode.menu_type === MENU_TYPE[1].v" label="菜单链接">
                      <el-input size="small" v-model="curNode.menu_link" autocomplete="off"></el-input>
                    </el-form-item>
                  </div>
                </el-form>
              </great-panel>
              <great-panel v-if="curNode.menu_type === MENU_TYPE[0].v">
                <template #header>
                  <i class="el-icon-edit-outline"></i>
                  <span>插件配置</span>
                </template>
                <plugin-setter :data="curTpDetail" :node="curNode" field="menu_link"> </plugin-setter>
              </great-panel>
            </div>
          </div>
        </template>
      </div>
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
import GreatPanel from "../great-panel";

export default {
  mixins: [MgtMixin],
  components: { MenuAuth, PluginSetter, ViewSet, PsoPickerIcon, GreatPanel },
  props: {
    params: {
      type: Object,
    },
  },
  data() {
    return {
      loading: false,
      copying: false,
      curNode: null,
      defBar: [],
      typeVal: {},
      curTab: "param",
      loadingBar: false,
      MENU_TYPE: MENU_TYPE,
      OPEN_TYPE: OPEN_TYPE,
      templetes: [],
      curTpDetail: [],
      saving: false,
      loadingInfo: false,
      showIconBox: false,
      initTpCode: "",
      leafAuthcfg: MENU_LEAF_AUTH,
      viewData: [],
    };
  },
  computed: {
    treeOptions() {
      return {
        dimen: 1,
        node_id: this.typeVal.feildvalue,
        data_type: this.params.data_type,
      };
    },
    defaultNodeData() {
      return {
        node_dimen: 1,
      };
    },
    paramsEditable() {
      return this.curNode.menu_type === this.MENU_TYPE[0].v && this.curNode.menu_link;
    },
  },
  async created() {
    this.loadingBar = true;
    const ret = await this.API.getBar({ menu: true, data_type: this.params.data_type });
    if (ret.success) {
      this.defBar = ret.data.map((item) => {
        return {
          feildname: item.node_display,
          feildvalue: item.node_name,
        };
      });
    }
    this.loadingBar = false;
  },
  methods: {
    async nodeClickHandler(nodeData) {
      this.curNode = nodeData;

      this.loadingInfo = true;
      const ret = await this.API.getMenuInfo({ menu_code: nodeData.node_name });
      if (ret.success) {
        for (let key in ret.data) {
          this.$set(this.curNode, key, ret.data[key]);
        }
        if (nodeData.is_leaf) {
          if (this.curNode.param_value) {
            this.curTpDetail = JSON.parse(this.curNode.param_value);
          }
          if (this.curNode.auth_config) {
            this.viewData = JSON.parse(this.curNode.auth_config);
          } else {
            this.viewData = [];
          }
        } else {
          // this.curTab = "auth";
        }
        if (this.curNode.open_type === "0") {
          this.curNode.open_type = "1";
        }
        this.loadingInfo = false;
      }
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
          open_type: "",
          ...data,
          dimen: data.node_dimen,
          code: data.node_name,
          param_value: JSON.stringify(params_value),
          auth_config: JSON.stringify(this.viewData),
        },
        method: "put",
      });
      this.check(ret);
    },
    check(ret) {
      this.$notify({ title: ret.success ? "保存成功" : "保存失败", type: ret.success ? "success" : "warning" });
      this.saving = false;
    },
    handleIcon() {
      this.showIconBox = true;
    },
    pickIcon(icon) {
      this.curNode.menu_icon = icon;
      this.showIconBox = false;
    },
    typeChange() {
      this.curNode.menu_link = "";
    },
  },
};
</script>
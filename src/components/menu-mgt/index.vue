<template>
  <div class="pso-page has-header" v-loading="loadingBar">
    <div class="pso-page-header" v-if="!loadingBar">
      <pso-typebar :defBar="defBar" v-model="typeVal"></pso-typebar>
    </div>
    <div class="pso-page-body" v-if="typeVal.feildvalue">
      <div class="pso-page__tree" v-bar>
        <div>
          <pso-tree-common
            ref="tree"
            :request-options="treeOptions"
            :default-node-data="defaultNodeData"
            :auto-edit="true"
            @node-click="nodeClickHandler"
            @before-edit-submit="beforeNodeUpdate"
          ></pso-tree-common>
        </div>
      </div>
      <div class="pso-page-body__content" v-bar>
        <div>
          <div class="pso-page-body__wrapper" v-if="curNode&&!loadingInfo">
            <div class="pso-page-body__header">
              <pso-title :size="16">菜单：{{curNode.node_display}}</pso-title>
              <div class="pso-page-body__btns"></div>
            </div>
            <div class="pso-page-body__tab">
              <el-tabs v-model="curTab">
                <el-tab-pane label="权限设置" name="auth"></el-tab-pane>
                <el-tab-pane v-if="!!curNode.is_leaf" label="参数设置" name="param"></el-tab-pane>
              </el-tabs>
            </div>
            <div class="pso-page-body__body">
              <pso-nodeauth v-if="curTab==='auth'" :node="curNode"></pso-nodeauth>
              <div
                class="pso-menu-param"
                v-if="curTab==='param'&&!!curNode.is_leaf"
                v-loading="saving||loadingInfo"
              >
                <el-form label-position="left" label-width="80px">
                  <pso-title>基本参数</pso-title>
                  <el-form-item label="菜单名称">
                    <el-input size="small" v-model="curNode.menu_name" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="菜单图标">
                    <el-input size="small" v-model="curNode.menu_icon">
                      <template slot="prepend">
                        <el-button icon="el-icon-edit" @click="handleIcon"></el-button>
                      </template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="打开方式">
                    <el-select size="small" v-model="curNode.open_type">
                      <el-option
                        v-for="item in OPEN_TYPE"
                        :key="item.v"
                        :label="item.n"
                        :value="item.v"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="菜单类型">
                    <el-select size="small" v-model="curNode.menu_type">
                      <el-option
                        v-for="item in MENU_TYPE"
                        :key="item.v"
                        :label="item.n"
                        :value="item.v"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <plug-set
                    v-if="curNode.menu_type===MENU_TYPE[0].v"
                    :data="curTpDetail"
                    :node="curNode"
                    @change="handleTagChange"
                    field="menu_link"
                  ></plug-set>
                  <el-form-item v-else label="菜单链接">
                    <el-input v-model="curNode.menu_link" autocomplete="off"></el-input>
                  </el-form-item>
                  <div class="pso-menu-param__controller">
                    <el-button type="primary" @click="updateNode" size="mini">保存</el-button>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="选择图标" append-to-body :visible.sync="showIconBox" width="60%">
      <el-row>
        <el-col :span="2" v-for="i in ICON" :key="i">
          <div class="pso-icon-picker__item" @click="pickIcon(i)">
            <i :class="i"></i>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import PsoNodeauth from "../node-auth";
import PlugSet from "./plug-set";
import { MENU_TYPE, OPEN_TYPE } from "../../const/menu";
import ICON from "../../const/icon";
export default {
  components: { PsoNodeauth, PlugSet },
  props: {
    params: {
      type: Object,
      default: () => {
        data_type: "";
      }
    }
  },
  data() {
    return {
      loading: false,
      copying: false,
      curNode: null,
      defBar: [],
      typeVal: {},
      curTab: "auth",
      loadingBar: false,
      MENU_TYPE: MENU_TYPE,
      OPEN_TYPE: OPEN_TYPE,
      templetes: [],
      curTpDetail: [],
      saving: false,
      loadingInfo: false,
      showIconBox: false,
      ICON: ICON,
      initTpCode: ""
    };
  },
  computed: {
    treeOptions() {
      return {
        dimen: 1,
        node_id: this.typeVal.feildvalue,
        data_type: this.params.data_type
      };
    },
    defaultNodeData() {
      return {
        node_dimen: 1
      };
    },
    paramsEditable() {
      return this.curNode.menu_type === this.MENU_TYPE[0].v && this.curNode.menu_link;
    }
  },
  async created() {
    this.loadingBar = true;
    const ret = await this.API.getBar({ menu: true });
    if (ret.success) {
      this.defBar = ret.data.map(item => {
        return {
          feildname: item.node_display,
          feildvalue: item.node_name
        };
      });
    }
    this.loadingBar = false;
  },
  methods: {
    async nodeClickHandler(nodeData) {
      this.curNode = nodeData;

      if (nodeData.is_leaf) {
        this.loadingInfo = true;
        const ret = await this.API.getMenuInfo({ menu_code: nodeData.node_name });
        if (ret.success) {
          for (let key in ret.data) {
            this.$set(this.curNode, key, ret.data[key]);
          }
          if (this.curNode.param_value) {
            this.curTpDetail = JSON.parse(this.curNode.param_value);
          }
        }
        this.loadingInfo = false;
      } else {
        this.curTab = "auth";
      }
    },
    async updateNode() {
      this.saving = true;
      const ret = await this.API.trees({
        data: {
          ..._.pickBy(this.curNode, _.identity),
          dimen: this.curNode.node_dimen,
          code: this.curNode.node_name,
          param_value: JSON.stringify(this.curTpDetail)
        },
        method: "put"
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
    handleTagChange(data) {
      this.curTpDetail = data;
    }
  }
};
</script>
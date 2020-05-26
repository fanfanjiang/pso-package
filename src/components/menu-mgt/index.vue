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
          <div class="pso-page-body__wrapper" v-if="currentNode">
            <div class="pso-page-body__header">
              <pso-title :size="16">菜单：{{currentNode.node_display}}</pso-title>
              <div class="pso-page-body__btns"></div>
            </div>
            <div class="pso-page-body__tab">
              <el-tabs v-model="curTab">
                <el-tab-pane label="权限设置" name="auth"></el-tab-pane>
                <el-tab-pane label="参数设置" name="param"></el-tab-pane>
              </el-tabs>
            </div>
            <div class="pso-page-body__body">
              <div v-if="curTab==='auth'">
                <pso-nodeauth :node="currentNode"></pso-nodeauth>
              </div>
              <div class="pso-menu-param" v-if="curTab==='param'" v-loading="saving||loadingInfo">
                <el-form label-position="left" label-width="80px">
                  <pso-title>基本参数</pso-title>
                  <el-form-item label="菜单名称">
                    <el-input v-model="currentNode.menu_name" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="菜单图标">
                    <el-input v-model="currentNode.menu_icon" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="打开方式">
                    <el-select v-model="currentNode.open_type">
                      <el-option
                        v-for="item in OPEN_TYPE"
                        :key="item.v"
                        :label="item.n"
                        :value="item.v"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="菜单类型">
                    <el-select v-model="currentNode.menu_type">
                      <el-option
                        v-for="item in MENU_TYPE"
                        :key="item.v"
                        :label="item.n"
                        :value="item.v"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="currentNode.menu_type===MENU_TYPE[0].v" label="选择插件">
                    <el-select v-model="currentNode.menu_link" clearable @change="getTpDetail">
                      <el-option
                        v-for="item in templetes"
                        :key="item.node_name"
                        :label="item.node_display"
                        :value="item.node_name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-else label="菜单链接">
                    <el-input v-model="currentNode.menu_link" autocomplete="off"></el-input>
                  </el-form-item>
                  <transition name="el-zoom-in-top">
                    <div v-if="showParamForm">
                      <pso-title>插件参数</pso-title>
                      <el-form-item
                        v-for="tpItem in curTpDetail"
                        :key="tpItem.field"
                        :label="tpItem.name"
                      >
                        <el-select v-if="tpItem.picker==='picker-form'" v-model="tpItem.value">
                          <el-option
                            v-for="item in forms"
                            :key="item.node_name"
                            :label="item.node_display"
                            :value="item.node_name"
                          ></el-option>
                        </el-select>
                        <el-select v-if="tpItem.picker==='picker-wf'" v-model="tpItem.value">
                          <el-option
                            v-for="item in workflows"
                            :key="item.node_name"
                            :label="item.node_display"
                            :value="item.node_name"
                          ></el-option>
                        </el-select>
                        <el-input
                          v-if="tpItem.picker==='input'"
                          v-model="tpItem.value"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </transition>
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
  </div>
</template>
<script>
import PsoNodeauth from "../node-auth";
import { MENU_TYPE, OPEN_TYPE } from "../../const/menu";

export default {
  components: { PsoNodeauth },
  props: ["params"],
  data() {
    return {
      loading: false,
      copying: false,
      currentNode: null,
      defBar: [],
      typeVal: {},
      curTab: "auth",
      loadingBar: false,
      MENU_TYPE: MENU_TYPE,
      OPEN_TYPE: OPEN_TYPE,
      templetes: [],
      curTpDetail: [],
      forms: [],
      workflows: [],
      saving: false,
      loadingInfo: false
    };
  },
  computed: {
    treeOptions() {
      return {
        dimen: 1,
        node_id: this.typeVal.feildvalue
      };
    },
    defaultNodeData() {
      return {
        node_dimen: 1
      };
    },
    showParamForm() {
      return this.currentNode.menu_type === this.MENU_TYPE[0].v && this.curTpDetail.length;
    },
    paramsEditable() {
      return this.currentNode.menu_type === this.MENU_TYPE[0].v && this.currentNode.menu_link;
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
    this.templetes = await this.API.getTempleteTree();

    //加载流程列表
    this.forms = await this.API.getFormTree();
    //加载表单列表
    this.workflows = await this.API.getWfTree();

    this.loadingBar = false;
  },
  methods: {
    async nodeClickHandler(nodeData) {
      if (nodeData.is_leaf) {
        this.currentNode = nodeData;
        this.loadingInfo = true;
        const ret = await this.API.getMenuInfo({ menu_code: nodeData.node_name });
        if (ret.success) {
          for (let key in ret.data) {
            this.$set(this.currentNode, key, ret.data[key]);
          }
          if (this.currentNode.param_value) {
            this.curTpDetail = JSON.parse(this.currentNode.param_value);
          } else if (this.paramsEditable) {
            await this.getTpDetail(this.currentNode.menu_link);
          } else {
            this.curTpDetail = [];
          }
        }
        this.loadingInfo = false;
      }
    },
    async getTpDetail(tp_code) {
      if (tp_code) {
        const ret = await this.API.templates({ data: { tp_code }, method: "get" });
        if (ret.success && ret.data.tp.route_setting) {
          this.curTpDetail = JSON.parse(ret.data.tp.route_setting);
        } else {
          this.curTpDetail = [];
        }
      } else {
        this.curTpDetail = [];
      }
    },
    async updateNode() {
      this.saving = true;
      const ret = await this.API.trees({
        data: {
          ..._.pickBy(this.currentNode, _.identity),
          dimen: this.currentNode.node_dimen,
          code: this.currentNode.node_name,
          param_value: JSON.stringify(this.curTpDetail)
        },
        method: "put"
      });
      this.check(ret);
    },
    check(ret) {
      this.$notify({ title: ret.success ? "保存成功" : "保存失败", type: ret.success ? "success" : "warning" });
      this.saving = false;
    }
  }
};
</script>
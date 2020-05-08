<template>
  <div class="pso-form-designer" v-loading="loading">
    <div class="pso-form-designer__header">
      <pso-header title="表单设计" @back="$emit('back')" v-if="storeReady">
        <template v-slot:btn>
          <el-button
            :disabled="!formStore.canUndo"
            type="primary"
            size="small"
            icon="fa fa-undo"
            plain
            @click="()=>formStore.undo()"
          ></el-button>
          <el-button
            :disabled="!formStore.canRedo"
            type="primary"
            size="small"
            icon="fa fa-repeat"
            plain
            @click="()=>formStore.redo()"
          ></el-button>
          <el-button
            v-if="params.id"
            type="primary"
            size="small"
            icon="fa fa-floppy-o"
            :loading="saving"
            :disabled="saving"
            @click="formSaveHandler('1')"
          >发布</el-button>
          <el-button
            v-if="params.id||params.pid"
            type="primary"
            size="small"
            icon="fa fa-floppy-o"
            :loading="saving"
            :disabled="saving"
            @click="formSaveHandler('0')"
          >保存</el-button>
          <el-dropdown
            class="pso-form-designer__more"
            trigger="click"
            :hide-on-click="false"
            @command="handleCommand"
          >
            <span class="el-dropdown-link">
              更多
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="auth">添加权限项</el-dropdown-item>
              <el-dropdown-item command="saveTemp">保存为模板</el-dropdown-item>
              <el-dropdown-item v-if="formStore.templateId" command="updateTemp">更新模板</el-dropdown-item>
              <el-dropdown-item>
                <pso-picker-resource
                  @confirm="handleTempSelection"
                  source="table"
                  :options="importTreeOption"
                >
                  <el-button type="text">导入模板</el-button>
                </pso-picker-resource>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </pso-header>
    </div>
    <div class="pso-form-designer__body">
      <designer-body @store-ready="formReadyHandler" :data="formCfg" v-if="!loading"></designer-body>
    </div>
    <auth-editor
      v-if="showAuthEditor"
      :show="showAuthEditor"
      @cancel="showAuthEditor=false"
      @saved="authSavedHandler"
    ></auth-editor>

    <el-dialog width="30%" title="保存模板" :visible.sync="showTempPop">
      <el-form size="mini" label-position="right">
        <el-form-item label="模板名称" label-width="80px">
          <el-input v-model="tempName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="保存位置" label-width="80px">
          <div class="tag-list" v-if="resource.list.length">
            <el-tag
              v-for="item in resource.list"
              :key="item.node_id"
              closable
              @close="handleDelSelection(item)"
            >{{item.node_name}}</el-tag>
          </div>
          <pso-picker-tree
            rootable
            :filter="newTempFilter"
            :request-options="treeOptions"
            btn-text="选择文件夹"
            @confirm="handleAddSelection"
          ></pso-picker-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showTempPop = false">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          :loading="savingCfg"
          :disabled="savingCfg"
          @click="prepareTempData"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DesignerBody from "./designer-body";
import PsoHeader from "../header";
import AuthEditor from "../auth-editor";
import { pickerMixin } from "../../mixin/picker";
import shortid from "shortid";

export default {
  mixins: [pickerMixin({ baseObjName: "resource", dataListName: "list", typeName: "type", idName: "node_id" })],
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },
  components: { DesignerBody, PsoHeader, AuthEditor },
  data() {
    return {
      showAuthEditor: false,
      saving: false,
      storeReady: false,
      formStore: {},
      loading: true,
      formCfg: {},
      tempName: "",
      showTempPop: false,
      savingCfg: false,
      treeOptions: {
        node_dimen: "NODEDIMEN06",
        data_type: "formtp",
        resource_type: this.params.resource_type || "public",
        searchtype: "Resource"
      },
      importTreeOption: {
        node_dimen: "NODEDIMEN06",
        data_type: "formtp",
        resource_type: this.params.resource_type || "public",
        searchtype: "Resource"
      },
      resource: {
        list: [],
        type: "radio"
      }
    };
  },
  computed: {
    onlytemplate() {
      return !this.params.id && !this.params.pid;
    }
  },
  async created() {
    if (this.params.id) {
      this.getFormCfg(this.params.id);
    } else if (this.params.templateId) {
      const ret = await this.API.resource({ data: { leaf_id: this.params.templateId } });
      if (ret.data) {
        this.handleTempSelection([ret.data]);
      }
    } else {
      this.loading = false;
    }
  },
  methods: {
    async formSaveHandler(is_pub = "0") {
      this.saving = true;
      const store = this.formStore;
      const ret = await this.API.formsCfg({
        data: {
          ...this.params,
          data_code: store.data_code,
          is_pub,
          formName: store.data_name,
          children: store.root.data.children,
          dataMaps: store.cpntsDataMps,
          permissionEntries: store.permissionEntries
        },
        method: this.params.id ? "put" : "post"
      });
      if (!ret.success) return (this.saving = false);
      this.$notify({ title: "保存成功", type: "success" });
      this.$emit("saved");
    },
    async getFormCfg(id) {
      this.loading = true;
      const ret = await this.API.formsCfg({ data: { id }, method: "get" });
      if (ret.success) {
        ret.data.data_id = id;
        this.formCfg = ret.data;
      }
      this.loading = false;
    },
    formReadyHandler(store) {
      this.formStore = store;
      this.storeReady = true;
    },
    authSavedHandler(data) {
      this.showAuthEditor = false;
      this.formStore.permissionEntries.push(data);
    },
    prepareTempData() {
      if (!this.resource.list.length) {
        return this.$message({ message: "请选择文件夹", type: "warning" });
      }
      this.tempSaveHandler({ node_id: this.resource.list[0].node_id, r_name: this.tempName });
    },
    async tempSaveHandler(data) {
      data.r_name = data.r_name || this.formStore.data_name;
      if (!data.r_name) {
        return this.$message({ message: "请输入模板名称", type: "warning" });
      }

      data.map_key = data.map_key || shortid.generate();

      this.savingCfg = true;
      const ret = await this.API.resource({
        data: {
          ...data,
          r_data: {
            data_design: this.formStore.root.data.children,
            permissionEntries: this.formStore.permissionEntries
          }
        },
        method: data.leaf_id ? "put" : "post"
      });
      this.savingCfg = false;
      this.showTempPop = false;
      if (ret.success) this.$notify({ title: "保存成功", type: "success" });
    },
    async handleCommand(command) {
      if (command === "auth") {
        this.showAuthEditor = true;
      } else if (command === "saveTemp") {
        this.tempName = this.tempName || this.formStore.data_name;
        this.showTempPop = true;
      } else if (command === "updateTemp") {
        this.tempSaveHandler({ leaf_id: this.formStore.templateId });
      }
    },
    handleTempSelection(data) {
      if (!data.length) return;
      const { r_name, r_data, leaf_id } = data[0];

      let template = {};
      if (r_data) {
        template = JSON.parse(r_data);
      }

      this.loading = true;

      this.formCfg = {
        templateId: leaf_id,
        data_design: template.data_design || [],
        permissionEntries: template.permissionEntries || [],
        data_name: r_name,
        data_id: this.formStore.data_id,
        data_code: this.formStore.data_code
      };

      this.$nextTick(() => {
        this.loading = false;
      });
    },
    newTempFilter(nodes) {
      return nodes.filter(node => node.is_leaf);
    }
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
.pso-form-designer {
  height: 100%;
  position: relative;
  .pso-form-designer__header {
    height: 50px;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
  .pso-form-designer__body {
    height: 100%;
    padding-top: 50px;
    position: relative;
    z-index: 1;
  }
}
.tag-list {
  margin-bottom: 5px;
}
@{deep} {
  .pso-form-designer__more {
    margin-left: 10px;
    .el-dropdown-link {
      cursor: pointer;
      color: #fd8647;
    }
  }
}
</style>
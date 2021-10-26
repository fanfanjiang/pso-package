<template>
  <div class="pso-nodeauth">
    <div class="pso-nodeauth__header">
      <div class="pso-na-check-wrapper">
        <div class="pso-na-check">
          <span>栏目权限：</span>
          <el-checkbox-group v-model="nodeAuth">
            <el-checkbox v-for="(o, i) in ATUH_FOLDER" :label="o.v" :key="i">{{ o.n }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="pso-na-check" v-if="leaf">
          <span>数据权限：</span>
          <el-checkbox-group v-model="leafAuth">
            <el-checkbox v-for="(o, i) in AUTH_LEAF" :label="o.v" :key="i">{{ o.n }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="pso-na-controller">
        <template v-if="!selectedInstances.length">
          <pso-picker-user v-if="type === 'menu' && bindType === '0'" pattern="checkbox" @confirm="addAuthHandler">
            <el-button size="mini" type="primary" plain>添加权限</el-button>
          </pso-picker-user>
          <pso-picker-position v-else-if="type === 'menu' && bindType === '2'" pattern="checkbox" @confirm="addAuthHandler">
            <el-button size="mini" type="primary" plain>添加权限</el-button>
          </pso-picker-position>
          <pso-picker-role v-else-if="type === 'menu' && bindType === '3'" pattern="checkbox" @confirm="addAuthHandler">
            <el-button size="mini" type="primary" plain>添加权限</el-button>
          </pso-picker-role>
          <pso-picker-tree v-else :rootable="true" :request-options="treeOptions" pattern="checkbox" @confirm="addAuthHandler">
            <el-button size="mini" type="primary" plain>添加权限</el-button>
          </pso-picker-tree>
        </template>
        <template v-else>
          <el-button size="mini" type="primary" plain @click="updateNodeAuth(1)">设置权限</el-button>
          <el-button size="mini" type="danger" plain @click="updateNodeAuth(2)">删除权限</el-button>
        </template>
      </div>
    </div>
    <div class="pso-nodeauth__body">
      <el-table
        ref="table"
        border
        v-loading="loadingTable"
        :data="authData"
        style="width: 100%"
        size="mini"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column :prop="showName" label="名称" width="140"></el-table-column>
        <el-table-column label="栏目权限" width="140">
          <template slot-scope="scope">
            <el-tag size="small" v-for="v in getAuthTag(scope.row.node_auth, 'node')" :key="v">{{ v }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="数据权限">
          <template slot-scope="scope">
            <el-tag size="small" v-for="v in getAuthTag(scope.row.leaf_auth, 'leaf')" :key="v">{{ v }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="pso-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[30, 50, 100, 200, 500]"
          :total="dataTotal"
          :page-size="fetchParams.limit"
          :current-page="fetchParams.start"
          @size-change="sizeChangeHandler"
          @current-change="currentChangeHandler"
          @prev-click="prevClickHandler"
          @next-click="nextClickHandler"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { pickerMixin } from "../../mixin/picker";
import { PagingMixin } from "../../mixin/view";
import { ATUH_FOLDER, ATUH_LEAF_FORM, ATUH_LEAF_WF } from "../../const/sys";
import { MENU_LEAF_AUTH } from "../../const/menu";

export default {
  mixins: [PagingMixin, pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type", idName: "node_id" })],
  props: {
    bindId: String,
    type: {
      type: String,
      default: "form",
    },
    bindType: {
      type: String,
      default: "0", //0:用户 1:部门 2:职位 3:角色
    },
    leaf: {
      type: Boolean,
      default: true,
    },
    idName: {
      type: String,
      default: "node_id",
    },
    selectId: {
      type: String,
      default: "node_id",
    },
  },
  data() {
    this.ATUH_FOLDER = ATUH_FOLDER;
    if (this.type === "form") {
      this.AUTH_LEAF = ATUH_LEAF_FORM;
    } else if (this.type === "wf") {
      this.AUTH_LEAF = ATUH_LEAF_WF;
    } else if (this.type === "menu") {
      this.AUTH_LEAF = MENU_LEAF_AUTH;
    }
    return {
      loadingTable: false,
      nodeAuth: [],
      leafAuth: [],
      selectedInstances: [],
      proxy: {
        list: [],
        type: "checkbox",
      },
      dataTotal: 0,
      authData: [],
    };
  },
  computed: {
    selectedIds() {
      if (this.selectedInstances.length) {
        return _.map(this.selectedInstances, this.selectId).join(",");
      } else {
        return _.map(this.proxy.list, this.idName).join(",");
      }
    },
    selectNodeAuth() {
      return this.nodeAuth.length ? this.nodeAuth.reduce((a, b) => a + b) : 0;
    },
    selectLeafAuth() {
      return this.leafAuth.length ? this.leafAuth.reduce((a, b) => a + b) : 0;
    },
    treeOptions() {
      if (this.type === "form") {
        return { dimen: 3 };
      } else if (this.type === "wf") {
        return { dimen: 7 };
      } else if (this.type === "menu") {
        return { dimen: 2 };
      }
    },
    fetchOptions() {
      if (this.type === "form" || this.type === "wf") {
        return {
          map_key: this.bindId,
          leaf_type: this.type === "form" ? "0" : "1",
        };
      } else if (this.type === "menu") {
        return {
          node_id: this.bindId,
        };
      }
    },
    showName() {
      if (this.type === "form") {
        return "data_name";
      } else if (this.type === "wf") {
        return "node_display";
      } else {
        return "user_name";
      }
    },
  },
  watch: {
    bindId: {
      immediate: true,
      handler() {
        this.refresh();
      },
    },
  },
  created() {
    this.resetPicker({ idName: this.idName });

    this.startWatch();
    this.$on("load", () => {
      this.fetch();
    });
  },
  methods: {
    async addAuthHandler(data) {
      this.handleAddSelection(data);
      this.updateNodeAuth(0);
    },
    async updateNodeAuth(optype = 1) {
      const params = { optype, auth_type: this.bindType, node_auth: this.selectNodeAuth, leaf_auth: this.selectLeafAuth };

      if (this.type === "menu") {
        params.users = this.selectedIds;
        params.nodes = this.bindId;
      } else {
        params.users = this.bindId;
        params.nodes = this.selectedIds;
      }
      const ret = await this.API.updateCommonAuth(params);
      this.$notify({ title: ret.success ? "保存成功" : "保存失败", type: ret.success ? "success" : "warning" });
      this.proxy.list.splice(0);
      this.refresh();
    },
    refresh() {
      this.refreshPaging();
      this.fetch();
    },
    async fetch() {
      this.loadingTable = true;
      const ret = await this.API.getCommonAuth({ auth_type: this.bindType, ...this.fetchOptions, ...this.getFetchParams() });
      if (ret.success) {
        this.authData = ret.data.data;
        this.dataTotal = ret.data.page;
      }
      this.loadingTable = false;
    },
    handleSelectionChange(val) {
      this.selectedInstances = val;
    },
    getAuthTag(value, type) {
      const list = [];
      if (type === "node") {
        this.ATUH_FOLDER.forEach((item) => {
          if ((item.v & value) === item.v) {
            list.push(item.n);
          }
        });
      } else {
        this.AUTH_LEAF.forEach((item) => {
          if ((item.v & value) === item.v) {
            list.push(item.n);
          }
        });
      }
      return list;
    },
  },
};
</script>
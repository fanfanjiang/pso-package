<template>
  <div class="pso-nodeauth">
    <div class="pso-nodeauth__header">
      <div class="pso-na-check-wrapper">
        <div class="pso-na-check">
          <span>栏目权限：</span>
          <el-checkbox-group v-model="nodeAuth">
            <el-checkbox v-for="item in foldAuthCfg" :label="item.v" :key="item.v">{{item.n}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="pso-na-check" v-if="node.is_leaf">
          <span>数据权限：</span>
          <el-checkbox-group v-model="leafAuth">
            <el-checkbox v-for="item in leafAuthcfg" :label="item.v" :key="item.v">{{item.n}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="pso-na-controller">
        <pso-picker-user
          v-if="!selectedAuthItem.length"
          pattern="checkbox"
          @confirm="handleAddAuth"
        >
          <el-button size="mini" type="primary" plain>添加权限</el-button>
        </pso-picker-user>
        <template v-else>
          <el-button size="mini" type="primary" plain @click="updateNodeAuth(1)">设置权限</el-button>
          <el-button size="mini" type="primary" plain @click="updateNodeAuth(2)">删除权限</el-button>
        </template>
      </div>
    </div>
    <div class="pso-nodeauth__body">
      <el-table
        ref="table"
        v-loading="loadingTable"
        :data="authData"
        style="width: 100%"
        size="mini"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="user_name" label="用户" width="180"></el-table-column>
        <el-table-column label="栏目权限">
          <template slot-scope="scope">
            <el-tag
              v-for="itemVal in getAuthTag(scope.row.node_auth,'node')"
              :key="itemVal"
            >{{itemVal}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="数据权限">
          <template slot-scope="scope">
            <el-tag
              v-for="itemVal in getAuthTag(scope.row.leaf_auth,'leaf')"
              :key="itemVal"
            >{{itemVal}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="pso-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[30,50,100,200,500]"
          :total="dataTotal"
          :page-size="where.limit"
          :current-page="where.page"
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
import PsoTitle from "../title";
import { pickerMixin } from "../../mixin/picker";
export default {
  mixins: [pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type" })],
  props: {
    node: Object,
    leafAuthcfg: {
      type: Array,
      default: () => [
        { n: "新增", v: 1 },
        { n: "编辑", v: 2 },
        { n: "删除", v: 4 },
        { n: "发布", v: 8 },
        { n: "审核", v: 16 }
      ]
    }
  },
  components: { PsoTitle },
  data() {
    return {
      foldAuthCfg: [
        { n: "无", v: 0 },
        { n: "查看", v: 1 },
        { n: "完全控制", v: 2 }
      ],
      nodeAuthCfg: [
        { n: "新增", v: 1 },
        { n: "编辑", v: 2 },
        { n: "删除", v: 4 },
        { n: "发布", v: 8 },
        { n: "审核", v: 16 }
      ],
      nodeAuth: [],
      leafAuth: [],
      selectedAuthItem: [],
      proxy: {
        list: [],
        type: "checkbox"
      },
      where: {
        page: 1,
        limit: 30
      },
      dataTotal: 0,
      authData: [],
      loadingTable: false
    };
  },
  computed: {
    selectedUids() {
      const targetList = this.selectedAuthItem.length ? this.selectedAuthItem : this.proxy.list;
      return _.map(targetList, "user_id").join(",");
    },
    selectNodeAuth() {
      return this.nodeAuth.length ? this.nodeAuth.reduce((a, b) => a + b) : 0;
    },
    selectLeafAuth() {
      return this.leafAuth.length ? this.leafAuth.reduce((a, b) => a + b) : 0;
    }
  },
  watch: {
    "node.node_id": {
      immediate: true,
      handler() {
        this.reloadNodeAuth();
      }
    },
    where: {
      deep: true,
      handler() {
        this.getNodeAuth();
      }
    }
  },
  methods: {
    async handleAddAuth(users) {
      this.handleAddSelection(users);
      this.updateNodeAuth(0);
    },
    async updateNodeAuth(optype = 1) {
      const ret = await this.API.updateNodeAuth({
        users: this.selectedUids,
        node_id: this.node.node_id,
        optype,
        node_auth: this.selectNodeAuth,
        leaf_auth: this.selectLeafAuth
      });
      this.$notify({ title: ret.success ? "保存成功" : "保存失败", type: ret.success ? "success" : "warning" });
      this.proxy.list.splice(0);
      this.reloadNodeAuth();
    },
    reloadNodeAuth() {
      this.where.page = 1;
      this.getNodeAuth();
    },
    async getNodeAuth() {
      this.loadingTable = true;
      const ret = await this.API.getNodeAuth({
        node_id: this.node.node_id,
        ...this.where,
        page: this.where.page - 1
      });
      if (ret.success) {
        this.authData = ret.data.data;
        this.dataTotal = ret.data.page;
      }
      this.loadingTable = false;
    },
    sizeChangeHandler(size) {
      this.where.limit = size;
    },
    currentChangeHandler(page) {
      this.where.page = page;
    },
    prevClickHandler() {
      this.where.page -= 1;
    },
    nextClickHandler() {
      this.where.page += 1;
    },
    handleSelectionChange(val) {
      this.selectedAuthItem = val;
    },
    getAuthTag(value, type) {
      const list = [];
      if (type === "node") {
        this.foldAuthCfg.forEach(item => {
          if ((item.v & value) === item.v) {
            list.push(item.n);
          }
        });
      } else {
        this.leafAuthcfg.forEach(item => {
          if ((item.v & value) === item.v) {
            list.push(item.n);
          }
        });
      }
      return list;
    }
  }
};
</script>
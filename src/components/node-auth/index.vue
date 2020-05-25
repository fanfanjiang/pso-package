<template>
  <div class="pso-nodeauth">
    <pso-title>权限</pso-title>
    <div class="pso-na-check">
      <span>栏目权限：</span>
      <el-checkbox-group v-model="nodeAuth">
        <el-checkbox v-for="item in nodeAuthCfg" :label="item.v" :key="item.v">{{item.n}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="pso-na-check">
      <span>数据权限：</span>
      <el-checkbox-group v-model="leafAuth">
        <el-checkbox v-for="item in leafAuthCfg" :label="item.v" :key="item.v">{{item.n}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <pso-picker-user v-if="!selectedAuthItem.length" pattern="checkbox" @confirm="handleAddAuth">
      <el-button size="small" type="primary" plain>添加权限</el-button>
    </pso-picker-user>
    <el-button v-else size="small" type="primary" plain @click="addStatusCfgItem">设置权限</el-button>
  </div>
</template>
<script>
import PsoTitle from "../title";
import { pickerMixin } from "../../mixin/picker";
export default {
  mixins: [pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type" })],
  props: {
    node: Object
  },
  components: { PsoTitle },
  data() {
    return {
      nodeAuthCfg: [
        { n: "新增", v: 1 },
        { n: "编辑", v: 2 },
        { n: "删除", v: 4 }
      ],
      leafAuthCfg: [
        { n: "新增", v: 1 },
        { n: "编辑", v: 2 },
        { n: "删除", v: 4 }
      ],
      nodeAuth: [],
      leafAuth: [],
      selectedAuthItem: [],
      proxy: {
        list: [],
        type: "checkbox"
      },
      where: {
        page: 0,
        limit: 30
      },
      authData: []
    };
  },
  computed: {
    selectedUids() {
      var targetList = this.selectedAuthItem.length ? this.selectedAuthItem : this.proxy.list;
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
    }
  },
  methods: {
    async handleAddAuth(users) {
      this.handleAddSelection(users);
      this.updateNodeAuth(1);
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
    },
    reloadNodeAuth() {
      this.authData = [];
      this.where.page = 0;
      this.getNodeAuth();
    },
    async getNodeAuth() {
      const ret = await this.API.getNodeAuth({
        appid: "Main",
        node_id: this.node.node_id,
        ...this.where
      });
      this.authData = this.authData.concat(ret.data);
    }
  }
};
</script>
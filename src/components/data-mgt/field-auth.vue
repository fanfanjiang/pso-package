<template>
  <div class="pso-nodeauth">
    <div class="pso-nodeauth__header">
      <div class="pso-na-check-wrapper">
        <div class="pso-na-check">
          <span>字段权限：</span>
          <el-checkbox-group v-model="fieldAuth">
            <el-checkbox v-for="item in authCfg" :label="item.v" :key="item.v">{{ item.n }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="pso-na-controller">
        <pso-picker-user v-if="!selectedAuthItem.length" pattern="checkbox" @confirm="handleAddAuth">
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
        size="medium"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="user_name" label="用户" width="180"></el-table-column>
        <el-table-column label="权限">
          <template slot-scope="scope">
            <el-tag v-for="itemVal in getAuthTag(scope.row.show_auth)" :key="itemVal">{{ itemVal }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="pso-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[30, 50, 100, 200, 500]"
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
import { FORM_AUTH } from "../../const/menu";
export default {
  mixins: [pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type" })],
  props: {
    field: Object,
    code: String,
  },
  components: { PsoTitle },
  data() {
    return {
      authCfg: FORM_AUTH,
      fieldAuth: [],
      selectedAuthItem: [],
      proxy: {
        list: [],
        type: "checkbox",
      },
      where: {
        page: 1,
        limit: 30,
      },
      dataTotal: 0,
      authData: [],
      loadingTable: false,
    };
  },
  computed: {
    selectedUids() {
      if (this.selectedAuthItem.length) {
        return _.map(this.selectedAuthItem, "auto_no").join(",");
      } else {
        return _.map(this.proxy.list, "user_id").join(",");
      }
    },
    selectFieldAuth() {
      return this.fieldAuth.length ? this.fieldAuth.reduce((a, b) => a + b) : 0;
    },
  },
  watch: {
    "field.field_name": {
      immediate: true,
      handler() {
        this.getAuth();
      },
    },
    where: {
      deep: true,
      handler() {
        this.getAuth();
      },
    },
  },
  methods: {
    async handleAddAuth(users) {
      this.handleAddSelection(users);
      this.updateNodeAuth(0);
    },
    async updateNodeAuth(optype = 1) {
      const ret = await this.API.updateFieldAuth({
        auth_user: this.selectedUids,
        auto_no: this.selectedUids,
        data_code: this.code,
        field_name: this.field.field_name,
        show_auth: this.selectFieldAuth,
        optype,
      });
      this.$notify({ title: ret.success ? "保存成功" : "保存失败", type: ret.success ? "success" : "warning" });
      this.proxy.list.splice(0);
      this.getAuth();
    },
    async getAuth() {
      this.loadingTable = true;
      const ret = await this.API.getFieldAuth({
        data_code: this.code,
        field_name: this.field.field_name,
        ...this.where,
        page: this.where.page - 1,
      });
      if (ret.success) {
        this.authData = ret.data;
        this.dataTotal = ret.count;
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
    getAuthTag(value) {
      value = parseInt(value);
      const list = [];
      this.authCfg.forEach((item) => {
        if ((item.v & value) === item.v) {
          list.push(item.n);
        }
      });
      return list;
    },
  },
};
</script>
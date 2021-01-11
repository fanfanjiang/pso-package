<template>
  <div class="pso-view">
    <div class="pso-view-body">
      <div ref="header">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-s-help"></i>
              <span>API授权</span>
            </div>
          </div>
        </div>
        <div class="pso-view-fun">
          <div class="pso-view-fun-l">
            <pso-search text="搜索" v-model="fetchParams.keywords"></pso-search>
          </div>
          <div class="pso-view-fun-r">
            <el-button type="primary" size="mini" @click="addHandler">新增</el-button>
            <el-button type="danger" size="mini" @click="delHandler">删除</el-button>
          </div>
        </div>
      </div>
      <div class="pso-view-table">
        <el-table
          v-loading="fetching"
          size="small"
          border
          :data="instances"
          style="width: 100%"
          @row-dblclick="rowdbClickHandler"
          @selection-change="changeHandler"
        >
          <template #default>
            <el-table-column type="selection" width="40" header-align="center" align="center"></el-table-column>
            <el-table-column type="index" label="序号" :index="1" width="50"></el-table-column>
            <el-table-column prop="auth_id" label="ID"></el-table-column>
            <el-table-column prop="api_key" label="KEY"></el-table-column>
            <el-table-column prop="api_secret" label="密钥"></el-table-column>
            <el-table-column prop="auth_name" label="名称"></el-table-column>
            <el-table-column prop="expire_time" label="过期时间"></el-table-column>
            <el-table-column prop="auth_ip" label="IP白名单"></el-table-column>
            <el-table-column prop="auth_method" label="加密方式"></el-table-column>
            <el-table-column prop="auth_note" label="备注"></el-table-column>
          </template>
          <template #empty>
            <pso-empty></pso-empty>
          </template>
        </el-table>
        <div class="pso-view-table__footer">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[20, 30, 50, 100]"
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
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <div class="form-executor-header" v-loading="editing">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>API授权信息</span>
            </div>
          </div>
          <div class="form-executor-header__r">
            <el-button type="primary" size="mini" @click="saveHandler()">保存</el-button>
          </div>
        </div>
      </template>
      <div style="height: 100%; padding: 15px; overflow: auto" v-loading="editing">
        <el-form label-position="left" label-width="100px" size="small">
          <el-form-item label="名称" required>
            <el-input v-model="curInstance.auth_name" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="过期时间" required>
            <el-date-picker v-model="curInstance.expire_time" size="mini" type="datetime"> </el-date-picker>
          </el-form-item>
          <el-form-item label="加密方式" required>
            <el-input v-model="curInstance.auth_method" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="IP白名单" required>
            <el-input v-model="curInstance.auth_ip" type="textarea" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" required>
            <el-input v-model="curInstance.auth_note" type="textarea" size="mini" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { PagingMixin } from "../../mixin/view";

const DATA = {
  auth_name: "",
  expire_time: "",
  auth_method: "",
  auth_ip: "",
  auth_note: "",
};

export default {
  mixins: [PagingMixin],
  data() {
    return {
      fetching: false,
      editing: false,
      instances: [],
      dataTotal: 0,
      showEditor: false,
      curInstance: { ...DATA },
      selected: [],
    };
  },
  async created() {
    this.startWatch();
    await this.fetch();
    this.$on("load", () => {
      this.fetch();
    });
  },
  methods: {
    async fetch() {
      this.fetching = true;
      const ret = await this.API.apiauth({ data: this.getFetchParams() });
      this.instances = ret.data;
      this.fetching = false;
    },
    addHandler() {
      this.curInstance = { ...DATA };
      this.showEditor = true;
    },
    rowdbClickHandler(row) {
      this.curInstance = row;
      this.showEditor = true;
    },
    async saveHandler(params) {
      if (this.editing) return;
      this.editing = true;
      let auth_id;
      let data = {};
      if (params) {
        data = { ...params, optype: 2 };
      } else {
        const { auth_id } = this.curInstance;
        data = { ...this.curInstance, optype: auth_id ? 1 : 0 };
      }
      const ret = await this.API.apiauth({ data, method: "post" });
      this.ResultNotify(ret);
      this.showEditor = false;
      this.fetch();
      this.editing = false;
    },
    async delHandler() {
      if (!this.selected.length) {
        return;
      }
      this.saveHandler({ auth_id: this.selected[0].auth_id });
    },
    changeHandler(rows) {
      this.selected = rows;
    },
  },
};
</script>

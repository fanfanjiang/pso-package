<template>
  <div class="pso-view">
    <div class="pso-view-body">
      <div ref="header">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-setting"></i>
              <span>维度配置</span>
            </div>
          </div>
        </div>
        <div class="pso-view-fun">
          <div class="pso-view-fun-l">
            <div class="view-table-fun">
              <pso-search text="搜索" v-model="fetchParams.keywords"></pso-search>
              <el-divider direction="vertical"></el-divider>
              <el-button type="text" icon="el-icon-refresh" @click="fetch">刷新</el-button>
            </div>
          </div>
          <div class="pso-view-fun-r">
            <div class="view-data-fun">
              <el-button type="primary" size="mini" @click="newDimen">新增维度类型</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="pso-view-table">
        <div class="pso-view-table__body">
          <el-table border size="mini" :data="data" style="width: 100%" :loading="loading">
            <el-table-column prop="tag_name" label="维度标签名"></el-table-column>
            <el-table-column prop="dimen_tag" label="维度标签值"></el-table-column>
            <el-table-column prop="node_dimen" label="维度">
              <template slot-scope="scope">{{ getDname(scope.row.node_dimen) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
                <el-button size="mini" @click.stop.prevent="editDimen(scope.row)">编辑</el-button>
                <el-button v-if="!scope.row.is_sys" size="mini" type="danger" @click.stop.prevent="delDimen(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pso-view-table__footer">
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
    <el-dialog width="30%" :append-to-body="true" :close-on-click-modal="false" title="维度编辑" :visible.sync="showEditor">
      <el-form :model="curDimen" label-width="100px">
        <el-form-item label="维度标签名">
          <el-input size="small" v-model="curDimen.tag_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="维度">
          <el-select size="small" v-model="curDimen.node_dimen">
            <el-option v-for="item in DIMEN_TYPE" :key="item.n" :label="item.n" :value="item.v"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditor = false" size="mini">取 消</el-button>
        <el-button size="mini" type="primary" @click="updateDimen(curDimen.dimen_tag ? 1 : 0)" :loading="saveing" :disabled="saveing"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { PagingMixin } from "../../mixin/view";
import { DIMEN_TYPE } from "../../const/tree.js";
export default {
  mixins: [PagingMixin],
  data() {
    return {
      data: [],
      dataTotal: 0,
      loading: false,
      showEditor: false,
      curDimen: {
        tag_name: "",
        dimen_tag: "",
        node_dimen: "",
      },
      saveing: false,
      DIMEN_TYPE: DIMEN_TYPE,
    };
  },
  created() {
    this.fetch();
    this.startWatch();
    this.$on("load", () => {
      this.fetch();
    });
  },
  methods: {
    async fetch() {
      this.loading = true;
      const params = this.getFetchParams("tag_name");
      const ret = await this.API.getTreeDimen({ ...params, page: params.start });
      if (ret.success) {
        this.data = ret.data;
        this.dataTotal = ret.count;
      }
      this.loading = false;
    },
    async updateDimen(optype) {
      this.saving = true;
      const ret = await this.API.updateTreeDimen({ ...this.curDimen, optype });
      this.saving = false;
      this.showEditor = false;
      this.checkRet(ret);
      this.getData();
    },
    newDimen() {
      this.curDimen = { tag_name: "", dimen_tag: "", node_dimen: "" };
      this.showEditor = true;
    },
    editDimen(data) {
      this.curDimen = { ...data };
      this.showEditor = true;
    },
    delDimen(data) {
      this.curDimen = { ...data };
      this.updateDimen(2);
    },
    checkRet(ret) {
      this.$notify({ title: ret.success ? "成功" : "失败", type: ret.success ? "success" : "warning" });
    },
    getDname(v) {
      return _.find(DIMEN_TYPE, { v }).n;
    },
  },
};
</script>

<template>
  <div class="tree-dimen" ref="treeDimen">
    <div class="tree-dimen__controller" style="z-index:99999;position: relative;">
      <affix :target="getTarget" :bottom="100">
        <el-button @click="newDimen" size="small">新增维度</el-button>
      </affix>
    </div>
    <el-table key="status" :data="data" style="width: 100%" :loading="loading" size="small">
      <el-table-column prop="tag_name" label="维度标签名"></el-table-column>
      <el-table-column prop="dimen_tag" label="维度标签值"></el-table-column>
      <el-table-column prop="node_dimen" label="维度">
        <template slot-scope="scope">{{getDname(scope.row.node_dimen)}}</template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click.stop.prevent="editDimen(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click.stop.prevent="delDimen(scope.row)">删除</el-button>
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
    <el-dialog
      width="30%"
      :append-to-body="true"
      :close-on-click-modal="false"
      title="维度编辑"
      :visible.sync="showEditor"
    >
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
        <el-button
          size="mini"
          type="primary"
          @click="updateDimen(curDimen.dimen_tag?1:0)"
          :loading="saveing"
          :disabled="saveing"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { DIMEN_TYPE } from "../../const/tree.js";
import Affix from "../affix";
export default {
  components: { Affix },
  data() {
    return {
      data: [],
      where: {
        page: 1,
        limit: 30,
      },
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
  watch: {
    where: {
      deep: true,
      handler() {
        this.getData();
      },
    },
  },
  created() {
    this.getData();
  },
  methods: {
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
    async getData() {
      this.loading = true;
      const ret = await this.API.getTreeDimen({
        ...this.where,
        page: this.where.page - 1,
      });
      if (ret.success) {
        this.data = ret.data;
        this.dataTotal = ret.data.length;
      }
      this.loading = false;
    },
    async updateDimen(optype) {
      this.saving = true;
      const ret = await this.API.updateTreeDimen({
        ...this.curDimen,
        optype,
      });
      this.saving = false;
      this.showEditor = false;
      this.checkRet(ret);
      this.getData();
    },
    newDimen() {
      this.curDimen = {
        tag_name: "",
        dimen_tag: "",
        node_dimen: "",
      };
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
    getTarget() {
      return this.$refs.treeDimen;
    },
  },
};
</script>

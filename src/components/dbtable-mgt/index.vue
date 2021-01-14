<template>
  <div class="pso-view">
    <div class="pso-view-body">
      <div ref="header">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-coin"></i>
              <span>数据表配置</span>
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
            <el-table-column prop="table_id" label="表ID"></el-table-column>
            <el-table-column prop="table_name" label="表名"></el-table-column>
            <el-table-column prop="child_config" label="子类配置"></el-table-column>
            <el-table-column prop="table_cate" label="分类"></el-table-column>
            <el-table-column prop="table_order" label="排序"></el-table-column>
            <el-table-column prop="table_note" label="说明"></el-table-column>
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
    <pso-dialog :visible="showEditor" width="40%" @close="showEditor = false">
      <template #title>
        <div class="form-executor-header" v-loading="editing">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>数据表配置</span>
            </div>
          </div>
          <div class="form-executor-header__r">
            <el-button type="primary" size="mini" @click="saveHandler()">保存</el-button>
          </div>
        </div>
      </template>
      <div style="height: 100%; padding: 15px; overflow: auto" v-loading="editing">
        <el-form label-position="left" label-width="100px" size="small">
          <el-form-item label="表ID" required>
            <el-input v-model="curInstance.table_id" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="表名" required>
            <el-input v-model="curInstance.table_name" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="子类配置" required>
            <el-input v-model="curInstance.child_config" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="分类" required>
            <el-input v-model="curInstance.table_cate" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序" required>
            <el-input-number size="mini" v-model="curInstance.table_order" controls-position="right" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="说明" required>
            <el-input v-model="curInstance.table_note" size="mini" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { PagingMixin } from "../../mixin/view";

const DATA = {
  table_id: "",
  table_name: "",
  child_config: "",
  table_cate: "",
  table_order: "",
  table_note: "",
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
      const ret = await this.API.dbtable({ data: this.getFetchParams("table_name") });
      this.instances = ret.data;
      this.dataTotal = ret.count;
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
      let auto_no;
      let data = {};
      if (params) {
        data = { ...params, optype: 2 };
      } else {
        const { auto_no } = this.curInstance;
        data = { ...this.curInstance, optype: auto_no ? 1 : 0 };
      }
      const ret = await this.API.dbtable({ data, method: "post" });
      this.ResultNotify(ret);
      this.showEditor = false;
      this.fetch();
      this.editing = false;
    },
    async delHandler() {
      if (!this.selected.length) {
        return;
      }
      this.saveHandler({ auto_no: this.selected[0].auto_no });
    },
    changeHandler(rows) {
      this.selected = rows;
    },
  },
};
</script>

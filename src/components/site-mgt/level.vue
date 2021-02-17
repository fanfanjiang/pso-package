<template>
  <div class="pso-view">
    <div class="pso-view-body">
      <div class="pso-view-header" v-if="header">
        <div class="pso-view-header__l">
          <div class="pso-view-title">
            <i class="el-icon-setting"></i>
            <span>站点等级配置</span>
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
            <el-button type="primary" size="mini" @click="addHandler">新增</el-button>
            <el-button type="danger" size="mini" @click="delHandler" :disabled="!selected.length">删除</el-button>
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
            <el-table-column prop="auto_no" label="ID"></el-table-column>
            <el-table-column prop="level_name" label="名称"></el-table-column>
            <el-table-column prop="level_val" label="等级值"></el-table-column>
            <el-table-column prop="level_order" label="排序"></el-table-column>
            <el-table-column prop="level_note" label="说明"></el-table-column>
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
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>等级设置</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()">确 定</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <el-form label-position="left" label-width="100px" size="small">
          <el-form-item label="名称" required>
            <el-input v-model="curInstance.level_name" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="等级值" required>
            <el-input v-model="curInstance.level_val" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序" required>
            <el-input-number size="mini" v-model="curInstance.level_order" controls-position="right" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="说明" required>
            <el-input v-model="curInstance.level_note" size="mini" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { PagingMixin } from "../../mixin/view";

const DATA = {
  level_name: "",
  level_val: "",
  level_icon: "",
  level_note: "",
  level_order: "",
};

export default {
  mixins: [PagingMixin],
  props: {
    header: {
      type: Boolean,
      default: true,
    },
  },
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
      const ret = await this.API.siteLevel(this.getFetchParams("level_name"), "get");
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
      let data = {};
      if (params) {
        data = { ...params, optype: 2 };
      } else {
        const { auto_no } = this.curInstance;
        data = { ...this.curInstance, optype: auto_no ? 1 : 0 };
        if (!data.level_name || !data.level_val) return this.$message({ type: "warning", message: "请完善信息" });
      }
      this.editing = true;
      const ret = await this.API.siteLevel(data, "put");
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

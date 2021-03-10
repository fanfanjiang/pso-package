<template>
  <div class="pso-view">
    <div class="pso-view-body">
      <div ref="header">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-s-help"></i>
              <span>API配置</span>
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
            <el-table-column prop="api_id" label="ID"></el-table-column>
            <el-table-column prop="api_tag" label="标记"></el-table-column>
            <el-table-column prop="api_type" label="类型"></el-table-column>
            <el-table-column prop="api_name" label="名称"></el-table-column>
            <el-table-column prop="api_addr" label="地址"></el-table-column>
            <el-table-column prop="api_method" label="请求方式"></el-table-column>
            <el-table-column prop="api_result" label="结果配置"></el-table-column>
            <el-table-column prop="api_note" label="说明"></el-table-column>
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
              <span>API配置</span>
            </div>
          </div>
          <div class="form-executor-header__r">
            <el-button type="primary" size="mini" @click="saveHandler()">保存</el-button>
          </div>
        </div>
      </template>
      <div style="height: 100%; padding: 15px; overflow: auto" v-loading="editing">
        <el-form label-position="left" label-width="100px" size="small">
          <el-form-item label="标记" required>
            <el-input v-model="curInstance.api_tag" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" required>
            <el-input v-model="curInstance.api_type" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="名称" required>
            <el-input v-model="curInstance.api_name" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="请求方式" required>
            <el-select size="mini" filterable v-model="curInstance.api_method">
              <el-option label="get" value="get"></el-option>
              <el-option label="post" value="post"></el-option>
              <el-option label="put" value="put"></el-option>
              <el-option label="delete" value="delete"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址" required>
            <el-input v-model="curInstance.api_addr" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="说明" required>
            <el-input v-model="curInstance.api_note" type="textarea" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="结果标记" required>
            <el-input v-model="curInstance.api_result" type="textarea" size="mini" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { PagingMixin } from "../../mixin/view";

const DATA = {
  api_tag: "",
  api_type: "",
  api_name: "",
  api_addr: "",
  api_method: "get",
  api_result: "",
  api_note: "",
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
      const ret = await this.API.apicfg({ data: this.getFetchParams() });
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
      let data = {};
      if (params) {
        data = { ...params, optype: 2 };
      } else {
        const { api_id } = this.curInstance;
        data = { ...this.curInstance, optype: api_id ? 1 : 0 };
      }
      const ret = await this.API.apicfg({ data, method: "post" });
      this.ResultNotify(ret);
      this.showEditor = false;
      this.fetch();
      this.editing = false;
    },
    async delHandler() {
      if (!this.selected.length) {
        return;
      }
      this.saveHandler({ api_id: this.selected[0].api_id });
    },
    changeHandler(rows) {
      this.selected = rows;
    },
  },
};
</script>

<template>
  <div class="pso-view">
    <div class="pso-view-body">
      <div ref="header">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-setting"></i>
              <span>结构同步配置</span>
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
              <el-button type="primary" size="mini" @click="addHandler">新增同步</el-button>
              <el-button type="danger" size="mini" @click="delHandler">删除</el-button>
            </div>
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
            <el-table-column prop="struct_id" label="ID"></el-table-column>
            <el-table-column prop="struct_name" label="名称"></el-table-column>
            <el-table-column prop="site_id" label="源站点"></el-table-column>
            <el-table-column prop="target_site" label="目标站点"></el-table-column>
            <el-table-column prop="struct_type" label="模板类型"></el-table-column>
            <el-table-column prop="struct_note" label="说明"></el-table-column>
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
    <pso-dialog :visible="showEditor" width="70%" @close="showEditor = false">
      <template #title>
        <div class="form-executor-header" v-loading="editing">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>数据结构配置</span>
            </div>
          </div>
          <div class="form-executor-header__r">
            <el-button type="primary" size="mini" @click="saveHandler()">同步</el-button>
          </div>
        </div>
      </template>
      <div style="height: 100%; padding: 15px; overflow: auto" v-loading="editing">
        <model-sync :data="curInstance" :sites="sites"></model-sync>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { PagingMixin } from "../../mixin/view";
import ModelSync from "./model-sync";

const DATA = {
  struct_name: "",
  site_id: "",
  target_type: "",
  target_site: "",
  struct_type: "",
  struct_note: "",
  data_config: "",
};

export default {
  components: { ModelSync },
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
      sites: [],
    };
  },
  async created() {
    this.startWatch();
    await this.fetch();
    this.$on("load", () => {
      this.fetch();
    });

    this.sites = (await this.API.getSites({ limit: 999, start: 0 })).data.data;
  },
  methods: {
    async fetch() {
      this.fetching = true;
      const ret = await this.API.dbmodel({ data: this.getFetchParams("struct_name"), method: "get" });
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
        const { struct_id, data_config } = this.curInstance;
        const site_id = this.$store.state.base.user.appid;

        data = { ...this.curInstance, site_id, data_config: JSON.stringify(data_config), optype: struct_id ? 1 : 0 };
      }
      const ret = await this.API.dbmodel({ data, method: "post" });
      this.ResultNotify(ret);
      this.showEditor = false;
      this.fetch();
      this.editing = false;
    },
    async delHandler() {
      if (!this.selected.length) {
        return;
      }
      this.saveHandler({ struct_id: this.selected[0].struct_id });
    },
    changeHandler(rows) {
      this.selected = rows;
    },
  },
};
</script>

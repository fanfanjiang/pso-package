<template>
  <div class="pso-view">
    <div class="pso-view-body">
      <div ref="header">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-key"></i>
              <span>授权码</span>
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
              <el-button type="danger" size="mini" @click="delHandler">删除</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="pso-view-table">
        <el-table v-loading="fetching" size="small" border :data="instances" style="width: 100%" @selection-change="changeHandler">
          <template #default>
            <el-table-column type="selection" width="40" header-align="center" align="center"></el-table-column>
            <el-table-column type="index" label="序号" :index="1" width="50"></el-table-column>
            <el-table-column prop="valid_app" label="APPID"></el-table-column>
            <el-table-column prop="is_use" label="是否使用"></el-table-column>
            <el-table-column prop="create_time" label="创建时间"></el-table-column>
            <el-table-column prop="expire_time" label="过期时间"></el-table-column>
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
              <span>生成授权码</span>
            </div>
          </div>
          <div class="form-executor-header__r">
            <el-button type="primary" size="mini" @click="saveHandler()">保存</el-button>
          </div>
        </div>
      </template>
      <div style="height: 100%; padding: 15px; overflow: auto" v-loading="editing">
        <el-form label-position="left" label-width="100px" size="small">
          <el-form-item label="应用" required>
            <el-select filterable clearable size="small" v-model="curInstance.site_app">
              <el-option v-for="(t, i) in sites" :key="i" :label="t.site_name" :value="t.site_app"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { PagingMixin } from "../../mixin/view";

const DATA = {
  site_app: "",
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
      sites: [],
    };
  },
  async created() {
    this.sites = (await this.API.getSites()).data.data;

    this.startWatch();
    await this.fetch();
    this.$on("load", () => {
      this.fetch();
    });
  },
  methods: {
    async fetch() {
      this.fetching = true;
      const ret = await this.API.approval({ data: this.getFetchParams("valid_app"), method: "get" });
      this.instances = ret.data.data;
      this.dataTotal = ret.data.page;
      this.fetching = false;
    },
    addHandler() {
      this.curInstance = { ...DATA };
      this.showEditor = true;
    },
    async saveHandler(params) {
      if (this.editing || !this.curInstance.site_app) return;
      this.editing = true;
      let data = {};
      if (params) {
        data = { ...params, optype: 2 };
      } else {
        const curSite = _.find(this.sites, { site_app: this.curInstance.site_app });
        data = { ...this.curInstance, url: curSite.site_link, optype: 0 };
      }
      const ret = await this.API.approval({ data, method: "post" });
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

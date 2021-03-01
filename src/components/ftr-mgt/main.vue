<template>
  <div class="pso-view">
    <div class="pso-view-body">
      <div ref="header">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-coin"></i>
              <span>全文检索配置</span>
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
              <el-button size="mini" @click="publishHandler" :disabled="selected.length !== 1 || publishing" :loading="publishing">
                发布
              </el-button>
              <el-button type="danger" size="mini" @click="delHandler" :disabled="deleting" :loading="deleting">删除</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="pso-view-table">
        <el-table
          ref="table"
          size="small"
          style="width: 100%"
          border
          v-loading="store.fetching"
          :data="store.instances"
          :row-style="analyzeRowStyle"
          @row-click="rowClickHandler"
          @selection-change="changeHandler"
        >
          <template #default>
            <el-table-column type="selection" width="40" header-align="center" align="center"></el-table-column>
            <el-table-column type="index" label="序号" :index="1" width="50"></el-table-column>
            <el-table-column prop="solr_name" label="配置名称"></el-table-column>
            <el-table-column prop="solr_core" label="配置核心"></el-table-column>
            <el-table-column prop="solr_link" label="链接"></el-table-column>
          </template>
          <template #empty>
            <pso-empty></pso-empty>
          </template>
        </el-table>
        <div class="pso-view-table__footer">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[20, 30, 50, 100]"
            :total="store.dataTotal"
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
        <div class="form-executor-header">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>新增配置</span>
            </div>
          </div>
        </div>
      </template>
      <div style="height: 100%; padding: 15px; overflow: auto" v-loading="store.saving">
        <main-designer ref="designer" @save="goAdd" :store="store"></main-designer>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { PagingMixin } from "../../mixin/view";
import MainDesigner from "./main-designer";
export default {
  components: { MainDesigner },
  mixins: [PagingMixin],
  props: {
    store: Object,
  },
  data() {
    return {
      showEditor: false,
      publishing: false,
      deleting: false,
      selected: [],
    };
  },
  async created() {
    this.startWatch();
    this.fetch();
    this.$on("load", () => {
      this.fetch();
    });
  },
  methods: {
    doLayout() {
      this.$refs.table.doLayout();
    },
    async fetch() {
      await this.store.fetch(this.getFetchParams("solr_name"));
    },
    rowClickHandler(data) {
      this.$emit("rowclick", data);
    },
    changeHandler(data) {
      this.selected = data;
    },
    addHandler() {
      this.showEditor = true;
    },
    async delHandler() {
      if (this.deleting) return;
      this.deleting = true;
      for (let item of this.selected) {
        await this.store.modify({ solr_id: item.solr_id, optype: 2 });
        if (item === this.store.curInstance) {
          this.store.curInstance = null;
        }
      }
      this.deleting = false;
      this.fetch();
    },
    async goAdd(data) {
      if (this.store.saving) return;
      await this.store.modify({ ...data, optype: 0 });
      this.showEditor = false;
      this.fetch();
    },
    async publishHandler() {
      if (this.publishing) return;
      this.publishing = true;
      for (let item of this.selected) {
        await this.store.publish({ solr_id: item.solr_id });
      }
      this.publishing = false;
      this.fetch();
    },
    analyzeRowStyle({ row, rowIndex }) {
      if (this.store.curInstance && this.store.curInstance.solr_id === row.solr_id) {
        return { "background-color": "#DCF1FF" };
      }
    },
  },
};
</script>
<template>
  <div class="pso-view">
    <div class="pso-view-body">
      <div ref="header">
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
          v-loading="store.fetchingModule"
          size="small"
          border
          :data="store.modules"
          style="width: 100%"
          @row-click="rowClickHandler"
          @selection-change="changeHandler"
        >
          <template #default>
            <el-table-column type="selection" width="40" header-align="center" align="center"></el-table-column>
            <el-table-column type="index" label="序号" :index="1" width="50"></el-table-column>
            <el-table-column prop="child_name" label="配置名称"></el-table-column>
            <el-table-column prop="child_type" label="配置类型"></el-table-column>
            <el-table-column prop="child_field" label="配置字段"></el-table-column>
          </template>
          <template #empty>
            <pso-empty></pso-empty>
          </template>
        </el-table>
        <div class="pso-view-table__footer">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[20, 30, 50, 100]"
            :total="store.moduleTotal"
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
        <div class="form-executor-header">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>子模块配置</span>
            </div>
          </div>
          <div class="form-executor-header__r">
            <el-button type="primary" size="mini" @click="saveHandler">保存</el-button>
          </div>
        </div>
      </template>
      <div style="height: 100%; padding: 15px; overflow: auto">
        <sub-designer :data="module"></sub-designer>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import SubDesigner from "./sub-designer";
import { PagingMixin } from "../../mixin/view";
export default {
  components: { SubDesigner },
  mixins: [PagingMixin],
  props: {
    store: Object,
  },
  watch: {
    "store.curInstance": {
      immediate: true,
      handler() {
        if (this.store.curInstance) {
          this.reload();
        }
      },
    },
  },
  data() {
    return {
      showEditor: false,
      module: {},
      deleting: false,
      selected: [],
    };
  },
  async created() {
    this.startWatch();
    this.$on("load", () => {
      this.fetch();
    });
  },
  methods: {
    async reload() {
      if (this.fetchParams.start !== 1) {
        this.fetchParams.start = 1;
      } else {
        this.fetch();
      }
    },
    async fetch() {
      await this.store.fetchModules(this.getFetchParams("child_name"));
    },
    addHandler() {
      this.module = {};
      this.showEditor = true;
    },
    rowClickHandler(data) {
      this.module = data;
      this.showEditor = true;
    },
    changeHandler(data) {
      this.selected = data;
    },
    async delHandler() {
      if (this.deleting) return;
      this.deleting = true;
      for (let item of this.selected) {
        await this.store.modifySub({ child_id: item.child_id, optype: 2 });
      }
      this.deleting = false;
      this.fetch();
    },
    async saveHandler() {
      if (this.store.savingSub) return;
      const { solr_id } = this.module;
      await this.store.modifySub({ ...this.module, solr_id: this.store.curInstance.solr_id, optype: solr_id ? 1 : 0 });
      this.showEditor = false;
      this.fetch();
    },
  },
};
</script>
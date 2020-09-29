<template>
  <div class="pso-view pso-view-wf" :class="viewClass" v-loading="!store || store.initializing">
    <template v-if="store && !store.initializing">
      <!-- 过滤器 -->
      <div class="pso-view-extend">
        <transition name="el-fade-in">
          <pso-data-filter
            v-show="store.showFilter"
            v-model="store.condition"
            :condition="store.defCondition"
            :fieldsOptions="store.conditionOptions"
            fixedfield
          ></pso-data-filter>
        </transition>
      </div>
      <div class="pso-view-body">
        <!-- 标题和权限视图过滤 -->
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <img src="../../assets/images/form.png" />
              <span>{{ pageTitle }}</span>
            </div>
          </div>
          <div class="pso-view-header__r">
            <div class="pso-view-authtab">
              <el-tabs v-model="store.activeView">
                <el-tab-pane v-for="(ah, i) in store.authViews" :key="i" :label="ah.n" :name="ah.v + ''"></el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
        <!-- 视图切换 -->
        <div class="pso-view-viewtab">
          <fast-switch key="wfStatuses" :store="store" switch="wfStatuses" model="curWfStatus" skey="d_audit"></fast-switch>
          <fast-switch divider key="stages" :store="store" showtype="select" switch="stages" model="curStage" skey="d_stage"></fast-switch>
        </div>
        <!-- 排序标签 -->
        <div class="pso-view-sorttag" v-if="store.sorts.length">
          <el-tag size="small" v-for="(sort, i) in store.sorts" :key="i" closable @close="store.removeSort(i)">
            {{ sort.name }} {{ sort.order === "desc" ? "降序" : "升序" }}
          </el-tag>
        </div>
        <!-- 表格 -->
        <div class="pso-view-table" v-loading="store.starting">
          <div class="pso-view-table__header">
            <div class="pso-view-table__header-l">
              <table-fun :store="store" :files="params.downloadFiles"></table-fun>
            </div>
            <div class="pso-view-table__header-r">
              <data-fun
                :store="store"
                :addable="!params.hideNewBtn"
                :changable="!params.hideChangeBtn"
                :stageable="!params.hideStage"
                :copyable="!params.hideCopyBtn"
                :moreable="!params.hideMoreBtn"
                :exportable="!params.hideExport"
              >
                <template #op> </template>
              </data-fun>
            </div>
          </div>
          <view-table :store="store" :params="{ ...params, ...$props }"></view-table>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import WFVStore from "./store";
import FastSwitch from "../form-view/fast-switch";
import TableFun from "../form-view/table-fun";
import DataFun from "../form-view/data-fun";
import ViewTable from "../form-view/table";
import Dropdown from "../form-view/dropdown";

export default {
  components: { FastSwitch, TableFun, DataFun, ViewTable, Dropdown },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
    opColumn: {
      type: Boolean,
      default: false,
    },
    opText: {
      type: String,
      default: "操作",
    },
    operateWidth: {
      type: String,
      default: "100",
    },
    tableSize: {
      type: String,
      default: "small",
    },
    modifiable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      store: null,
      watchFun: [],
    };
  },
  computed: {
    pageTitle() {
      return this.titleText || (this.store && this.store.wfCfg.wf_name);
    },
    viewClass() {
      return {
        "pso-view__expend": this.store.showFilter,
      };
    },
  },
  watch: {
    "params.wfId": {
      immediate: true,
      handler() {
        this.initialize();
      },
    },
  },
  methods: {
    async initialize() {
      if (this.params.wfId) {
        if (this.watchFun.length) {
          this.watchFun.forEach((f) => f());
          this.watchFun = [];
        }

        this.store = new WFVStore({
          $vue: this,
          defSearchType: this.params.searchType,
        });

        if (this.params.viewAuth) {
          this.store.analyzeAuthView(this.params.viewAuth, this.params.auth_config);
        }

        this.makeKeys();
        await this.store.initialize(this.params.wfId, this.params.useCloumn);
        this.$emit("initialized", { store: this.store.store, cfg: this.store.formCfg });

        if (this.params.textGroup && this.params.plug_code) {
          this.store.analyzeViewText(this.params.textGroup, this.params.plug_code);
        }

        this.watchFun.push(
          this.$watch("store.limit", () => {
            this.store.deFetch();
          }),

          this.$watch("store.page", () => {
            this.store.deFetch();
          }),

          this.$watch("store.condition", () => {
            this.store.deFetch();
          }),

          this.$watch("store.activeView", () => {
            this.makeKeys();
            this.store.fetchStatus();
          }),

          this.$watch("params.defKeys", () => {
            this.makeKeys();
            this.store.fetchStatus();
          }),

          this.$watch("params.defForm", () => {
            this.makeKeys();
            this.store.fetchStatus();
          })
        );
      } else {
        this.store = null;
      }
    },
    makeKeys() {
      this.store.makeDefkeys({ defKeys: this.params.defKeys, defForm: this.params.defForm });
    },
  },
};
</script>
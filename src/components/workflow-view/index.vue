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
              <icon></icon>
              <span>{{ pageTitle }}</span>
            </div>
          </div>
          <div class="pso-view-header__r">
            <div class="pso-view-authtab" v-show="store.authViews.length > 1 && !params.hideAuthTab">
              <el-tabs v-model="store.activeView">
                <el-tab-pane v-for="(ah, i) in store.authViews" :key="i" :label="ah.n" :name="ah.v + ''"></el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
        <!-- 视图切换 -->
        <div class="pso-view-viewtab" v-if="!params.hideStatusTab">
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
                @new="store.showInstance.call(store, null)"
              >
                <template #op>
                  <el-popconfirm
                    confirmButtonText="确定"
                    cancelButtonText="取消"
                    icon="el-icon-info"
                    iconColor="red"
                    title="你确认吗"
                    @onConfirm="store.handleBackout.call(store)"
                    v-if="store.opBackoutable && !params.hideBackBtn"
                  >
                    <el-button :disabled="!store.backoutable" slot="reference" size="mini" type="primary" plain>{{
                      store.cpntText.backout
                    }}</el-button>
                  </el-popconfirm>
                  <el-popconfirm
                    confirmButtonText="确定"
                    cancelButtonText="取消"
                    icon="el-icon-info"
                    iconColor="red"
                    title="你确认吗"
                    @onConfirm="store.handleArchive.call(store)"
                    v-if="store.opArchiveable && !params.hideArchiveBtn"
                  >
                    <el-button :disabled="!store.archiveable" slot="reference" size="mini" type="primary" plain>{{
                      store.cpntText.archive
                    }}</el-button>
                  </el-popconfirm>
                </template>
              </data-fun>
            </div>
          </div>
          <view-table :store="store" :params="{ ...params, ...$props, checkbox }"></view-table>
        </div>
      </div>
      <pso-dialog :title="store.wfCfg.wf_name" :visible="store.showExecutor" :width="executorWidth" @close="store.showExecutor = false">
        <template #title>
          <div class="form-executor-header">
            <div class="form-executor-header__l">
              <div class="form-executor-title">
                <i class="el-icon-edit-outline"></i>
                <span>{{ pageTitle }}</span>
              </div>
            </div>
          </div>
        </template>
        <pso-wf-executor
          ref="executor"
          :params="executorParams"
          @before-save="$emit('executor-beforesave', $event)"
          @before-next="$emit('executor-beforenext', $event)"
          @excuted="store.handleExcuted.call(store, $event)"
          @executor-initialized="$emit('executor-initialized', $event)"
        >
          <template slot="data" slot-scope="scope">
            <slot name="data" :store="scope.store"></slot>
          </template>
          <template slot="content" slot-scope="scope">
            <slot name="content" :store="scope.store"></slot>
          </template>
        </pso-wf-executor>
      </pso-dialog>
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
import Icon from "./icon";

export default {
  components: { FastSwitch, TableFun, DataFun, ViewTable, Dropdown, Icon },
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
    checkbox: {
      type: Boolean,
      default: true,
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
        "pso-view__expend": this.store && this.store.showFilter,
      };
    },
    displayMode() {
      return this.params.forceExpand ? "" : this.store.copying ? "simple" : this.store.curInstance ? "" : "";
    },
    executorWidth() {
      return this.params.ewidth || (this.displayMode ? "60%" : "88%");
    },
    executorParams() {
      return {
        node_id: this.params.wfId,
        instance: { instanceId: this.store.curInstance ? this.store.curInstance.leaf_id : "" },
        copy: this.store.copying,
        displayMode: this.displayMode,
        defForm: this.params.defForm,
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
        await this.store.fetchStatus();

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
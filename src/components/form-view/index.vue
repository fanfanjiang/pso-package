<template>
  <div class="pso-view pso-view-form" ref="view" :class="viewClass" v-loading="!store || store.initializing">
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
            defingop
          ></pso-data-filter>
        </transition>
      </div>
      <div class="pso-view-body" ref="viewBody">
        <!-- 标题和权限视图过滤 -->
        <div ref="header">
          <div class="pso-view-header">
            <div class="pso-view-header__l" v-if="!params.hideViewTitle">
              <div class="pso-view-title">
                <i class="el-icon-document"></i>
                <span>{{ pageTitle }}</span>
              </div>
            </div>
            <div class="pso-view-header__r" v-show="store.authViews.length > 1 && !params.hideAuthTab">
              <div class="pso-view-authtab">
                <el-tabs v-model="store.activeView">
                  <el-tab-pane v-for="(ah, i) in store.authViews" :key="i" :label="ah.n" :name="ah.v + ''"></el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
          <!-- 视图切换 -->
          <div class="pso-view-viewtab" v-if="!params.hideStatusTab">
            <fast-switch :store="store" key="statuses" switch="statuses" model="curStatus" skey="d_status"></fast-switch>
            <fast-switch
              divider
              :store="store"
              key="stages"
              showtype="select"
              switch="stages"
              model="curStage"
              skey="d_stage"
            ></fast-switch>
          </div>
          <!-- 排序标签 -->
          <div class="pso-view-sorttag" v-if="store.displayableSotrs.length">
            <template v-for="(sort, i) in store.operableSotrs">
              <el-tag v-if="sort.operable" size="small" :key="i" :closable="sort.operable" @close="store.removeSort(i)">
                {{ sort.name }} {{ sort.order === "desc" ? "降序" : "升序" }}
              </el-tag>
            </template>
          </div>
          <div class="pso-view-fun">
            <div class="pso-view-fun-l" v-if="!params.hideTablefun">
              <table-fun :store="store" :files="params.downloadFiles"></table-fun>
            </div>
            <div class="pso-view-fun-r">
              <data-fun
                :store="store"
                :addable="addable && !params.hideNewBtn"
                :selectable="selectable"
                :changable="changable && !params.hideChangeBtn"
                :stageable="stageable && !params.hideStage"
                :copyable="addable && !params.hideCopyBtn"
                :moreable="!params.hideMoreBtn"
                :exportable="!params.hideExport"
                :wipeable="wipeable"
                :hidden="!!params.hideTablefun"
                @new="newInstance"
                @select="$emit('selection-confirm', store.selectedList)"
                @wipe="wipeHandler"
              >
                <template v-slot:op="scope">
                  <slot name="op" v-bind:data="scope.store"></slot>
                </template>
              </data-fun>
            </div>
          </div>
        </div>
        <!-- 表格 -->
        <div class="pso-view-table" v-loading="store.starting">
          <view-table v-if="!__isMobile__" :store="store" :params="{ ...params, ...$props }">
            <template v-slot:column="scope">
              <slot name="column" v-bind:data="scope.data"></slot>
            </template>
          </view-table>
          <mobile-view v-else :store="store"></mobile-view>
        </div>
      </div>
      <pso-form-executor
        :params="executorParams"
        :title="store.formCfg.data_name"
        :opener="store"
        :instanceids="store.instanceids"
        :auto-submit="formAutoSubmit"
        :switchable="store.switchable"
        :keepable="store.keepable"
        @data-changed="dataChangeHandler"
        @prev="store.showPrev.call(store, $event)"
        @next="store.showNext.call(store, $event)"
      ></pso-form-executor>
      <wipe-dialog :store="store"></wipe-dialog>
    </template>
  </div>
</template>
<script>
import FormviewStore from "./store";
import FastSwitch from "./fast-switch";
import TableFun from "./table-fun";
import DataFun from "./data-fun";
import ViewTable from "./table";
import Icon from "./icon";
import WipeDialog from "./wipe-dialog";
import MobileView from "./mobile-view";

export default {
  components: { FastSwitch, TableFun, DataFun, ViewTable, Icon, WipeDialog, MobileView },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
    cfgId: String,
    autoSubmit: {
      type: Boolean,
      default: true,
    },
    columnFilter: Array,
    operate: {
      type: Boolean,
      default: false,
    },
    operateWidth: {
      type: String,
      default: "100",
    },
    addable: {
      type: Boolean,
      default: true,
    },
    detailEditable: {
      type: Boolean,
      default: true,
    },
    deletable: {
      type: Boolean,
      default: true,
    },
    checkbox: {
      type: Boolean,
      default: true,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    changable: {
      type: Boolean,
      default: true,
    },
    autoChange: {
      type: Boolean,
      default: true,
    },
    stageable: {
      type: Boolean,
      default: true,
    },
    selectionType: {
      type: String,
      default: "checkbox",
    },
    dataPovider: Function,
    opText: {
      type: String,
      default: "操作",
    },
    where: [Object, String],
    viewAuth: {
      type: Number,
      default: 0,
    },
    defOpauth: Number,
    textGroup: String,
    plug_code: String,
    defKeys: String,
    defForm: Object,
    bindUserpicker: Object,
    tableRowClick: Function,
    defLimit: Number,
    titleText: {
      type: String,
      default: "",
    },
    tableSize: {
      type: String,
      default: "small",
    },
    tableMaxHeight: {
      type: String,
      default: "800px",
    },
    modifiable: {
      type: Boolean,
      default: true,
    },
    simplePagination: {
      type: Boolean,
      default: false,
    },
    wipeable: {
      type: Boolean,
      default: false,
    },
    wipeallable: {
      type: Boolean,
      default: false,
    },
    defComplexity: {
      type: String,
      default: "",
    },
    statusesFilter: {
      type: String,
      default: () => [],
    },
    expanding: {
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
      return this.titleText || this.params.menu_name || this.store.formCfg.data_name;
    },
    viewClass() {
      return {
        "pso-view__expand": this.store && this.store.defCondition.length && this.store.showFilter,
      };
    },
    executorParams() {
      //这里只用了新增权限来控制所有操作权限
      return {
        formEntity: this.store.formCfg,
        dataId: this.store.dataId,
        dataInstance: this.store.instance,
        dataDefault: this.defForm,
        editable: (this.store.dataId ? this.detailEditable : this.addable) && this.store.instanceEditable,
        addable: this.addable && this.store.opAddable,
        deletable: this.deletable && this.store.instanceEditable && !this.store.actioning,
        extendAuth: this.store.fieldsRule,
        befSaveFunc: this.store.checkBefActionScript.bind(this.store),
      };
    },
    formAutoSubmit() {
      return this.autoSubmit && this.store.autoSubmit;
    },
  },
  watch: {
    cfgId: {
      immediate: true,
      handler() {
        this.initialize();
      },
    },
    "store.starting"(val) {
      if (this.store && !this.store.initializing && !val && this.$refs.header) {
        const height = $(this.$refs.view).height() - $(this.$refs.header).height() - 65;
        if (height > 100) {
          this.store.tableHeight = height;
        }
      }
    },
  },
  methods: {
    async initialize() {
      if (this.watchFun.length) {
        this.watchFun.forEach((f) => f());
        this.watchFun = [];
      }

      if (this.cfgId) {
        this.store = new FormviewStore({
          $vue: this,
          opAuth: this.defOpauth,
          limit: this.defLimit,
          defSearchType: this.params.searchType,
          autoChange: this.autoChange,
          insttogo: this.params.insttogo,
          wipeallable: this.wipeallable,
          sourceType: "0",
          fetchMode: this.__isMobile__ ? "2" : "1",
          statusesFilter: this.statusesFilter,
        });

        if (this.viewAuth) {
          this.store.analyzeAuthView(this.viewAuth, this.params.auth_config);
        }

        if (this.textGroup && this.plug_code) {
          this.store.analyzeViewText(this.textGroup, this.plug_code);
        }

        if (this.cfgId) {
          this.makeKeys();
          await this.store.initialize(this.cfgId, this.params.useCloumn);
          this.$emit("initialized", { vStore: this.store, store: this.store.store, cfg: this.store.formCfg, defForm: this.defForm });
          await this.store.fetchStatus();
        }

        this.store.showFilter = this.expanding;

        this.watchFun.push(
          this.$watch("store.limit", () => {
            this.store.deFetch();
          }),

          this.$watch("store.page", () => {
            if (this.store.fetching) return;
            this.store.deFetch();
          }),

          this.$watch("store.condition", () => {
            this.store.refetch();
          }),

          this.$watch("store.activeView", () => {
            this.makeKeys();
            this.store.fetchStatus();
          }),

          this.$watch("defKeys", () => {
            this.makeKeys();
            this.store.fetchStatus();
          }),

          this.$watch("defForm", () => {
            this.makeKeys();
            this.store.fetchStatus();
          })
        );
      } else {
        this.store = null;
      }
    },
    makeKeys() {
      this.store.makeDefkeys({ where: this.where, defKeys: this.defKeys, defForm: this.defForm, defComplexity: this.defComplexity });
    },
    async dataChangeHandler(data) {
      await this.store.checkDataChange(data);
      await this.store.fetchStatus();
      this.$emit("data-changed", data);
    },
    getFixedTarget() {
      return this.$refs.viewBody;
    },
    async newInstance() {
      await this.store.newInstance(true);
    },
    wipeHandler() {
      this.store.showWiper();
    },
  },
};
</script>
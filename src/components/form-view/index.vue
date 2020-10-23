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
          ></pso-data-filter>
        </transition>
      </div>
      <div class="pso-view-body" ref="viewBody">
        <!-- 标题和权限视图过滤 -->
        <div ref="header">
          <div class="pso-view-header">
            <div class="pso-view-header__l">
              <div class="pso-view-title">
                <i class="el-icon-document"></i>
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
          <div class="pso-view-sorttag" v-if="store.operableSotrs.length">
            <el-tag size="small" v-for="(sort, i) in store.operableSotrs" :key="i" closable @close="store.removeSort(i)">
              {{ sort.name }} {{ sort.order === "desc" ? "降序" : "升序" }}
            </el-tag>
          </div>
          <div class="pso-view-fun">
            <div class="pso-view-fun-l">
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
                @new="store.newInstance.call(store)"
                @select="$emit('selection-confirm', store.selectedList)"
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
          <view-table :store="store" :params="{ ...params, ...$props }">
            <template v-slot:column="scope">
              <slot name="column" v-bind:data="{ row: scope.row }"></slot>
            </template>
          </view-table>
        </div>
      </div>
      <pso-form-executor
        :params="executorParams"
        :title="store.formCfg.data_name"
        :opener="store"
        :instanceids="store.instanceids"
        @data-changed="dataChangeHandler"
        @prev="store.showPrev.call(store, $event)"
        @next="store.showNext.call(store, $event)"
      ></pso-form-executor>
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

export default {
  components: { FastSwitch, TableFun, DataFun, ViewTable, Icon },
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
        "pso-view__expend": this.store && this.store.showFilter,
      };
    },
    executorParams() {
      //这里只用了新增权限来控制所有操作权限
      return {
        formEntity: this.store.formCfg,
        dataId: this.store.dataId,
        dataInstance: this.store.instance,
        dataDefault: this.defForm,
        editable: (this.store.dataId ? this.detailEditable : this.addable) && this.store.opAddable,
        addable: this.addable && this.store.opAddable,
        deletable: this.deletable && this.store.opAddable,
      };
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
      this.store.makeDefkeys({ where: this.where, defKeys: this.defKeys, defForm: this.defForm });
    },
    dataChangeHandler(data) {
      this.store.fetchStatus();
      this.$emit("data-changed", data);
    },
    getFixedTarget() {
      return this.$refs.viewBody;
    },
  },
};
</script>
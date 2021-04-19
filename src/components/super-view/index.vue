<template>
  <div class="pso-super-view" v-loading="store && initializing">
    <div class="pso-super-view__body" v-if="store && !initializing">
      <div class="pso-super-view__calendar" v-if="params.withCalendar">
        <pso-calendar @change="dayChangeHandler"></pso-calendar>
      </div>
      <view-body
        :store="store"
        :params="params"
        :clickable="params.titleClickable"
        :click-show="params.titleClickType === '1'"
        :vertical="params.viewVer"
        @click-inst="clickInst"
      ></view-body>
      <div class="pso-super-view__add" v-if="store.checkActionUsable('add') && store.addAction">
        <el-button icon="el-icon-plus" circle @click="addHandler"></el-button>
      </div>
      <pso-form-executor
        v-if="params.sourceType === '0'"
        :params="executorParams"
        :title="store.formCfg.data_name"
        :opener="store"
        :instanceids="store.instanceids"
        :switchable="store.switchable"
        :keepable="store.keepable"
        @data-changed="dataChangeHandler"
        @prev="store.showPrev.call(store, $event)"
        @next="store.showNext.call(store, $event)"
      ></pso-form-executor>
      <pso-dialog :visible="showDetail" width="60%" @close="showDetail = false">
        <template #title>
          <pso-dialog-header>
            <template #title>
              <i class="el-icon-edit-outline"></i>
              <span>详情</span>
            </template>
          </pso-dialog-header>
        </template>
        <div class="pso-dialog-content">
          <pso-super-detail :instance="detail" :fv-store="store" :params="params"></pso-super-detail>
        </div>
      </pso-dialog>
    </div>
  </div>
</template>
<script>
import PsoCalendar from "../calendar";
import ViewBody from "./view";
import SuperViewStore from "./store";
import dayjs from "dayjs";
export default {
  components: { PsoCalendar, ViewBody },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
    urine: Object,
  },
  data() {
    return {
      initializing: true,
      store: null,
      watchFun: [],
      time: new Date(),
      showDetail: false,
      detail: {},
    };
  },
  created() {
    this.initialize();
  },
  computed: {
    executorParams() {
      //这里只用了新增权限来控制所有操作权限
      return {
        formEntity: this.store.formCfg,
        dataId: this.store.dataId,
        dataInstance: this.store.instance,
        editable: this.store.dataId && this.store.instanceEditable,
        addable: this.store.opAddable,
        deletable: false,
        extendAuth: this.store.fieldsRule,
      };
    },
  },
  methods: {
    async initialize() {
      this.initializing = true;
      const { viewAuth, useCloumn, source, sourceType, paging, limit, fetchAPI } = this.params;

      if (this.watchFun.length) {
        this.watchFun.forEach((f) => f());
        this.watchFun = [];
      }

      const options = {
        $vue: this,
        sourceType,
        urine: this.urine,
        fetchMode: !paging && !limit ? "2" : "1",
      };
      if (limit) {
        options.limit = limit;
      }
      if (fetchAPI) {
        options.fetchAPI = fetchAPI;
      }
      this.store = new SuperViewStore(options);
      this.store.analyzeAuthView(viewAuth, []);

      this.makeKeys(this.time);
      await this.store.initialize(source, useCloumn);
      await this.store.fetchStatus();
      this.initializing = false;
    },
    makeKeys(value) {
      const { defKeys, defComplexity, withCalendar, calendarTime } = this.params;
      this.store.makeDefkeys({ defKeys, defComplexity });
      if (withCalendar && calendarTime) {
        this.store.defaultKeys[calendarTime] = {
          type: 3,
          value: `[${dayjs(value).format("YYYY-MM-DD 00:00:00")},${dayjs(value).format("YYYY-MM-DD 24:59:59")}]`,
        };
      }
    },
    dayChangeHandler(value) {
      this.makeKeys(value);
      this.store.fetch();
    },
    addHandler() {
      this.store.newInstance();
    },
    clickInst(data) {
      const { titleClickType, titleClickVal, source, titleLinkType } = this.params;
      const { tp_code, child_id } = this.urine;
      if (titleClickType === "2") {
        if (titleClickVal) {
          if (titleLinkType === "1") {
            const path = titleClickVal
              .replaceAll(":fid", source)
              .replaceAll(":mid", child_id)
              .replaceAll(":pid", tp_code)
              .replaceAll(":id", data.leaf_id);
            this.$router.push({ path });
          } else if (titleLinkType === "2") {
            window.open(data[titleClickVal]);
          }
        }
      } else if (titleClickType === "3") {
        this.detail = data;
        this.showDetail = true;
      }
      this.$emit("instance-click", data);
    },
  },
};
</script>
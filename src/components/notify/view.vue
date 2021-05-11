<template>
  <div class="pso-notify-view">
    <div class="pso-notify-view__body" v-if="!store.fetching && store.instances.length">
      <div class="pso-notify-item" v-for="(d, i) in store.instances" :key="i">
        <view-item :data="d" :store="store"></view-item>
      </div>
    </div>
    <pso-skeleton v-if="store.fetching" :lines="5"></pso-skeleton>
    <pso-empty v-if="!store.fetching && !store.instances.length" title="暂无消息"></pso-empty>
    <div class="pso-notify-view__footer" v-if="store.dataTotal && pagination && !store.fetching">
      <el-pagination
        layout="total, prev, pager, next"
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
    <pso-dialog :visible="store.showWFExecutor" width="94%" @close="store.showWFExecutor = false">
      <template #title>
        <div class="form-executor-header">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>{{ store.curInstance.name }}</span>
            </div>
          </div>
        </div>
      </template>
      <pso-wf-executor ref="executor" :params="executorParams" @excuted="handleExcuted"></pso-wf-executor>
    </pso-dialog>
    <pso-form-executor :params="formExecutorParams" :opener="store"></pso-form-executor>
  </div>
</template>
<script>
import ViewItem from "./view-item";
import { PagingMixin } from "../../mixin/view";
export default {
  components: { ViewItem },
  mixins: [PagingMixin],
  props: {
    store: Object,
    pagination: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    executorParams() {
      return {
        node_id: this.store.curInstance.code,
        instance: { instanceId: this.store.curInstance.instance_id },
      };
    },
    formExecutorParams() {
      return {
        formId: this.store.curInstance.code,
        dataId: this.store.curInstance.instance_id,
        editable: false,
        addable: false,
        deletable: false,
      };
    },
  },
  async created() {
    this.fetch();
    this.startWatch();
    this.$on("load", () => {
      this.fetch();
    });
  },
  methods: {
    async fetch() {
      this.store.pagination = this.getFetchParams();
      await this.store.fetch();
    },
    handleExcuted() {},
  },
};
</script>
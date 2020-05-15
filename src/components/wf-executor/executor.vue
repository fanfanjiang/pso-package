<template>
  <div class="pso-wf-executor" :class="executorClass" v-loading="store.loading||store.steping">
    <transition name="el-zoom-in-top">
      <div class="pso-wf-executor__body" v-show="store.showBody">
        <div class="pso-wf-executor__main" v-bar>
          <div>
            <div class="pso-wf-executor__main-header">
              <pso-wf-overview :store="store"></pso-wf-overview>
            </div>
            <div
              v-if="!isMobile"
              ref="wfTable"
              class="pso-wf-executor__main-content"
              id="executorMain"
              v-html="store.cfg.wf_body_tp"
            ></div>
          </div>
          <transition name="el-zoom-in-bottom">
            <pso-wfop-user
              v-if="store.showUserOp"
              @close="store.showUserOp=false"
              @confirm="append"
            ></pso-wfop-user>
          </transition>
        </div>
        <div class="pso-wf-executor__footer">
          <pso-wfop :store="store"></pso-wfop>
        </div>
      </div>
    </transition>
    <div class="pso-wf-executor__extend" :class="extendClass">
      <div class="pso-wf-executor__extend-header">
        <el-tabs v-model="store.activeExtendTab">
          <el-tab-pane v-if="store.showBody" label="数据" name="data"></el-tab-pane>
          <el-tab-pane v-if="store.showBody" label="附件" name="attach"></el-tab-pane>
          <el-tab-pane label="流程图" name="flowchart"></el-tab-pane>
          <el-tab-pane v-if="store.showBody" label="日志" name="log"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="pso-wf-executor__extend-body" v-bar>
        <div>
          <div class="pso-wf-executor__content" v-show="store.activeExtendTab==='data'">
            <pso-wf-mainform :store="store"></pso-wf-mainform>
            <pso-wf-form :store="store"></pso-wf-form>
          </div>
          <pso-wf-attach :store="store" v-show="store.activeExtendTab==='attach'"></pso-wf-attach>
          <pso-wf-chart :store="store" v-show="store.activeExtendTab==='flowchart'"></pso-wf-chart>
          <pso-wf-log :store="store" v-show="store.activeExtendTab==='log'"></pso-wf-log>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import shortid from "shortid";

import { REVIEW_OP_TYPE, REVIEW_OP_APPEND } from "../../const/workflow";

import PsoWfMainform from "./form-main";
import PsoWfop from "./op";
import PsoWfopUser from "./op/confirm-user";
import PsoWfOverview from "./overview";
import PsoWfForm from "./form";
import PsoWfAttach from "./attach";
import PsoWfChart from "./flowchart";
import PsoWfLog from "./log";
import { executor, op } from "./mixin";

export default {
  components: { PsoWfMainform, PsoWfop, PsoWfopUser, PsoWfOverview, PsoWfForm, PsoWfAttach, PsoWfChart, PsoWfLog },
  mixins: [executor, op],
  data() {
    return {
      REVIEW_OP_TYPE: REVIEW_OP_TYPE
    };
  },
  computed: {
    extendClass() {
      return {
        "pso-wf-executor__extend__expend": !this.store.showBody
      };
    },
    executorClass() {
      return {
        "pso-wf-executor__m": this.isMobile
      };
    }
  },
  async created() {},
  methods: {
    async append() {
      await this.nextStep(REVIEW_OP_APPEND);
    }
  }
};
</script>
<style lang="less">
@import "../../assets/less/component/wf-executor.less";
</style>
<style lang="less" scoped>
.pso-wf-logs {
  font-size: 12px;
  & + .pso-wf-logs {
    margin-top: 5px;
  }
  .pso-wf-logs__item {
    font-size: 12px;
    margin-bottom: 5px;
    > div {
      margin-bottom: 2px;
      font-size: 12px;
    }
  }
}
</style>

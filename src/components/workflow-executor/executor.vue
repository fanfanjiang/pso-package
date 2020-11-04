<template>
  <div class="pso-wf-executor" :class="executorClass" v-loading="store.loading || store.steping">
    <transition name="el-zoom-in-top">
      <div class="pso-wf-executor__body" v-show="store.showBody">
        <div class="pso-wf-executor__main">
          <div class="pso-wf-executor__main-scroll">
            <div class="pso-wf-executor__main-header">
              <pso-wf-overview :store="store"></pso-wf-overview>
            </div>
            <div class="pso-wf-executor__main-content-wrapper" ref="executorPrint">
              <slot name="content" :store="store"></slot>
              <div ref="wfTable" class="pso-wf-executor__main-content" v-html="store.cfg.wf_body_tp"></div>
              <div class="pso-wf-executor__stamp" v-if="!store.loading" v-html="stamp.stamp" :style="stampStyle"></div>
              <div v-show="store.log.length" class="pso-wf-executor__main-content-log" field="wf_logs"></div>
            </div>
          </div>
          <transition name="el-zoom-in-bottom">
            <pso-wfop-user v-if="store.showUserOp" :store="store" @close="store.showUserOp = false" @confirm="append"></pso-wfop-user>
          </transition>
        </div>
        <div class="pso-wf-executor__footer">
          <pso-wfop :store="store" @print="doPrint"></pso-wfop>
        </div>
      </div>
    </transition>
    <div class="pso-wf-executor__extend">
      <div class="pso-wf-executor__switch" @click="store.showExtend = !store.showExtend">
        <i :class="switchClass"></i>
      </div>
      <div class="pso-wf-executor__extend-header">
        <el-tabs v-model="store.activeExtendTab">
          <template v-if="store.showBody">
            <el-tab-pane label="数据" name="data"></el-tab-pane>
            <el-tab-pane label="附件" name="attach"></el-tab-pane>
            <el-tab-pane label="流程图" name="flowchart"></el-tab-pane>
            <template v-if="store.data.instanceId">
              <el-tab-pane label="讨论" name="chat"></el-tab-pane>
              <el-tab-pane label="日志" name="log"></el-tab-pane>
            </template>
          </template>
        </el-tabs>
      </div>
      <div class="pso-wf-executor__extend-body">
        <div class="pso-wf-executor__content" v-show="store.activeExtendTab === 'data'">
          <pso-wf-mainform :store="store" v-if="!store.configing"></pso-wf-mainform>
          <pso-wf-form :store="store"></pso-wf-form>
          <slot name="data" :store="store"></slot>
        </div>
        <pso-wf-attach v-if="!store.configing" :store="store" v-show="store.activeExtendTab === 'attach'"></pso-wf-attach>
        <pso-wf-chart :store="store" v-show="store.activeExtendTab === 'flowchart'"></pso-wf-chart>
        <template v-if="store.data.instanceId">
          <pso-wf-log :store="store" v-show="store.activeExtendTab === 'log'"></pso-wf-log>
          <pso-chat
            v-show="store.activeExtendTab === 'chat'"
            :related-id="store.data.instanceId"
            :extend="{ com_type: '0', com_code: store.cfg.wf_code }"
          ></pso-chat>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import shortid from "shortid";

import { REVIEW_OP_TYPE, REVIEW_STATUS } from "../../const/workflow";

import PsoWfMainform from "./form-main";
import PsoWfop from "./op";
import PsoWfopUser from "./op/confirm-user";
import PsoWfOverview from "./overview";
import PsoWfForm from "./form";
import PsoWfAttach from "./attach";
import PsoWfChart from "./flowchart";
import PsoWfLog from "./log";
import PsoChat from "../chat";
import { executor, op } from "./mixin";

export default {
  components: { PsoWfMainform, PsoWfop, PsoWfopUser, PsoWfOverview, PsoWfForm, PsoWfAttach, PsoWfChart, PsoWfLog, PsoChat },
  mixins: [executor, op],
  data() {
    this.REVIEW_OP_TYPE = REVIEW_OP_TYPE;
    return {};
  },
  computed: {
    executorClass() {
      return {
        "pso-wf-executor__m": this.__isMobile__,
        "pso-wf-executor__extend__expend": !this.store.showBody,
        "pso-wf-executor__extend__zoom": !this.store.showExtend,
      };
    },
    stamp() {
      try {
        return _.find(Object.values(REVIEW_STATUS), { value: this.store.data.status });
      } catch (error) {
        return { stamp: "" };
      }
    },
    stampStyle() {
      return {
        color: this.stamp.color,
        "border-color": this.stamp.color,
      };
    },
    switchClass() {
      return {
        "el-icon-d-arrow-right": this.store.showExtend,
        "el-icon-d-arrow-left": !this.store.showExtend,
      };
    },
  },
  async created() {
    this.store.showExtend = !this.__isMobile__;
  },
  mounted() {
    this.$nextTick(() => {
      this.store.executorPrintRef = this.$refs.executorPrint;
    });
  },
  methods: {
    async append() {
      await this.nextStep(this.store.userOp.appendType);
    },
    doPrint() {
      this.print(this.$refs.executorPrint);
    },
  },
};
</script>


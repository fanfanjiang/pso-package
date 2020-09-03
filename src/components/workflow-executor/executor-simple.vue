<template>
  <div
    class="pso-wf-executor pso-wf-executor__simple"
    :class="executorClass"
    v-loading="store.loading||store.steping"
  >
    <transition name="el-zoom-in-top">
      <div class="pso-wf-executor__body">
        <div class="pso-wf-executor__main" v-bar>
          <div>
            <!-- <div class="pso-wf-executor__main-header">
              <pso-wf-overview :store="store"></pso-wf-overview>
            </div>
            <div class="pso-wf-executor__flowchart">
              <pso-wf-chart :store="store" display-small></pso-wf-chart>
            </div>-->
            <div>
              <div class="pso-wf-executor__content">
                <pso-wf-mainform :store="store"></pso-wf-mainform>
                <pso-wf-form :store="store"></pso-wf-form>
              </div>
              <pso-wf-log :store="store"></pso-wf-log>
            </div>
          </div>
          <transition name="el-zoom-in-bottom">
            <pso-wfop-user
              v-if="store.showUserOp"
              :store="store"
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
  </div>
</template>
<script>
import shortid from "shortid";

import { REVIEW_OP_TYPE } from "../../const/workflow";

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
      REVIEW_OP_TYPE: REVIEW_OP_TYPE,
    };
  },
  computed: {
    extendClass() {
      return {
        "pso-wf-executor__extend__expend": !this.store.showBody,
      };
    },
    executorClass() {
      return {
        "pso-wf-executor__m": this.isMobile,
      };
    },
  },
  async created() {},
  methods: {
    async append(op) {
      await this.nextStep(op);
    },
  },
};
</script>


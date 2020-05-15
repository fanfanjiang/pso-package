<template>
  <div class="pso-wf-executor__flowchart">
    <pso-wf-stage
      @clickNode="selectedNode"
      :workflowData="store.cfg.wf_map_tp"
      :readMode="true"
      :display-small="displaySmall"
      v-if="store.cfg.wf_map_tp"
    ></pso-wf-stage>
    <transition name="el-zoom-in-center">
      <el-card class="pso-wf__flowchart-card" v-if="!store.showBody">
        <div slot="header" class="clearfix">
          <span>指定流程节点</span>
          <el-button type="text" @click="store.cancelPickreject(false)">取消</el-button>
        </div>
        <div class="pso-wf__flowchart-card-body">已选择节点：{{store.appointStep&&store.appointStep.name}}</div>
        <div class="pso-wf__flowchart-card-footer" v-if="store.appointStep">
          <el-button type="success" size="mini" @click="pickreject">确定</el-button>
        </div>
      </el-card>
    </transition>
  </div>
</template>
<script>
import PsoWfStage from "../workflow-designer/stage";
import { REVIEW_OP_TYPE } from "../../const/workflow";
import { op } from "./mixin";

export default {
  components: { PsoWfStage },
  mixins: [op],
  props: {
    store: {
      type: Object,
      default: () => ({})
    },
    displaySmall: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectedNode(node) {
      //只有在指定模式下才执行
      if (this.showBody) return;
      if (node.nid === this.store.curStep.nid) return this.$message({ message: "不能选择当前执行节点", type: "warning" });
      if (this.store.appointStep && node.nid === this.store.appointStep.nid) return this.cancelPickreject(true);
      this.store.appointStep = this.store.cfg.wf_map_tp.clickedNode = node;
    },
    async pickreject() {
      await this.nextStep(REVIEW_OP_TYPE.pickreject.type);
      this.store.cancelPickreject();
    }
  }
};
</script>
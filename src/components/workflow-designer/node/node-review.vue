<template>
  <common-node @click-node="$emit('click-node', $event)" :node="node" :pnode="pnode" :readMode="readMode" :workflowImage="workflowImage">
    <div class="wf-node-review" v-if="!wfDesigner.displaySmall">
      <div class="wf-node-review__header">
        <span>{{ node.name }}</span>
        <i class="el-icon-edit-outline"></i>
      </div>
      <div class="wf-node-review__body">
        <div class="wf-node__info" v-if="reviewType">
          <span class="wf-node__info-title">审批类型</span>
          <span class="wf-node__info-detail">{{ reviewType }}</span>
        </div>
        <div class="wf-node__info wf-node__info-opt" v-if="node.opList.length">
          <span class="wf-node__info-title">操作授权</span>
          <span class="wf-node__info-detail">
            <el-tag size="mini" v-for="(item, i) of node.opList" :key="i">{{ getOpName(item) }}</el-tag>
          </span>
        </div>
        <div class="wf-node__info" v-if="node.opaitems.length">
          <span class="wf-node__info-title">审核人</span>
          <span class="wf-node__info-detail">
            <el-tag size="mini" v-for="(item, i) of node.opaitems" :key="i">{{ item.name }}</el-tag>
          </span>
        </div>
        <div class="wf-node__info" v-if="node.copyList && node.copyList.length">
          <span class="wf-node__info-title">抄送</span>
          <span class="wf-node__info-detail">
            <el-tag size="mini" v-for="(item, i) of node.copyList" :key="i">{{ item.name }}</el-tag>
          </span>
        </div>
      </div>
    </div>
    <el-tooltip v-else :open-delay="600" effect="dark" :content="node.name" placement="top-start">
      <div class="wf-node__small wf-node__small__review">{{ smallName }}</div>
    </el-tooltip>
  </common-node>
</template>
<script>
import CommonNode from "../common/node";
import { REVIEW_TYPE, REVIEW_OP_TYPE, REVIEW_AUTH_TYPE } from "../../../const/workflow";
import { mapState } from "vuex";

export default {
  props: ["node", "pnode", "readMode", "workflowImage"],
  components: { CommonNode },
  computed: {
    ...mapState(["wfDesigner"]),
    reviewType() {
      return this.node.atype ? _.find(Object.values(REVIEW_TYPE), { id: this.node.atype }).name : "";
    },
    opType() {
      return this.node.opList.map((item) => _.find(Object.values(REVIEW_OP_TYPE), { value: item }).name).join(",");
    },
    authType() {
      return Object.values(REVIEW_AUTH_TYPE);
    },
    smallName() {
      return this.node.name.slice(0, 5);
    },
  },
  methods: {
    getOpName(value) {
      return _.find(Object.values(REVIEW_OP_TYPE), { value }).name;
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../../assets/less/variable";
@import "../../../assets/less/mixins/gradients.less";
.wf-node-review {
  min-height: 100px;
  .wf-node-review__header {
    height: 40px;
    color: #fff;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    #gradient.horizontal(#0053a9, #409eff);
    i {
      font-size: 18px;
    }
  }
  .wf-node-review__body {
    padding: 10px;
    p {
      margin: 0;
      font-size: 13px;
      color: #666;
    }
    .wf-node__info {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      & + .wf-node__info {
        margin-top: 5px;
      }
      .wf-node__info-title {
        font-size: 12px;
      }
      .wf-node__info-detail {
        flex: 1;
        margin-left: 20px;
        font-size: 12px;
        text-align: right;
        @{deep} .el-tag {
          margin-right: 3px;
          margin-bottom: 3px;
        }
      }
    }
  }
}
</style>
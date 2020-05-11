<template>
  <common-node
    @clickNode="$emit('clickNode',$event)"
    :node="node"
    :pnode="pnode"
    :readMode="readMode"
    :workflowImage="workflowImage"
  >
    <div class="wf-node-review" v-if="!wfDesigner.displaySmall">
      <div class="wf-node-review__header">
        <span>{{node.name}}</span>
        <i class="el-icon-edit-outline"></i>
      </div>
      <div class="wf-node-review__body">
        <div class="wf-node__info">
          <span class="wf-node__info-title">流程名称</span>
          <span class="wf-node__info-detail">{{workflowImage.wfName}}</span>
        </div>
        <div class="wf-node__info" v-if="workflowImage.formName">
          <span class="wf-node__info-title">工作表</span>
          <span class="wf-node__info-detail">{{workflowImage.formName}}</span>
        </div>
      </div>
    </div>
    <div v-else class="wf-node__small">始</div>
  </common-node>
</template>
<script>
import CommonNode from "../common/node";
import { mapState } from "vuex";

export default {
  props: ["node", "pnode", "workflowImage", "readMode"],
  components: { CommonNode },
  computed: {
    ...mapState(["wfDesigner"])
  }
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
    #gradient.horizontal(#e6a23c, #da8300);
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
      }
    }
  }
}
</style>
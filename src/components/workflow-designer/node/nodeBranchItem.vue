<template>
  <div class="pso-wf-container">
    <div v-if="pnode.children[0].nid===node.nid" class="pso-wf-clb"></div>
    <div v-if="pnode.children[pnode.children.length-1].nid===node.nid" class="pso-wf-crb"></div>
    <common-node
      class="pso-wf-branch-item"
      :node="node"
      :pnode="pnode"
      :readMode="readMode"
      :workflowImage="workflowImage"
    >
      <div class="wf-branchitem-node">
        <div class="wf-branchitem-node__body">
          <div class="wf-branchitem-node__empty" v-if="!node.conditionMap.length">所有数据可进入该分支</div>
          <div
            v-slse
            class="wf-branchitem-node__or"
            v-for="(orCondition,orIndex) in node.conditionMap"
            :key="orIndex"
          >
            <el-divider v-if="orIndex!==0" content-position="center">或</el-divider>
            <div
              class="wf-branchitem-node__and"
              v-for="(andCondition,andIndex) in orCondition"
              :key="andIndex"
            >
              <div v-if="andCondition.op">
                <span>{{andCondition.cpnt._fieldName}}</span>
                <span>{{getOpName(andCondition.op)}}</span>
                <span>{{getData(andCondition.data)}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="wf-branchitem-node__footer">
          <el-button type="text" size="small">设置筛选条件</el-button>
        </div>
      </div>
    </common-node>
    <slot></slot>
  </div>
</template>
<script>
import CommonNode from "../common/node";
import { OP_TYPE } from "@/const/op";

export default {
  props: ["node", "pnode", "readMode", "workflowImage"],
  components: { CommonNode },
  methods: {
    getOpName(opid) {
      return OP_TYPE[opid].name;
    },
    getData(data) {
      if (Array.isArray(data)) return data.join(" , ");
      return data;
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/variable";

.pso-wf-branch-item {
  padding-top: 30px;
}
.wf-branchitem-node {
  min-height: 100px;
  display: flex;
  flex-direction: column;
  .wf-branchitem-node__body {
    flex: 1;
    font-size: 12px;
    padding: 5px;
    .wf-branchitem-node__empty {
      padding-top: 10px;
      text-align: center;
    }
    .wf-branchitem-node__or {
    }
    .wf-branchitem-node__and {
      background-color: #faf9f9;
      padding: 4px;
      & + .wf-branchitem-node__and {
        padding-top: 4px;
      }
      > div {
        > span {
          & + span {
            margin-left: 10px;
          }
        }
      }
    }

    @{deep} .el-divider {
      margin: 12px 0;
    }
  }
  .wf-branchitem-node__footer {
    border-top: 1.5px solid @main-color;
    text-align: center;
  }
}
</style>
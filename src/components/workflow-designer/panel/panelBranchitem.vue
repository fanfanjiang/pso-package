<template>
  <div class="wf-panel-branchitem">
    <div
      class="wf-panel-branchitem__or"
      v-for="(orCondition,orIndex) in node.conditionMap"
      :key="getKey(orIndex)"
    >
      <el-divider v-if="orIndex!==0" content-position="center">或</el-divider>
      <div
        class="wf-panel-branchitem__and"
        v-for="(andCondition,andIndex) in orCondition"
        :key="getKey(orIndex,andIndex)"
      >
        <el-divider v-if="andIndex!==0" content-position="left">且</el-divider>
        <div class="wf-panel-branchitem__picker">
          <branch-picker
            :key="getKey(orIndex,andIndex)"
            :pick="andCondition"
            :fieldsOptions="workflowEditor.fieldsOptions"
          ></branch-picker>
          <i
            class="wf-panel-branchitem__del el-icon-delete-solid"
            @click="WF_CONDITION_DEL({node,orIndex,andIndex})"
          ></i>
        </div>
      </div>
      <div class="wf-panel-branchitem__andbtn">
        <el-button
          @click="WF_CONDITION_ADD({node,orIndex})"
          size="mini"
          icon="el-icon-plus"
          type="success"
          plain
        >且</el-button>
      </div>
    </div>
    <div class="wf-panel-branchitem__orbtn">
      <el-button
        @click="WF_CONDITION_ADD({node})"
        size="mini"
        icon="el-icon-plus"
        type="success"
        plain
      >{{node.conditionMap.length?'或':'添加筛选条件'}}</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { WF_CONDITION_ADD, WF_CONDITION_DEL } from "@/store/mutation-types";

import branchPicker from "../common/branchPicker";

export default {
  props: ["node"],
  components: { branchPicker },
  computed: {
    ...mapState(["workflowEditor"])
  },
  methods: {
    ...mapMutations([WF_CONDITION_ADD, WF_CONDITION_DEL]),
    getKey(orindex, andindex = 0) {
      return `${this.node.nid}${orindex}${andindex}`;
    }
  }
};
</script>
<style lang="less" scoped>
.wf-panel-branchitem {
  .wf-panel-branchitem__and {
    margin-top: 10px;
  }
  .wf-panel-branchitem__andbtn {
    margin-top: 10px;
  }
  .wf-panel-branchitem__orbtn {
    margin-top: 10px;
  }
  .wf-panel-branchitem__picker {
    display: flex;
    > div {
      flex: 1;
    }
  }
  .wf-panel-branchitem__del {
    font-size: 20px;
    color: rgb(182, 182, 182);
    margin-left: 5px;
    padding-top: 5px;
    height: 30px;
    cursor: pointer;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: #f56c6c;
      transition: color 0.2s ease-in-out;
    }
  }
}
</style>
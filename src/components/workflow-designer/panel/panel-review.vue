<template>
  <div class="wf-panel-review">
    <el-form :label-position="'top'" label-width="80px" :model="node">
      <el-form-item label="名称">
        <el-input type="text" v-model="node.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="审批类型">
        <el-select v-model="node.atype" placeholder="请选择">
          <el-option v-for="item in reviewType" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作授权">
        <el-select :multiple="true" v-model="node.opList" placeholder="请选择">
          <el-option v-for="item in opType" :key="item.id" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <pso-common-review :node="node" key="review"></pso-common-review>
      <el-form-item label="开启抄送">
        <el-switch v-model="node.copiable" active-text="开启" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>
      <pso-common-review
        v-if="node.copiable==='1'"
        :node="node"
        :type-filter="copyFilter"
        key="copy"
        type-text="抄送类型"
        picker-text="选择抄送对象"
        field="copyType"
        list="copyList"
        reset
      ></pso-common-review>
      <pso-wf-update :node="node"></pso-wf-update>
    </el-form>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { REVIEW_TYPE, REVIEW_OP_TYPE, REVIEW_AUTH_TYPE } from "../../../const/workflow";

import PsoCommonReview from "../../workflow-designer/common/common-review";
import PsoWfUpdate from "../../workflow-designer/common/update";
import PsoWfNotification from "../../workflow-designer/common/notification";

export default {
  components: { PsoCommonReview, PsoWfUpdate, PsoWfNotification },
  props: ["node"],
  computed: {
    ...mapState(["wfDesigner"]),
    reviewType() {
      return Object.values(REVIEW_TYPE);
    },
    opType() {
      return Object.values(REVIEW_OP_TYPE);
    },
  },
  methods: {
    copyFilter(list) {
      return list.filter((d) => [1, 3, 5].includes(d.value));
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../../assets/less/variable";
@{deep} {
  .el-form-item__label {
    line-height: 20px;
    color: #000;
  }
  .el-avatar {
    font-size: 12px;
  }
  .el-select {
    width: 100%;
  }
}
</style>
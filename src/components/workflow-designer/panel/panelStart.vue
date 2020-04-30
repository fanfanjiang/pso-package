<template>
  <div class="wf-panel-review" v-loading="loading">
    <el-form :label-position="'top'" label-width="80px" :model="node">
      <el-form-item label="工作流名称">
        <el-input type="text" v-model="workflowEditor.wfName" clearable></el-input>
      </el-form-item>
      <el-form-item label="选择工作表">
        <el-select v-model="workflowEditor.formId" placeholder="请选择">
          <el-option
            v-for="item in workflowEditor.formsList"
            :key="item.node_id"
            :label="item.node_name"
            :value="item.node_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发文编号">
        <el-select :multiple="true" v-model="workflowEditor.wfFiletype" placeholder="请选择">
          <el-option
            v-for="item in workflowEditor.fileTypes"
            :key="item.wf_filetype"
            :label="item.wf_filetype"
            :value="item.wf_filetype"
          ></el-option>
        </el-select>
      </el-form-item>
      <pso-common-review :node="node"></pso-common-review>
    </el-form>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { WF_FORM_SELECT } from "@/store/mutation-types";

import PsoCommonReview from "@/components/workflowEditor/common/commonReview";

export default {
  components: { PsoCommonReview },
  props: ["node"],
  data() {
    return {
      loading: false,
      fileTypes: []
    };
  },
  computed: {
    ...mapState(["workflowEditor"])
  },
  watch: {
    async "workflowEditor.formId"(id) {
      this.$store.dispatch(WF_FORM_SELECT, { id });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/variable";
@{deep} {
  .el-form-item__label {
    line-height: 20px;
    color: #000;
  }
  .el-select {
    width: 100%;
  }
}
</style>
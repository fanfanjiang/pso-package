<template>
  <div class="wf-panel-review" v-loading="loading">
    <el-form :label-position="'top'" label-width="80px" :model="node" size="mini">
      <el-form-item label="工作流名称">
        <el-input type="text" v-model="wfDesigner.wfName" clearable></el-input>
      </el-form-item>
      <el-form-item label="选择工作表">
        <el-select v-model="wfDesigner.formId" placeholder="请选择" filterable>
          <el-option
            v-for="item in wfDesigner.formsList"
            :key="item.node_name"
            :label="item.node_display"
            :value="item.node_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审批类型">
        <el-select v-model="wfDesigner.wfAuthType" placeholder="请选择">
          <el-option v-for="item in authType" :key="item.v" :label="item.n" :value="item.v"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发文编号">
        <el-select :multiple="true" v-model="wfDesigner.wfFiletype" placeholder="请选择">
          <el-option
            v-for="item in wfDesigner.fileTypes"
            :key="item.wf_filetype"
            :label="item.wf_filetype"
            :value="item.wf_filetype"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="空白人类型">
        <el-select v-model="wfDesigner.emptyType" placeholder="请选择">
          <el-option v-for="t in WF_EMPTY_TYPE" :key="t.v" :label="t.n" :value="t.v"></el-option>
        </el-select>
      </el-form-item>
      <pso-common-review :node="node"></pso-common-review>
    </el-form>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { WF_FORM_SELECT } from "../../../store/mutation-types";
import { WF_AUTH_TYPE, WF_EMPTY_TYPE } from "../../../const/workflow";

import PsoCommonReview from "../common/common-review";

export default {
  components: { PsoCommonReview },
  props: ["node"],
  data() {
    this.WF_EMPTY_TYPE = WF_EMPTY_TYPE;
    return {
      loading: false,
      fileTypes: [],
      authType: WF_AUTH_TYPE,
    };
  },
  computed: {
    ...mapState(["wfDesigner"]),
  },
  watch: {
    async "wfDesigner.formId"(id) {
      this.$store.dispatch(WF_FORM_SELECT, { id });
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
  .el-select {
    width: 100%;
  }
}
</style>
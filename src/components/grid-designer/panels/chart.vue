<template>
  <panel-wrapper :cpnt="cpnt">
    <common-panel :cpnt="cpnt">
      <el-form-item label="图表">
        <el-button size="mini" type="primary" @click="showDesigner = true">设计</el-button>
      </el-form-item>
    </common-panel>
    <pso-dialog :visible="showDesigner" top="0px" width="100%" @close="showDesigner = false">
      <template #title>
        <div class="form-executor-header">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>图表设计</span>
            </div>
          </div>
          <div class="form-executor-header__r">
            <el-button size="mini" type="primary" @click="chartSaveHandler">保存</el-button>
          </div>
        </div>
      </template>
      <pso-chart-designer ref="designer" :params="chartParams"></pso-chart-designer>
    </pso-dialog>
  </panel-wrapper>
</template> 
<script>
import PanelWrapper from "../panel";
import CommonPanel from "../common-panel";

import { CpntMixin } from "../mixin";
export default {
  components: { PanelWrapper, CommonPanel },
  mixins: [CpntMixin],
  data() {
    return {
      showDesigner: false,
    };
  },
  computed: {
    chartParams() {
      return {
        sourceType: "3",
        options: [{ node_name: this.cpnt.urine.child_id, node_display: "子模块" }],
        fields: this.cpnt.urine.child_content,
        config: this.cpnt.data.design,
        dialog: true,
      };
    },
  },
  methods: {
    chartSaveHandler() {
      const data = this.$refs.designer.getChartViewData();
      Object.assign(this.cpnt.data.design, data);
      this.showDesigner = false;
    },
  },
};
</script>
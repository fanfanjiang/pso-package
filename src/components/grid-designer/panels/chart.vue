<template>
  <div class="grid-panel">
    <div class="grid-panel-tabs">
      <button-tabs v-model="curTab" :data="TABS"></button-tabs>
      <el-button type="text" @click="saveCpnt" :loading="cpnt.store.saving">保存模块</el-button>
    </div>
    <div class="grid-panel-body">
      <data-source
        v-if="curTab === 0"
        :source="cpnt.urine.child_data"
        :column="cpnt.urine.child_content"
        :id="cpnt.urine.child_id"
      ></data-source>
      <common-panel v-if="curTab === 1" :cpnt="cpnt">
        <el-form-item label="图表">
          <el-button size="mini" type="primary" @click="showDesigner = true">设计</el-button>
        </el-form-item>
      </common-panel>
    </div>
    <pso-dialog :visible="showDesigner" width="100%" @close="showDesigner = false">
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
  </div>
</template> 
<script>
import DataSource from "../../plugin-module/data-source";
import CommonPanel from "../common-panel";

import { BaseMixin } from "../mixin";
export default {
  components: { DataSource, CommonPanel },
  mixins: [BaseMixin],
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
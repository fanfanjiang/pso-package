<template>
  <div class="pso-chartDesigner" v-loading="chartDesigner.initializing">
    <div class="pso-chartDesigner-header" v-if="!params.dialog">
      <pso-header @back="$emit('back')" title="图表设计">
        <template v-slot:btn>
          <el-button type="primary" size="small" @click="save">保存</el-button>
        </template>
      </pso-header>
    </div>
    <div class="pso-chartDesigner-body" :style="{ 'padding-top': params.dialog ? 0 : '50px' }">
      <div class="pso-chartDesigner-body__left" v-bar>
        <div>
          <div class="pso-cd-vbar">
            <div class="pso-cd-title">
              <h4>
                <span>工作表</span>
                <el-popover v-model="showFilter" placement="bottom-start" width="400" trigger="click">
                  <div class="pso-formTable__filter">
                    <div class="pso-formTable__filter-body">
                      <pso-datafilter
                        v-if="!chartDesigner.initializing"
                        v-model="chartDesigner.filter"
                        :condition="chartDesigner.filter"
                        :auto-trans="false"
                        :fieldsOptions="chartDesigner.conditionOptions"
                      ></pso-datafilter>
                    </div>
                    <div class="pso-formTable__filter-footer">
                      <el-button type="primary" size="mini" @click="goFilter">确定</el-button>
                    </div>
                  </div>
                  <el-button type="text" icon="fa fa-filter" slot="reference">筛选</el-button>
                </el-popover>
              </h4>
              <div style="margin-bottom: 10px">
                <el-select
                  size="small"
                  v-model="chartDesigner.sourceType"
                  placeholder="请选择"
                  filterable
                  @change="chartDesigner.formId = ''"
                >
                  <el-option label="表单" value="1"></el-option>
                  <el-option label="统计" value="2"></el-option>
                  <el-option label="插件子模块" value="3"></el-option>
                </el-select>
              </div>
              <div>
                <el-select size="small" v-model="chartDesigner.formId" @change="formChangeHandler" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in sourceOptions"
                    :key="item.node_name"
                    :label="item.node_display"
                    :value="item.node_name"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <pso-cd-source></pso-cd-source>
          </div>
        </div>
      </div>
      <div class="pso-chartDesigner-body__center" v-bar>
        <div>
          <div class="pso-cd-vbar">
            <pso-cd-dimension></pso-cd-dimension>
            <pso-cd-figure></pso-cd-figure>
            <div class="pso-cd-chart">
              <pso-chart-interpreter ref="chartV" v-show="chartDesigner.formId"></pso-chart-interpreter>
            </div>
          </div>
        </div>
      </div>
      <div class="pso-chartDesigner-body__right" v-bar>
        <div>
          <pso-cd-panel :selected="selectedChart" @select="setChartType"></pso-cd-panel>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { CD_SOURCE_GET, CD_INIT, CD_DIMENSION_SET } from "../../store/mutation-types";
import { CHART } from "../../const/chart";

import PsoHeader from "../header";
import PsoCdSource from "./source";
import PsoCdDimension from "./dimension";
import PsoCdFigure from "./figure";
import PsoDatafilter from "../data-filter/index";
import PsoCdPanel from "./panel";

const SVGInjector = require("svg-injector");

export default {
  components: { PsoHeader, PsoCdSource, PsoCdDimension, PsoCdFigure, PsoDatafilter, PsoCdPanel },
  props: ["params"],
  data() {
    this.CHARTTYPE = _.cloneDeep(Object.values(CHART));
    return {
      selectedChart: {},
      formOptions: [],
      sqlOptions: [],
      showFilter: false,
      watchRegistered: false,
    };
  },
  computed: {
    ...mapState(["chartDesigner"]),
    sourceOptions() {
      const sourceType = this.chartDesigner.sourceType;
      if (sourceType === "1") {
        return this.formOptions;
      } else if (sourceType === "2") {
        return this.sqlOptions;
      } else {
        return this.params.options;
      }
    },
    moduleMode() {
      return this.params.module;
    },
  },
  async created() {
    this.chartDesigner.initializing = true;
    this.chartDesigner.sourceType = this.params.sourceType;
    await this.getFormList();
    await this.loadChartCfg();
    this.selectedChart = this.CHARTTYPE[0];
    this.chartDesigner.initializing = false;
  },
  mounted() {
    SVGInjector(document.querySelectorAll(".pso-svg"));
  },
  methods: {
    setChartType(cType) {
      this.selectedChart = cType;
      this.loadChart();
    },
    async getFormList() {
      this.formOptions = await this.API.getFormTree();
      this.sqlOptions = await this.API.getTempleteTree([1]);
    },
    loadChart() {
      if (this.selectedChart.disabled) return;
      this.$refs.chartV.reLoadChart(this.getChartViewData());
      this.watchRegister();
    },
    formChangeHandler() {
      this.$store.dispatch(CD_SOURCE_GET, { reset: true, options: this.params.fields });
      this.loadChart();
    },
    watchRegister() {
      if (this.watchRegistered) return;
      this.$watch("chartDesigner.dimension", {
        deep: true,
        handler() {
          this.loadChart();
        },
      });
      this.$watch("chartDesigner.figure", {
        deep: true,
        handler() {
          this.loadChart();
        },
      });
      this.$watch("chartDesigner.dataLimit", {
        deep: true,
        handler() {
          this.loadChart();
        },
      });
      this.watchRegistered = true;
    },
    async loadChartCfg() {
      if (this.params.tpCode || this.params.config) {
        let chartCfg;

        if (this.params.tpCode) {
          let ret = await this.API.templates({ data: { tp_type: this.params.tpType || 3, tp_code: this.params.tpCode } });
          chartCfg = JSON.parse(ret.data.tp.data_list);
          chartCfg.chartName = ret.data.tp.tp_name;
        } else {
          chartCfg = this.params.config;
        }

        this.$store.commit(CD_INIT, {
          formId: chartCfg.formId,
          sourceType: chartCfg.sourceType,
          figure: chartCfg.metrics,
          dimension: chartCfg.dimension,
          chartRemark: chartCfg.chartRemark,
          chartName: chartCfg.chartName,
          dataLimit: chartCfg.dataLimit,
          filter: chartCfg.filter,
          condition: chartCfg.condition || [],
        });

        await this.$store.dispatch(CD_SOURCE_GET, { options: this.params.fields });

        if (chartCfg.chartType) {
          let chartTypeModel = _.find(this.CHARTTYPE, { id: chartCfg.chartType });
          chartTypeModel && this.setChartType(chartTypeModel);
        }
      } else {
        this.$store.commit(CD_INIT);
      }
    },
    goFilter() {
      this.loadChart();
      this.showFilter = false;
    },
    getChartViewData() {
      return {
        formId: this.chartDesigner.formId,
        sourceType: this.chartDesigner.sourceType,
        dimension: this.chartDesigner.dimension,
        metrics: this.chartDesigner.figure,
        chartName: this.chartDesigner.chartName,
        chartType: this.selectedChart.id,
        chartRemark: this.chartDesigner.chartRemark,
        dataLimit: this.chartDesigner.dataLimit,
        filter: this.chartDesigner.filter,
        condition: this.chartDesigner.condition,
      };
    },
    async save() {
      this.chartDesigner.initializing = true;
      const data = this.getChartViewData();
      if (this.params.tpCode) {
        let ret = await this.API.templates({
          data: {
            tp_code: this.params.tpCode,
            tp_type: this.params.tpType || 3,
            tp_status: 1,
            tp_name: this.chartDesigner.chartName,
            tp_data: "1",
            data_list: JSON.stringify(data),
          },
          method: "put",
        });
        if (ret.success) {
          this.$notify({ title: "成功", message: "成功保存", type: "success" });
          this.$emit("save");
        }
      } else {
        this.$emit("save", data);
      }
      this.chartDesigner.initializing = false;
    },
  },
};
</script>
<style lang="less">
@import "../../assets/less/component/chart-designer.less";
.pso-formTable__filter {
  position: relative;
  .pso-formTable__filter-body {
    max-height: 500px;
    overflow: scroll;
    padding-bottom: 30px;
  }
  .pso-formTable__filter-footer {
    position: absolute;
    text-align: right;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
  }
}
</style>
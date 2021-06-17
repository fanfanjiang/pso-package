<template>
  <div class="pso-cd-vbar">
    <el-divider content-position="left">图表名称</el-divider>
    <el-input v-model="chartDesigner.chartName"></el-input>
    <el-divider content-position="left">图表备注</el-divider>
    <el-input type="textarea" :rows="2" v-model="chartDesigner.chartRemark"></el-input>
    <div class="pso-cd-choose-wrapper">
      <el-divider content-position="left">图表类型</el-divider>
      <ul class="pso-cd-choose">
        <li
          :key="i"
          v-for="(t, i) in CHARTTYPE"
          @click="setChartType(t)"
          :class="{ choose: selected.id === t.id, disabled: isChartDisable(t) }"
        >
          <el-tooltip :open-delay="500" effect="dark" placement="top">
            <div slot="content" v-html="t.info"></div>
            <div>
              <img class="pso-svg" :src="getChartIcon(t)" />
            </div>
          </el-tooltip>
        </li>
      </ul>
    </div>
    <div class="pso-cd-datalimit">
      <el-divider content-position="left">显示条目</el-divider>
      <div class="pso-cd-datalimit__body">
        <el-checkbox v-model="chartDesigner.dataLimit.checked"></el-checkbox>
        <el-select size="small" v-model="chartDesigner.dataLimit.direction">
          <el-option label="前" value="前"></el-option>
          <el-option label="后" value="后"></el-option>
        </el-select>
        <el-input-number size="small" v-model="chartDesigner.dataLimit.count"></el-input-number>
        <el-select size="small" v-model="chartDesigner.dataLimit.unit">
          <el-option label="条" value="条"></el-option>
          <el-option label="%" value="%"></el-option>
        </el-select>
      </div>
    </div>
    <el-divider content-position="left">图内筛选器</el-divider>
    <div>
      <pso-datafilter
        v-if="!chartDesigner.initializing"
        v-model="chartDesigner.condition"
        :condition="chartDesigner.condition"
        :fieldsOptions="chartDesigner.conditionOptions"
        :auto-trans="false"
        onlyand
      ></pso-datafilter>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { CHART } from "../../const/chart";
import PsoDatafilter from "../data-filter/index";

export default {
  components: { PsoDatafilter },
  props: {
    selected: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    this.CHARTTYPE = _.cloneDeep(Object.values(CHART));
    return {};
  },
  computed: {
    ...mapState(["chartDesigner"]),
  },
  methods: {
    isChartDisable(cType) {
      cType.disabled = this.chartDesigner.dimension.length > cType.dimensionLimit || this.chartDesigner.figure.length > cType.metricsLimit;
      return cType.disabled;
    },
    getChartIcon(cType) {
      return `/static/app/img/chart/${cType.id}.svg`;
    },
    setChartType(cType) {
      this.$emit("select", cType);
    },
  },
};
</script>
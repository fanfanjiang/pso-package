<template>
  <div class="pso-chart" ref="chart">
    <div class="pso-chart-wrapper" v-loading="!loaded">
      <div class="pso-chart-name">{{chartCfg.chartName}}</div>
      <component
        v-if="loaded"
        v-bind:is="currentChart"
        :cfg="formCfg"
        :settings="chartSettings"
        :chart-config="chartCfg"
        :data="chartData"
        :height="chartHeight"
        :extend="extend"
        :colors="colors"
      ></component>
    </div>
  </div>
</template>
<script>
import VeTable from "./table";
import VeCard from "./card";
import { CHART, FIGER_OP, DIMEN_OP, SORT_VAL } from "../../const/chart";
import dayjs from "dayjs";
import { transCMapToCondition } from "../../tool/form";
import shortid from "shortid";
import FormStore from "../form-designer/model/store.js";
import debounce from "throttle-debounce/debounce";

export default {
  components: { VeTable, VeCard },
  props: ["chartId"],
  data() {
    return {
      loaded: false,
      chartData: {
        columns: [],
        rows: []
      },
      formCfg: {
        data_config: []
      },
      chartCfg: {
        formId: "",
        chartType: "table",
        dimension: [],
        metrics: [],
        chartName: "",
        chartRemark: "",
        dataLimit: {},
        filter: []
      },
      group: {},
      fields: [],
      chartHeight: "400px",
      conflict: [],
      colors: ["#065279", "#ffc773", "#426666", "#493131", "#f47983"]
    };
  },
  computed: {
    CHARTMODEL() {
      return CHART[this.chartCfg.chartType];
    },
    currentChart() {
      return `ve-${this.chartCfg.chartType}`;
    },
    extend() {
      if (this.CHARTMODEL.extend) {
        return _.cloneDeep(this.CHARTMODEL.extend);
      } else {
        return {};
      }
    },
    chartSettings() {
      const setting = { labelMap: {} };

      //设置维度
      if (this.chartCfg.dimension && this.chartCfg.dimension.length) {
        const dimension = this.chartCfg.dimension.map(m => m._fieldValue);
        if (this.CHARTMODEL.dimensionType === "string") {
          setting.dimension = dimension.join(",");
        } else {
          setting.dimension = dimension;
        }
      }

      //设置指标
      if (this.chartCfg.metrics && this.chartCfg.metrics.length) {
        const metrics = this.chartCfg.metrics.map(m => m._fieldValue);
        if (this.CHARTMODEL.metricsType === "string") {
          setting.metrics = metrics.join(",");
        } else {
          setting.metrics = metrics;
        }
      }

      //设置别名
      this.formCfg.data_config.forEach(fieldItem => {
        setting.labelMap[fieldItem._fieldValue] = this.getSlias(fieldItem._fieldValue) || fieldItem._fieldName;
      });

      //根据冲突设置别名
      this.conflict.forEach(fieldItem => {
        setting.labelMap[fieldItem._fieldValue] = this.getSlias(fieldItem._fieldValue) || fieldItem._fieldName;
      });

      if (this.CHARTMODEL.setting) {
        Object.assign(setting, _.cloneDeep(this.CHARTMODEL.setting));
      }

      return setting;
    }
  },
  watch: {
    chartId: {
      immediate: true,
      handler(val) {
        if (typeof val !== "undefined") this.getChartCfg();
      }
    }
  },
  created() {
    this.deGetForm = debounce(500, this.getFormCfg);
  },
  mounted() {
    this.setHeight();
  },
  methods: {
    setHeight() {
      let height = $(this.$refs.chart).height();
      if (height > 30) this.chartHeight = `${height - 30}px`;
    },
    getSlias(_fieldValue) {
      if (this.chartCfg.metrics) {
        const selfAlias = _.find(this.chartCfg.metrics, { _fieldValue });
        if (selfAlias && selfAlias.alias) return selfAlias.alias;
      }
      return "";
    },
    async getChartCfg() {
      this.loaded = false;
      let ret = await this.API.templates({ data: { tp_type: "0", tp_code: this.chartId }, method: "get" });
      this.chartCfg = Object.assign(this.chartCfg, JSON.parse(ret.data.tp.data_list));
      this.deGetForm();
    },
    async reLoadChart(chartCfg) {
      //手动配置图表
      this.chartCfg = _.cloneDeep(Object.assign(this.chartCfg, chartCfg));
      this.deGetForm();
    },
    async getFormCfg() {
      //加载表单配置
      if (!this.chartCfg.dimension || !this.chartCfg.metrics) return;
      this.loaded = false;
      let ret = await this.API.formsCfg({ data: { id: this.chartCfg.formId }, method: "get" });
      if (!ret.success) return;
      const store = new FormStore(ret.data);
      ret.data.data_config = store.search({
        options: { db: true },
        onlyData: true,
        beforePush: item => !item.parent.CPNT.host_db
      });
      this.formCfg = ret.data;
      this.chartData.columns = _.map(this.formCfg.data_config, "_fieldValue");

      await this.loadFormData();
    },
    async loadFormData() {
      //加载表单数据
      this.loaded = false;
      const data = { data_code: this.formCfg.data_code, leaf_auth: 4 };

      if (this.chartCfg.filter.length) {
        data.condition = transCMapToCondition(this.chartCfg.filter);
      }
      const formData = await this.fetchAllData(data);
      this.makeData(formData);
      this.loaded = true;
      this.setHeight();
    },
    async fetchAllData(options) {
      let { limit = 1000, page = 0 } = options;
      let data = [];
      while (1) {
        const ret = await this.API.form({ data: Object.assign(options, { limit, page }), method: "get" });
        if (ret.data && ret.data.length) {
          data = data.concat(ret.data);
          page = page + limit;
        }
        if (ret.total < page || !ret.data.length) break;
      }
      return data;
    },
    clear() {
      this.group = {};
      this.chartData.rows = [];
    },
    makeData(formData) {
      this.clear();

      //维度和数字冲突处理

      if (this.chartCfg.dimension && this.chartCfg.dimension.length && this.chartCfg.metrics && this.chartCfg.metrics.length) {
        this.chartCfg.metrics.forEach(mItem => {
          const sameDimen = _.find(this.chartCfg.dimension, { _fieldValue: mItem._fieldValue });

          if (sameDimen) {
            const newFieldValue = shortid.generate();
            this.conflict.push({ _fieldValue: newFieldValue, copyFieldValue: mItem._fieldValue });
            mItem._fieldValue = newFieldValue;
          }
        });
      }

      //数据预处理
      if (this.chartCfg.dimension && this.chartCfg.dimension.length) {
        formData.forEach(d => {
          //冲突赋值

          this.conflict.forEach(cfItem => {
            d[cfItem._fieldValue] = d[cfItem.copyFieldValue];
            cfItem._fieldName = d._fieldName;
          });

          this.chartCfg.dimension.forEach(dim => {
            if (dim.op) {
              switch (dim.op) {
                case DIMEN_OP.YEAR:
                  d[dim._fieldValue] = dayjs(d[dim._fieldValue]).format("YYYY");
                  break;
                case DIMEN_OP.QUARTER:
                  d[dim._fieldValue] = dayjs(d[dim._fieldValue]).format("YYYY年第Q季度");
                  break;
                case DIMEN_OP.MONTH:
                  d[dim._fieldValue] = dayjs(d[dim._fieldValue]).format("YYYY年MM月");
                  break;
                case DIMEN_OP.DAY:
                  d[dim._fieldValue] = dayjs(d[dim._fieldValue]).format("YYYY年MM月DD");
                  break;
                case DIMEN_OP.WEAK:
                  d[dim._fieldValue] = dayjs(d[dim._fieldValue]).format("gggg年第ww周");
                  break;
              }
            }
          });
        });
      }

      //按维度分组数据
      for (let dItem of this.chartCfg.dimension) {
        this.makeDimension(formData, dItem);
      }

      //生成数据
      if (!_.isEmpty(this.group)) {
        const _self = this;
        (function recursion(data) {
          for (let key of Object.keys(data)) {
            if (Array.isArray(data[key])) {
              _self.setRows(data[key]);
            } else {
              recursion(data[key]);
            }
          }
        })(this.group);
      } else {
        this.setRows(formData);
      }

      //排序处理
      const sortList = [[], []];
      this.chartCfg.dimension.concat(this.chartCfg.metrics).forEach(item => {
        if (item.chartSort && SORT_VAL[item.chartSort]) {
          sortList[0].push(item._fieldValue);
          sortList[1].push(SORT_VAL[item.chartSort]);
        }
      });
      if (sortList[0].length) {
        this.chartData.rows = _.orderBy(this.chartData.rows, ...sortList);
      }

      //去重
      if (this.chartCfg.dimension && this.chartCfg.dimension.length) {
        this.chartCfg.dimension.forEach(dim => {
          if (dim.uniq) {
            let uList = [];
            const uRet = _.groupBy(this.chartData.rows, dim._fieldValue);
            for (let key in uRet) {
              uList.push(uRet[key][0]);
            }
            this.chartData.rows = uList;
          }
        });
      }

      //截取处理
      const dataLimit = this.chartCfg.dataLimit;
      if (dataLimit.checked && this.chartData.rows.length) {
        let count = dataLimit.count;
        if (dataLimit.unit === "%") {
          count = Math.ceil(this.chartData.rows.length * count * 0.01);
        }
        const isOver = this.chartData.rows.length - count;
        const start = dataLimit.direction === "前" ? 0 : isOver < 0 ? 0 : isOver;
        this.chartData.rows = this.chartData.rows.slice(start, start + count);
      }
    },
    makeDimension(tData, dimenField) {
      //按维度分组
      if (_.isEmpty(this.group)) {
        //第一次
        this.group = _.groupBy(tData, dimenField._fieldValue);
        return;
      }

      (function recursion(data) {
        for (let key of Object.keys(data)) {
          if (Array.isArray(data[key])) {
            data[key] = _.groupBy(data[key], dimenField._fieldValue);
          } else {
            recursion(data[key]);
          }
        }
      })(this.group);
    },
    setRows(ary) {
      let row = ary[0];
      if (row) {
        for (let mItem of this.chartCfg.metrics) {
          switch (mItem.op) {
            case FIGER_OP.SUM:
              row[mItem._fieldValue] = _.sumBy(ary, a => {
                return parseInt(a[mItem._fieldValue]);
              });
              break;
            case FIGER_OP.COUNT:
              let count = ary.length;
              if (mItem.uniq) {
                count = Object.keys(_.groupBy(ary, mItem._fieldValue)).length;
              }
              row[mItem._fieldValue] = count;
              break;
            case FIGER_OP.AVG:
              row[mItem._fieldValue] =
                _.sumBy(ary, a => {
                  return parseInt(a[mItem._fieldValue]);
                }) / ary.length;
              break;
          }
        }
        this.chartData.rows = this.chartData.rows.concat(row);
      }
    }
  }
};
</script>
<style lang="less">
@import "../../assets/less/component/chart.less";
</style>
<template>
  <div class="pso-view" ref="view" :class="viewClass" v-loading="!store || store.initializing">
    <template v-if="store && !store.initializing">
      <div class="pso-view-extend">
        <transition name="el-fade-in">
          <pso-data-filter
            v-show="store.showFilter"
            v-model="store.condition"
            :condition="store.defCondition"
            :fieldsOptions="store.conditionOptions"
            fixedfield
          ></pso-data-filter>
        </transition>
      </div>
      <div class="pso-view-body" ref="viewBody">
        <div ref="header">
          <!-- 标题和权限视图过滤 -->
          <div class="pso-view-header">
            <div class="pso-view-header__l" v-if="!params.hideTitle">
              <div class="pso-view-title">
                <icon></icon>
                <span>{{ pageTitle }}</span>
              </div>
            </div>
            <div class="pso-view-header__r">
              <div class="pso-view-authtab" v-show="store.authViews.length > 1 && !params.hideAuthTab">
                <el-tabs v-model="store.activeView">
                  <el-tab-pane v-for="(ah, i) in store.authViews" :key="i" :label="ah.n" :name="ah.v + ''"></el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
          <!-- 视图切换 -->
          <div class="pso-view-viewtab" v-if="!params.hideStatusTab">
            <fast-switch :store="store" key="statuses" switch="statuses" model="curStatus" skey="d_status"></fast-switch>
          </div>
          <div class="pso-view-fun">
            <div class="pso-view-fun-l">
              <table-fun :store="store" :files="params.downloadFiles"></table-fun>
            </div>
            <div class="pso-view-fun-r">
              <data-fun
                :store="store"
                :addable="false"
                :selectable="false"
                :changable="false"
                :stageable="false"
                :copyable="false"
                :moreable="false"
              >
                <template v-slot:op="scope">
                  <slot name="op" v-bind:data="scope.store"></slot>
                </template>
              </data-fun>
            </div>
          </div>
        </div>
        <!-- 表格 -->
        <div class="pso-view-table" v-loading="store.starting">
          <div class="pso-view-table__body" ref="script">
            <script-item v-if="!empty" :data="group"></script-item>
            <pso-empty v-else></pso-empty>
          </div>
          <div class="export" v-if="!empty">
            <el-button type="primary" size="mini" icon="el-icon-download" @click="exportPdf">导出PDF</el-button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { StaMixin } from "./mixin";
import ScriptItem from "./script-item";
export default {
  mixins: [StaMixin],
  components: { ScriptItem },
  data() {
    return {
      group: {},
    };
  },
  computed: {
    empty() {
      return _.isEmpty(this.group);
    },
  },
  created() {
    this.$on("data-loaded", () => {
      this.analyzeData();
    });
  },
  methods: {
    analyzeData() {
      const script = this.params.script;
      const dimension = this.params.dimension;

      if (script) {
        this.store.instances.forEach((d) => {
          let formula = script;
          for (let key in d) {
            formula = formula.replace(new RegExp(`@${key}@`, "g"), d[key]);
          }
          d.__formatVal__ = eval(formula);
        });
      }

      if (dimension) {
        for (let dim of dimension) {
          this.makeDimension(this.store.instances, dim);
        }
      }
    },
    makeDimension(tData, field) {
      //按维度分组
      if (_.isEmpty(this.group)) {
        //第一次
        this.group = _.groupBy(tData, field);
        return;
      }

      (function recursion(data) {
        for (let key of Object.keys(data)) {
          if (Array.isArray(data[key])) {
            data[key] = _.groupBy(data[key], field);
          } else {
            recursion(data[key]);
          }
        }
      })(this.group);
    },
    exportPdf() {
      this.createPDF(this.$refs.script, "周报");
    },
  },
};
</script>
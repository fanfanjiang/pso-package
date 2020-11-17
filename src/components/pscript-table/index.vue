<template>
  <div class="pso-view" ref="view" :class="viewClass" v-loading="initializing">
    <template v-if="!initializing">
      <div class="pso-view-extend">
        <transition name="el-fade-in">
          <pso-data-filter
            v-show="showFilter"
            v-model="condition"
            :condition="defCondition"
            :fieldsOptions="conditionOptions"
            fixedfield
            fixed
          ></pso-data-filter>
        </transition>
      </div>
      <div class="pso-view-body" ref="viewBody">
        <div ref="header">
          <div class="pso-view-fun" style="margin-bottom: 10px">
            <div class="pso-view-fun-l"></div>
            <div class="pso-view-fun-r">
              <el-button type="primary" size="mini" @click="confirmHandler">选择</el-button>
            </div>
          </div>
        </div>
        <!-- 表格 -->
        <div class="pso-view-table">
          <div class="pso-view-table__body" ref="tableRef">
            <el-table ref="table" style="width: 100%" border v-loading="fetching" v-bind="tableParams" @selection-change="changeHandler">
              <template #default>
                <el-table-column type="selection" width="40" header-align="center" align="center"></el-table-column>
                <el-table-column type="index" label="序号" :index="1" width="50" header-align="center" align="center"></el-table-column>
                <el-table-column
                  class-name="modifier-placeholder-wrapper"
                  min-width="120"
                  header-align="center"
                  show-overflow-tooltip
                  resizable
                  v-for="(f, i) of fields"
                  :key="i"
                  :prop="f.field"
                  :label="f.name"
                  :width="f.width"
                  :align="f.align"
                >
                </el-table-column>
              </template>
              <template #empty>
                <pso-empty></pso-empty>
              </template>
            </el-table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { genComponentData } from "../form-designer/helper";
const { FILTER_TYPE } = require("../../../share/const/filter");

export default {
  props: {
    data: {
      type: Array,
    },
    fieldsOptions: {
      type: Array,
    },
    selectionType: {
      type: String,
      default: "radio",
    },
  },
  data() {
    return {
      initializing: false,
      fetching: false,
      showFilter: false,
      selectedList: [],
      fields: [],
      conditionOptions: [],
      defCondition: [],
      condition: "",
      tableHeight: 500,
    };
  },
  computed: {
    tableParams() {
      const params = {
        data: this.data,
        size: "small",
      };
      if (this.tableHeight > 100) {
        params.height = this.tableHeight;
      }
      return params;
    },
    viewClass() {
      return {
        "pso-view__expand": this.showFilter,
      };
    },
  },
  watch: {
    condition(val) {
      this.$emit("search", val);
    },
  },
  created() {
    this.initialize();
  },
  mounted() {
    const height = $(this.$refs.view).height() - $(this.$refs.header).height();
    if (height > 100) {
      this.tableHeight = height;
    }
    this.$nextTick(() => this.$refs.table.doLayout());
  },
  methods: {
    initialize() {
      this.fields = _.cloneDeep(this.fieldsOptions);
      const conditionItems = [];
      this.fields.forEach((f) => {
        this.$set(f, "display", f.name);
        if (f.searchable === "1" && f.formulable !== "1") {
          let data = "";
          const fType = FILTER_TYPE[f.searchType];
          const sItem = { componentid: fType.cid, fid: f.field, _fieldValue: f.field, _fieldName: f.name, displayName: f.name, _val: "" };
          if (f.defaultVal) {
            data = f.defaultVal;
          }
          if (f.searchList && f.searchList.length) {
            data = [];
            sItem._option = f.searchList.map((i) => {
              if (i.d) {
                data.push(i.v);
              }
              return { _optionName: i.n, _optionValue: i.v };
            });
          }
          this.conditionOptions.push(genComponentData(sItem));
          conditionItems.push({ cpnt: sItem, field: sItem.fid, op: f.searchOp, data, match: "" });
        }
      });
      if (conditionItems.length) {
        this.defCondition.push(conditionItems);
        this.showFilter = true;
      }
    },
    confirmHandler() {
      this.$emit("selection-confirm", this.selectedList);
    },
    changeHandler(val) {
      if (this.selectionType === "radio" && val.length > 1) {
        this.$refs.table.clearSelection();
        this.$refs.table.toggleRowSelection(val[val.length - 1], true);
        val = [val[val.length - 1]];
      }
      this.selectedList = val;
    },
  },
};
</script>
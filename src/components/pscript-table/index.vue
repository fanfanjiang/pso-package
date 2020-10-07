<template>
  <div class="pso-statistics" style="padding: 10px">
    <div class="pso-table-wrapper">
      <div class="pso-table-header">
        <div class="pso-table-header__l">
          <el-popover v-model="showFilter" placement="bottom-start" width="400" trigger="click" v-if="conditionOptions.length">
            <div class="pso-formTable__filter">
              <div class="pso-formTable__filter-body">
                <pso-data-filter v-model="condition" :fieldsOptions="conditionOptions"></pso-data-filter>
              </div>
              <div class="pso-formTable__filter-footer">
                <el-button type="primary" size="mini" @click="goFilter">确定</el-button>
              </div>
            </div>
            <el-button type="text" icon="fa fa-filter" slot="reference">筛选</el-button>
          </el-popover>
          <el-divider direction="vertical"></el-divider>
          <el-popover placement="bottom-start" width="300" trigger="click">
            <div class="pso-switch-panel">
              <div class="pso-switch-panel__item" v-for="f of fields" :key="f.name">
                <el-switch size="mini" v-model="f.show" :inactive-text="f.name" active-value="1" inactive-value="0"></el-switch>
              </div>
            </div>
            <el-button type="text" icon="el-icon-setting" slot="reference">列表</el-button>
          </el-popover>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" icon="el-icon-refresh" @click="fetch">刷新</el-button>
        </div>
        <div class="pso-table-header__r">
          <el-button type="primary" size="mini" @click="selectConfirmHandler">确定</el-button>
        </div>
      </div>
      <el-table
        ref="table"
        v-loading="loading"
        border
        :data="data"
        :height="400"
        size="small"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <template #default>
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column type="index" label="序号" :index="1" width="50"></el-table-column>
          <el-table-column
            resizable
            show-overflow-tooltip
            v-for="f of fieldsShow"
            :key="f.field"
            :prop="f.field"
            :label="f.name"
            :width="f.width"
            :align="f.align"
          >
            <template slot-scope="scope">{{ scope.row[f.field] }}</template>
          </el-table-column>
        </template>
        <template #empty>
          <pso-empty></pso-empty>
        </template>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Array,
    },
    fields: {
      type: Array,
    },
    conditionOptions: {
      type: Array,
      default: () => [],
    },
    selectionType: {
      type: String,
      default: "radio",
    },
  },
  data() {
    return {
      loading: false,
      condition: "",
      showFilter: false,
      selectedList: [],
    };
  },
  computed: {
    fieldsShow() {
      return this.fields.filter((item) => item.show === "1");
    },
  },
  methods: {
    async fetch() {
      this.loading = true;
      this.$emit("fetch", this.condition);
      this.loading = false;
    },
    async goFilter() {
      this.showFilter = false;
      await this.fetch();
    },
    selectConfirmHandler() {
      this.$emit("selection-confirm", this.selectedList);
    },
    handleSelectionChange(val) {
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

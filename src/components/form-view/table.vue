<template>
  <div class="pso-view-table__body" ref="tableRef">
    <el-table
      ref="table"
      style="width: 100%"
      border
      v-loading="store.fetching"
      :size="params.tableSize"
      :data="store.instances"
      :show-summary="!!store.summary"
      :summary-method="store.getSummary.bind(store)"
      :cell-class-name="store.analyzeRowClass.bind(store)"
      :row-style="store.analyzeRowStyle.bind(store)"
      :cell-style="store.analyzeCellStyle.bind(store)"
      :max-height="params.tableMaxHeight"
      @row-dblclick="rowdbClickHandler"
      @row-click="rowClickHandler"
      @selection-change="changeHandler"
      @sort-change="sortHandler"
      @header-dragend="dragHandler"
    >
      <template #default>
        <el-table-column v-if="params.checkbox" type="selection" width="40" header-align="center" align="center"></el-table-column>
        <el-table-column type="index" label="序号" :index="1" width="50" header-align="center" align="center"></el-table-column>
        <el-table-column
          class-name="modifier-placeholder-wrapper"
          min-width="120"
          header-align="center"
          show-overflow-tooltip
          resizable
          v-for="(f, i) of fields"
          :key="i"
          :prop="f.field_name"
          :label="f.display"
          :width="f.width"
          :align="f.align"
          :sortable="f.sortable === '1' ? 'custom' : false"
        >
          <template slot-scope="scope">
            <div class="modifier-placeholder" :ref="scope.$index + f.field_name">
              <span v-if="store.checkFlag(f.field_name)" class="modifier-flag" v-html="store.formatListVal(scope.row, f)"></span>
              <span v-else-if="store.checkFile(f.field_name)" class="modifier-file">
                <pso-attachment :ids="scope.row[f.field_name]"></pso-attachment>
              </span>
              <span v-else class="modifier-value" :style="{ 'text-align': f.align }">{{ store.formatListVal(scope.row, f) }}</span>
              <span
                v-if="params.modifiable && f.editable"
                class="el-icon-edit modifier-trigger"
                @click.stop="openModifier(scope.row, f, scope.$index)"
              ></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="params.operate" label="操作" :width="params.operateWidth" fixed="right" align="center" header-align="center">
          <template slot-scope="scope">
            <slot name="column" v-bind:data="{ row: scope.row }"></slot>
          </template>
        </el-table-column>
      </template>
      <template #empty>
        <pso-empty></pso-empty>
      </template>
    </el-table>
    <div class="pso-view-table__footer">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[baseLimit, 20, 50, 100, 200, 500]"
        :total="store.dataTotal"
        :page-size="store.limit"
        :current-page="store.page"
        @size-change="sizeChangeHandler"
        @current-change="currentChangeHandler"
        @prev-click="prevClickHandler"
        @next-click="nextClickHandler"
      ></el-pagination>
    </div>
    <transition name="el-fade-in-linear">
      <div class="modifier" :style="modifierStyle" v-if="showModifier">
        <pso-form-interpreter
          ref="modifier"
          :form-entity="modCfg"
          :data-instance="modInstance"
          @data-loaded="modLoadHandler"
        ></pso-form-interpreter>
      </div>
    </transition>
  </div>
</template>
<script>
import PsoAttachment from "../attachment";
import { FormModifierMixin } from "../../mixin/list";
export default {
  components: { PsoAttachment },
  mixins: [FormModifierMixin],
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
    store: Object,
  },
  data() {
    this.baseLimit = 10;
    return {};
  },
  computed: {
    fields() {
      return this.store.fields.filter(
        (f) => f.show === "1" && (this.params.columnFilter ? this.params.columnFilter.indexOf(f.field_name) === -1 : true)
      );
    },
  },
  watch: {
    "store.showFilter"() {
      this.$refs.table.doLayout();
    },
  },
  created() {
    if (this.params.modifiable) {
      this.initializeModifier(this.store.formCfg, this.store.store, (data) => {
        // 修改回调函数
        this.store.addOrUpdate(data);
      });
    }
  },
  mounted() {
    this.store.$table = this.$refs.tableRef;
  },
  methods: {
    rowdbClickHandler(row) {
      this.store.showInstance(row);
    },
    rowClickHandler(row) {
      this.params.tableRowClick && this.params.tableRowClick(row);
    },
    sortHandler(data) {
      this.store.makeSort(data);
    },
    changeHandler(data) {
      if (this.params.selectionType === "radio" && data.length > 1) {
        this.$refs.table.clearSelection();
        this.$refs.table.toggleRowSelection(data[data.length - 1], true);
        data = [data[data.length - 1]];
      }
      this.store.changeSelectedList(data);
    },
    dragHandler() {
      this.store.dragHandler(...arguments);
    },
    sizeChangeHandler(size) {
      this.store.limit = size;
    },
    currentChangeHandler(page) {
      this.store.page = page;
    },
    prevClickHandler() {
      this.store.page -= 1;
    },
    nextClickHandler() {
      this.store.page += 1;
    },
  },
};
</script>
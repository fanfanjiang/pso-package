<template>
  <div class="pso-view-table__body" ref="tableRef">
    <el-table
      ref="table"
      style="width: 100%"
      border
      v-loading="store.fetching"
      v-bind="tableParams"
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
              <span v-if="store.checkFlag(f.field_name, scope.row)" class="modifier-flag" v-html="store.formatListVal(scope.row, f)"></span>
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
    <div class="pso-view-table__footer" v-if="pagination">
      <el-pagination
        :background="!forceclick"
        :small="forceclick"
        :layout="paginationLayout"
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
    dragable: {
      type: Boolean,
      default: true,
    },
    pagination: {
      type: Boolean,
      default: true,
    },
    refresh: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    this.baseLimit = 10;
    this.timer = null;
    return {
      clickCount: 0,
    };
  },
  computed: {
    fields() {
      return this.store.fields.filter(
        (f) =>
          f.using === "1" && f.show === "1" && (this.params.columnFilter ? this.params.columnFilter.indexOf(f.field_name) === -1 : true)
      );
    },
    forceclick() {
      return this.__isMobile__;
    },
    paginationLayout() {
      return this.forceclick ? "prev, pager, next" : "total, sizes, prev, pager, next, jumper";
    },
    tableParams() {
      const params = {
        data: this.store.instances,
        showSummary: !!this.store.summary,
        summaryMethod: this.store.getSummary.bind(this.store),
        rowStyle: this.store.analyzeRowStyle.bind(this.store),
        cellStyle: this.store.analyzeCellStyle.bind(this.store),
        cellClassName: this.store.analyzeRowClass.bind(this.store),
        size: this.params.tableSize,
        maxHeight: this.params.tableMaxHeight,
      };

      if (this.store.tableHeight) {
        params.height = this.store.tableHeight;
      }

      return params;
    },
  },
  watch: {
    "store.showFilter"() {
      this.$refs.table.doLayout();
    },
  },
  created() {
    if (this.params.modifiable) {
      this.initializeModifier(this.store.formCfg, this.store.store, async (data) => {
        // 修改回调函数
        await this.store.addOrUpdate(data, this.refresh);
      });
    }
  },
  mounted() {
    this.store.$tableWrapper = this.$refs.tableRef;
    this.store.$table = this.$refs.table;
  },
  methods: {
    rowdbClickHandler(row) {
      this.store.showInstance(row);
    },
    rowClickHandler(row) {
      if (this.forceclick) {
        this.clickCount++;
        if (this.clickCount === 1) {
          this.timer = setTimeout(() => {
            if (this.params.tableRowClick) {
              this.setClickedRow(row);
            }
            this.clickCount = 0;
          }, 300);
        } else if (this.clickCount === 2) {
          this.timer && clearTimeout(this.timer);
          this.store.showInstance(row);
          this.clickCount = 0;
        }
      } else if (this.params.tableRowClick) {
        this.setClickedRow(row);
      }
    },
    setClickedRow(row) {
      this.store.clickedRow = row;
      this.params.tableRowClick(row);
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
      if (this.dragable) {
        this.store.dragHandler(...arguments);
      }
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
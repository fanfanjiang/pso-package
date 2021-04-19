<template>
  <div class="pso-view" ref="view" :class="viewClass" v-loading="!store || store.initializing">
    <template v-if="store && !store.initializing">
      <div class="pso-view-extend" v-loading="store.starting">
        <transition name="el-fade-in">
          <pso-data-filter
            v-show="store.showFilter"
            v-model="store.condition"
            :condition="store.defCondition"
            :fieldsOptions="store.conditionOptions"
            fixedfield
            fixed
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
          <!-- 排序标签 -->
          <div class="pso-view-sorttag" v-if="store.operableSotrs.length">
            <template v-for="(sort, i) in store.operableSotrs">
              <el-tag v-if="sort.operable" size="small" :key="i" :closable="sort.operable" @close="store.removeSort(i)">
                {{ sort.name }} {{ sort.order === "desc" ? "降序" : "升序" }}
              </el-tag>
            </template>
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
                :exportable="!params.hideExport"
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
          <div class="pso-view-table__body" ref="tableRef">
            <el-table
              ref="table"
              style="width: 100%"
              border
              v-loading="store.fetching"
              v-bind="tableParams"
              @cell-click="cellClickHandler"
              @selection-change="changeHandler"
              @sort-change="sortHandler"
              @header-dragend="dragHandler"
            >
              <template #default>
                <el-table-column v-if="checkable" type="selection" width="40" header-align="center" align="center"></el-table-column>
                <el-table-column type="index" label="序号" :index="1" width="50" header-align="center" align="center"></el-table-column>
                <template v-if="store.header">
                  <custom-column v-for="(h, i) of store.header" :key="i" :col="h"></custom-column>
                </template>
                <template v-else>
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
                    :sortable="f.sortable === '1' ? 'custom' : false"
                  >
                    <template slot-scope="scope">{{ scope.row[`${f.field}_x`] || scope.row[f.field] }}</template>
                  </el-table-column>
                  <el-table-column v-if="optable" label="操作" :width="optWidth" fixed="right" align="center" header-align="center">
                    <template slot-scope="scope">
                      <action-group :store="store" :data="[scope.row]" :actions="tableActions"></action-group>
                    </template>
                  </el-table-column>
                </template>
              </template>
              <template #empty>
                <pso-empty></pso-empty>
              </template>
            </el-table>
            <div class="pso-view-table__footer">
              <el-pagination
                :background="!forceclick"
                :small="forceclick"
                :layout="paginationLayout"
                :page-sizes="store.pageSize"
                :total="store.dataTotal"
                :page-size="store.limit"
                :current-page="store.page"
                @size-change="sizeChangeHandler"
                @current-change="currentChangeHandler"
                @prev-click="prevClickHandler"
                @next-click="nextClickHandler"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
      <pso-form-executor
        :params="executorParams"
        :title="executorTitle"
        :opener="store"
        :auto-submit="store.autoSubmit"
        :switchable="false"
        :keepable="false"
        @data-changed="dataChangeHandler"
      ></pso-form-executor>
    </template>
  </div>
</template>
<script>
import ActionGroup from "../form-view/action-group";
import { StaMixin } from "./mixin";
export default {
  components: { ActionGroup },
  mixins: [StaMixin],
  data() {
    return {};
  },
  computed: {
    fields() {
      return this.store.fields.filter((f) => f.show === "1");
    },
    forceclick() {
      return this.__isMobile__;
    },
    paginationLayout() {
      return this.params.pageLayout
        ? this.params.pageLayout
        : this.forceclick
        ? "prev, pager, next"
        : "total, sizes, prev, pager, next, jumper";
    },
    viewClass() {
      return {
        "pso-view__expand": this.store && this.store.showFilter,
      };
    },
    tableParams() {
      const params = {
        data: this.store.instances,
        showSummary: !!this.store.summary,
        summaryMethod: this.store.getSummary.bind(this.store),
        rowStyle: this.store.analyzeRowStyle.bind(this.store),
        cellStyle: this.store.analyzeCellStyle.bind(this.store),
        cellClassName: this.store.analyzeRowClass.bind(this.store),
        size: "small",
      };
      if (this.store.tableHeight > 100) {
        params.height = this.store.tableHeight;
      }
      return params;
    },
    checkable() {
      return this.params.checkbox || !!this.store.actionMGR.actions.length;
    },
    actioning() {
      return this.store.actionMGR.actioning;
    },
    executorTitle() {
      return this.actioning ? this.actioning.formStore.data_name : "";
    },
    executorParams() {
      return {
        formId: this.actioning ? this.actioning.formStore.data_code : "",
        dataId: this.store.dataId,
        editable: true,
        deletable: false,
        extendAuth: this.store.actionMGR.fieldsRule,
        befSaveFunc: this.store.actionMGR.checkBefActionScript.bind(this.store.actionMGR),
      };
    },
    tableActions() {
      return this.store.actionMGR.getActions("2");
    },
    optable() {
      return !!this.tableActions.length;
    },
    optWidth() {
      return this.store.figureBtnWidth({ btns: this.tableActions });
    },
  },
  watch: {
    "store.initializing"(val) {
      if (!val) {
        this.$nextTick(() => {
          this.store.$tableWrapper = this.$refs.tableRef;
          this.store.$table = this.$refs.table;
        });
      }
    },
    "store.starting"(val) {
      if (this.store && !this.store.initializing && !val && this.$refs.header) {
        const height = $(this.$refs.view).height() - $(this.$refs.header).height() - 65;
        if (height > 100) {
          this.store.tableHeight = height;
        }
      }
    },
  },
  methods: {
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
      this.store.dragHandler(...arguments, "field");
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
    cellClickHandler(row, { property }, cell, event) {
      const field = _.find(this.store.fields, { field: property });

      if (field && field.drillTarget) {
        const menu = _.find(this.store.menus, { menu_link: field.drillTarget });
        const params = [];
        if (field.drillParams) {
          for (let f of field.drillParams) {
            params.push({ s: f.s, t: f.t, v: row[f.s], n: row[property] });
          }
        }
        this.$router.push({
          path: `${menu.tp_route.replace(/:menu_code/g, menu.menu_code)}`,
          query: {
            keys: JSON.stringify(params),
            __source__: this.store.staCfg.tp_code,
          },
        });
      }
    },
    async dataChangeHandler(data) {
      await this.store.checkDataChange(data);
      await this.store.fetchStatus();
      this.$emit("data-changed", data);
    },
  },
};
</script>
<template>
  <div class="pso-view" ref="view">
    <div class="pso-view-body">
      <div ref="header">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i :class="icon"></i>
              <span>{{ title }}</span>
            </div>
          </div>
        </div>
        <div class="pso-view-fun">
          <div class="pso-view-fun-l">
            <div class="view-table-fun">
              <slot name="tablefun"></slot>
              <template v-if="searchable">
                <pso-search text="搜索" v-model="fetchParams.keywords"></pso-search>
                <el-divider direction="vertical"></el-divider>
              </template>
              <el-button type="text" icon="el-icon-refresh" @click="fetch">刷新</el-button>
            </div>
          </div>
          <div class="pso-view-fun-r">
            <div class="view-data-fun">
              <slot name="datafun"></slot>
            </div>
          </div>
        </div>
      </div>
      <div class="pso-view-table" v-if="!initializing">
        <div class="pso-view-table__body" ref="tableRef">
          <el-table
            v-loading="fetching"
            :size="size"
            border
            :data="instances"
            style="width: 100%"
            :height="tableHeight"
            @row-dblclick="$emit('dbclick', $event)"
            @selection-change="$emit('select', $event)"
          >
            <template #default>
              <el-table-column type="selection" width="40" header-align="center" align="center"></el-table-column>
              <el-table-column type="index" label="序号" :index="1" width="50" align="center"></el-table-column>
              <el-table-column v-for="(f, i) in fields" :key="i" :prop="f.v" :label="f.n" :width="f.w" show-overflow-tooltip resizable>
                <template slot-scope="scope">
                  <span v-if="f.trans">{{ f.trans(scope.row[f.v]) }}</span>
                  <span v-else>{{ scope.row[f.v] }}</span>
                </template>
              </el-table-column>
            </template>
            <template #empty>
              <pso-empty></pso-empty>
            </template>
          </el-table>
          <div class="pso-view-table__footer">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              background
              :page-sizes="[initLimit, 30, 50, 100]"
              :total="dataTotal"
              :page-size="fetchParams.limit"
              :current-page="fetchParams.start"
              @size-change="sizeChangeHandler"
              @current-change="currentChangeHandler"
              @prev-click="prevClickHandler"
              @next-click="nextClickHandler"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { PagingMixin } from "../../mixin/view";

export default {
  mixins: [PagingMixin],
  props: {
    fetchFun: Function,
    title: String,
    icon: {
      type: String,
      default: "el-icon-setting",
    },
    size: {
      type: String,
      default: "mini",
    },
    keywords: {
      type: String,
      default: "",
    },
    fields: {
      type: Array,
      default: () => [],
    },
    initLimit: {
      type: Number,
      default: 20,
    },
    searchable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      initializing: true,
      fetching: false,
      editing: false,
      instances: [],
      dataTotal: 0,
      tableHeight: 200,
    };
  },
  async created() {
    this.fetchParams.limit = this.initLimit;

    this.startWatch();
    await this.fetch();
    this.$on("load", () => {
      this.fetch();
    });
  },
  mounted() {
    const height = $(this.$refs.view).height() - $(this.$refs.header).height() - 65;
    if (height > 100) {
      this.tableHeight = height;
    }
    this.initializing = false;
  },
  methods: {
    async fetch() {
      this.fetching = true;
      const ret = await this.fetchFun(this.getFetchParams(this.keywords));
      if (ret.success) {
        this.instances = ret.data.data;
        this.dataTotal = ret.data.page;
      }
      this.fetching = false;
    },
  },
};
</script>

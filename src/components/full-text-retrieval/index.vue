<template>
  <div class="pso-view">
    <div class="pso-view-body">
      <div ref="header">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-s-order"></i>
              <span>全文检索</span>
            </div>
          </div>
          <div class="pso-view-header__r">
            <div class="pso-view-authtab" v-show="authViews.length > 1 && !params.hideAuthTab">
              <el-tabs v-model="activeView">
                <el-tab-pane v-for="(ah, i) in authViews" :key="i" :label="ah.n" :name="ah.v + ''"></el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
        <div class="pso-view-fun">
          <div class="pso-view-fun-l">
            <pso-search text="搜索关键字" v-model="fetchParams.keywords"></pso-search>
          </div>
        </div>
      </div>
      <div class="pso-view-table">
        <el-table v-loading="fetching" size="small" border :data="instances" style="width: 100%">
          <template #default>
            <el-table-column type="index" label="序号" :index="1" width="50"></el-table-column>
            <template v-for="f in FIELDS">
              <el-table-column :key="f.field" :prop="f.field" :label="f.name" :width="f.width" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="f.field === 'instance_status'">{{ getStatusName(scope.row[f.field]) }}</div>
                  <div v-else v-html="getFiltered(scope.row[f.field], f.field)"></div>
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
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[20, 30, 50, 100]"
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
</template>
<script>
import { PagingMixin, AuthViewMixin } from "../../mixin/view";
import debounce from "throttle-debounce/debounce";

const FIELDS = [
  { field: "pro_name", name: "项目", width: "240" },
  { field: "pro_code", name: "项目编号", width: "140" },
  { field: "d_tag_x", name: "类型", width: "120" },
  { field: "wt_unit", name: "委托单位", width: "120" },
  { field: "js_unit", name: "建设单位", width: "120" },
  { field: "xs_user_x", name: "销售人员", width: "90" },
  { field: "xs_dept_x", name: "销售部门", width: "90" },
  { field: "xm_user_x", name: "项目组长", width: "90" },
  { field: "sd_user_x", name: "编制主持人", width: "90" },
  { field: "bz_user_x", name: "编制人员", width: "90" },
  { field: "bz_dept_x", name: "编制部门", width: "90" },
  { field: "is_qc_x", name: "是否期初", width: "80" },
  { field: "is_gd_x", name: "是否归档", width: "80" },
  { field: "is_sh_x", name: "是否审核", width: "80" },
];

export default {
  mixins: [PagingMixin, AuthViewMixin],
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    this.FIELDS = FIELDS;
    return {
      fetching: false,
      instances: [],
      dataTotal: 0,
    };
  },
  async created() {
    this.deFetch = debounce(200, (params) => {
      this.fetch(params);
    });
    this.startWatch();
    this.$on("load", () => {
      this.deFetch();
    });
    this.$watch("activeView", () => {
      this.fetchParams.start = 1;
      this.deFetch();
    });
    if (this.params.viewAuth) {
      this.analyzeAuthView(this.params.viewAuth, this.params.auth_config);
    }
  },
  methods: {
    async refresh() {
      this.fetch();
    },
    async fetch() {
      const dq = this.fetchParams.keywords;
      if (dq) {
        this.fetching = true;
        const params = this.getFetchParams();
        const ret = await this.API.getFTR({ ...params, dq, leaf_auth: this.activeView });
        this.instances = ret.data.data;
        this.dataTotal = ret.data.total;
        this.fetching = false;
      } else {
        this.instances = [];
        this.dataTotal = 0;
      }
    },
    getFiltered(text) {
      if (text) {
        return text.replace(this.fetchParams.keywords, `<span style="color:red">${this.fetchParams.keywords}</span>`);
      }
      return "";
    },
  },
};
</script>

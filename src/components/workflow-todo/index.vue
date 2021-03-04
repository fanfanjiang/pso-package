<template>
  <div class="pso-view" :class="viewClass" v-loading="initializing">
    <div class="pso-view-extend">
      <transition name="el-fade-in">
        <todo-search v-show="showFilter" :keywords="keywords" :users="users" :orgs="orgs" :workflows="workflows"></todo-search>
      </transition>
    </div>
    <div class="pso-view-body" v-if="!initializing">
      <div class="pso-view-header">
        <div class="pso-view-header__l">
          <el-page-header @back="goBack" content="我的流程"></el-page-header>
        </div>
        <div class="pso-view-header__r">
          <div class="pso-view-authtab">
            <el-tabs v-model="activeView">
              <el-tab-pane :label="view.n" :name="view.v" v-for="view in views" :key="view.n"></el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <div class="pso-view-sorttag" v-if="sorts.length">
        <el-tag size="small" v-for="(sort, i) in sorts" :key="i" closable @close="removeSort(i)">
          {{ sort.name }} {{ sort.order === "desc" ? "降序" : "升序" }}
        </el-tag>
      </div>
      <div class="pso-view-fun">
        <div class="pso-view-fun-l">
          <div class="view-table-fun">
            <div class="todo-trigger">
              <el-button type="text" icon="el-icon-search" @click="showFilter = !showFilter">
                <template>筛选</template>
              </el-button>
            </div>
            <todo-search :keywords="keywords" :users="users" :orgs="orgs" :workflows="workflows"></todo-search>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" icon="el-icon-refresh" @click="fetch">刷新</el-button>
          </div>
        </div>
      </div>
      <div class="pso-view-table">
        <div class="pso-view-table__body">
          <el-table
            id="pso-wf-table"
            v-loading="loading"
            size="small"
            border
            fit
            :data="instances"
            style="width: 100%"
            @row-click="instanceClick"
            @sort-change="makeSort"
          >
            <template #default>
              <el-table-column type="index" label="序号" :index="1" width="50"></el-table-column>
              <template v-for="f in FIELDS">
                <el-table-column
                  v-if="activeView !== '1' ? f.field !== 'step_list' && f.field !== 'user_list' && f.field !== 'nextuser' : true"
                  show-overflow-tooltip
                  :key="f.field"
                  :prop="f.field"
                  :label="f.name"
                  :width="f.width"
                  :sortable="f.sortable"
                >
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
              :background="!__isMobile__"
              :small="__isMobile__"
              :layout="paginationLayout"
              :page-sizes="[limit, 30, 50, 100, 200, 500]"
              :total="dataTotal"
              :page-size="limit"
              :current-page="page"
              @size-change="sizeChangeHandler"
              @current-change="currentChangeHandler"
              @prev-click="prevClickHandler"
              @next-click="nextClickHandler"
            ></el-pagination>
          </div>
        </div>
      </div>
      <pso-dialog :visible="showExecutor" :width="executorWidth" @close="showExecutor = false">
        <template #title>
          <div class="form-executor-header">
            <div class="form-executor-header__l">
              <div class="form-executor-title">
                <i class="el-icon-edit-outline"></i>
                <span>{{ curInstance.wf_name }}</span>
              </div>
            </div>
          </div>
        </template>
        <pso-wf-executor ref="executor" :params="executorParams" @excuted="handleExcuted"></pso-wf-executor>
      </pso-dialog>
    </div>
  </div>
</template>
<script>
import debounce from "throttle-debounce/debounce";
import TodoSearch from "./search";
import { REVIEW_STATUS } from "../../const/workflow";
const REVIEW_STATUS_LIST = Object.values(REVIEW_STATUS);
const FIELDS = {
  wf_name: { name: "流程", field: "wf_name", sortable: "custom", width: "180" },
  d_name: { name: "事项", field: "d_name", sortable: false },
  instance_status: { name: "状态", field: "instance_status", sortable: "custom", width: "100" },
  step_list: { name: "步骤", field: "step_list", sortable: false, width: "110" },
  user_list: { name: "审核人", field: "user_list", sortable: false, width: "110" },
  nextuser: { name: "下一步审核人", field: "nextuser", sortable: false, width: "110" },
  user_name: { name: "创建人", field: "user_name", sortable: "custom", width: "90" },
  dept_name: { name: "部门", field: "dept_name", sortable: "custom", width: "120" },
  create_time: { name: "创建时间", field: "create_time", sortable: "custom", width: "160" },
};

export default {
  components: { TodoSearch },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    this.FIELDS = FIELDS;
    this.REVIEW_STATUS_LIST = REVIEW_STATUS_LIST;
    return {
      initializing: true,
      loading: false,
      showExecutor: false,
      showFilter: false,
      instances: [],
      selected: [],
      views: [
        { n: "待提交", v: "0" },
        { n: "待审批", v: "1" },
        { n: "已退回", v: "2" },
        { n: "转发我的", v: "3" },
        { n: "转抄我的", v: "4" },
        { n: "我发起的", v: "5" },
        { n: "已审批的", v: "6" },
      ],
      activeView: "1",
      sorts: [],
      limit: 15,
      page: 1,
      dataTotal: 0,
      keywords: {
        wf_name: "",
        d_name: "",
        instance_status: [],
        user_name: "",
        dept_name: "",
        create_time: [],
      },
      curInstance: {},
      users: [],
      orgs: [],
      workflows: [],
      customWf: [],
      insttogo: "",
    };
  },
  computed: {
    executorParams() {
      return {
        node_id: this.curInstance.wf_code,
        instance: { instanceId: this.curInstance.instance_id },
      };
    },
    executorWidth() {
      return this.activeView === "0" ? "94%" : "94%";
    },
    defWhere() {
      return {
        search_type: this.activeView,
        limit: this.limit,
        page: this.page - 1,
      };
    },
    paginationLayout() {
      return this.__isMobile__ ? "prev, pager, next" : "total, sizes, prev, pager, next, jumper";
    },
    viewClass() {
      return {
        "pso-view__expend": this.showFilter,
      };
    },
  },
  watch: {
    activeView: {
      handler() {
        this.page = 1;
      },
    },
    defWhere: {
      deep: true,
      handler() {
        !this.initializing && this.fetch();
      },
    },
    keywords: {
      deep: true,
      handler() {
        this.deFetch();
      },
    },
  },
  created() {
    if (this.params.insttogo) {
      this.insttogo = this.params.insttogo;
    }
    this.deFetch = debounce(500, this.fetch);
    this.initialize();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async initialize() {
      this.initializing = true;

      if (this.params.view) {
        const view = _.find(this.views, { n: this.params.view });
        if (view) {
          this.activeView = view.v;
        }
      }

      const ret = await this.API.searchUsers({
        duty_id: "",
        limit: 999,
        node_id: "",
        post_id: "",
        search_type: "0",
        start: 0,
        type: "UserPage",
        user_rel: "0",
      });
      if (ret.success) {
        this.users = ret.data.data.map((d) => ({ value: d.user_name }));
      }

      this.orgs = (await this.API.getOrgTree()).map((d) => ({ value: d.node_display }));
      this.workflows = (await this.API.getWfTree()).map((d) => ({ value: d.node_display }));
      this.customWf = (await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { value: 14, type: 1 } }) })).data;
      await this.makeSort({ prop: "create_time", order: "descending" });
      this.initializing = false;
      await this.checkInsttogo();
    },
    async checkInsttogo() {
      //需要自动打开流程的判断
      if (this.insttogo) {
        const relation = await this.API.getDataRelation({ data_id: this.insttogo });
        if (relation.success && relation.data && relation.data.wf_code) {
          const instObj = {};
          this.$set(instObj, "wf_code", relation.data.wf_code);
          this.$set(instObj, "instance_id", this.insttogo);
          this.instanceClick(instObj);
        }
      }
      this.insttogo = "";
    },
    async fetch() {
      const order = this.sorts.map((item) => `${item.prop} ${item.order}`).join(",");
      const params = { ...this.defWhere, orderby: order ? `order by ${order}` : "", keys: {} };

      for (let k in this.keywords) {
        const isValueAry = Array.isArray(this.keywords[k]);
        const value = isValueAry ? this.keywords[k].join(",") : this.keywords[k];
        if (value) {
          params.keys[k] = { value, type: k === "create_time" ? 3 : isValueAry ? 4 : 2 };
        }
      }

      if (params.keys) {
        params.keys = JSON.stringify(params.keys);
      }

      this.loading = true;
      const ret = await this.API.getTodoList(params);
      const nextsteps = _.groupBy(ret.data.next, "instance_id");

      ret.data.data.forEach((d) => {
        d.nextuser = nextsteps[d.instance_id] ? nextsteps[d.instance_id].map(({ user_name }) => user_name).join("；") : "";
      });
      this.instances = ret.data.data;
      this.dataTotal = ret.data.page;
      this.loading = false;
    },
    async instanceClick(row) {
      const { instance_id, wf_code } = row;
      if (["5", "6"].includes(this.activeView)) {
        const ret = await this.API.updateWfTodoMsg({ instance_id, wf_code });
      }

      const exist = _.find(this.customWf, { map_key1: wf_code });
      if (exist && exist.map_key2) {
        return window.open(`${exist.map_key2}?insttogo=${instance_id}`);
      }

      this.curInstance = row;
      this.$nextTick(() => {
        this.showExecutor = true;
      });
    },
    removeSort(index) {
      this.sorts.splice(index, 1);
      this.fetch();
    },
    makeSort({ column, prop, order }) {
      if (order === "descending") {
        order = "desc";
      } else if (order === "ascending") {
        order = "asc";
      }
      const sortIndex = _.findIndex(this.sorts, { prop });
      if (!order && sortIndex === -1) {
        return;
      }
      if (!order && sortIndex !== -1) {
        return this.removeSort(sortIndex);
      }
      if (sortIndex !== -1) {
        this.sorts[sortIndex].order = order;
      } else {
        this.sorts.push({ prop, order, name: _.find(this.FIELDS, { field: prop }).name });
      }
      this.fetch();
    },
    sizeChangeHandler(size) {
      this.limit = size;
    },
    currentChangeHandler(page) {
      this.page = page;
    },
    prevClickHandler() {
      this.page -= 1;
    },
    nextClickHandler() {
      this.page += 1;
    },
    handleExcuted() {
      this.fetch();
      this.showExecutor = false;
    },
    getStatusName(value) {
      const status = _.find(REVIEW_STATUS_LIST, { value });
      return status ? status.name : "";
    },
    getFiltered(text, field) {
      const searchText = this.keywords[field];
      return searchText && !Array.isArray(searchText) ? text.replace(searchText, `<span style="color:red">${searchText}</span>`) : text;
    },
  },
};
</script>

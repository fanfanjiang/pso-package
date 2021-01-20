<template>
  <div class="pso-view">
    <div class="pso-view-body">
      <div ref="header">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-trophy"></i>
              <span>试卷</span>
            </div>
          </div>
        </div>
        <div class="pso-view-fun">
          <div class="pso-view-fun-l">
            <div class="view-table-fun">
              <pso-search text="搜索" v-model="fetchParams.keywords"></pso-search>
              <el-divider direction="vertical"></el-divider>
              <el-button type="text" icon="el-icon-refresh" @click="fetch">刷新</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="pso-view-table">
        <el-table v-loading="fetching" size="small" border :data="instances" style="width: 100%" @row-dblclick="rowdbClickHandler">
          <template #default>
            <el-table-column type="index" label="序号" :index="1" width="50" align="center"></el-table-column>
            <el-table-column prop="node_display" label="试卷" align="center"></el-table-column>
            <el-table-column prop="user_name" label="考试人" align="center" width="140"></el-table-column>
            <el-table-column prop="exam_name" label="姓名" align="center" width="140"></el-table-column>
            <el-table-column prop="status_name" label="状态" align="center" width="100"></el-table-column>
            <el-table-column prop="result_score" label="分数" width="100"></el-table-column>
            <el-table-column prop="c_time" label="答题时间" align="center"></el-table-column>
            <el-table-column prop="appra_time" label="阅卷时间" align="center"></el-table-column>
            <el-table-column v-if="opEditable || opDeletable" label="操作" width="160" fixed="right" align="center" header-align="center">
              <template slot-scope="scope">
                <el-button v-if="opEditable" size="mini" type="success" @click="rowdbClickHandler(scope.row)">阅卷</el-button>
                <el-popconfirm v-if="opDeletable" title="你确定要删除吗？" @confirm="delHandler(scope.row)">
                  <el-button style="margin-left: 10px" slot="reference" size="mini" type="danger">删除</el-button>
                </el-popconfirm>
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
    <pso-dialog :visible="showEditor" width="80%" @close="showEditor = false">
      <template #title>
        <div class="form-executor-header">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>试卷</span>
            </div>
          </div>
        </div>
      </template>
      <pso-paper-interpreter ref="interpreter" :mode="paperMode" :params="paperParams" @graded="gradedHandler"></pso-paper-interpreter>
    </pso-dialog>
  </div>
</template>
<script>
import { PagingMixin } from "../../mixin/view";
import { PAPER_STATUS } from "../paper-interpreter/const";
const PAPER_STATUSARY = Object.values(PAPER_STATUS);

export default {
  mixins: [PagingMixin],
  props: {
    params: Object,
  },
  data() {
    return {
      initializing: false,
      fetching: false,
      instances: [],
      dataTotal: 0,
      showEditor: false,
      curInstance: {},
      deleting: false,
      opAuth: 0,
    };
  },
  computed: {
    paperParams() {
      return {
        plug_code: this.curInstance.exam_id,
        paperId: this.curInstance.result_id,
        size: "medium",
      };
    },
    opEditable() {
      return (this.opAuth & 2) === 2;
    },
    opDeletable() {
      return (this.opAuth & 4) === 4;
    },
    paperMode() {
      return this.opEditable ? "grade" : "read";
    },
  },
  async created() {
    if (this.params.plug_code) {
      await this.initialize(this.params.plug_code);
      this.startWatch();
      this.$on("load", () => {
        this.fetch();
      });
      await this.fetch();
    }
  },
  methods: {
    async initialize(tp_code) {
      this.initializing = true;
      const ret = await this.API.templates({ data: { tp_code }, method: "get" });
      if (ret.success) {
        this.opAuth = ret.data.leaf_auth;
        this.initializing = false;
      }
    },
    async fetch() {
      this.fetching = true;
      const ret = await this.API.getPapers(this.getFetchParams("exam_name"));
      ret.data.forEach((d) => {
        const exist = _.find(PAPER_STATUSARY, { v: d.exam_status });
        if (exist) {
          d.status_name = exist.n;
        }
      });
      this.instances = ret.data;
      this.dataTotal = ret.count;
      this.fetching = false;
    },
    rowdbClickHandler(row) {
      this.curInstance = row;
      this.showEditor = true;
    },
    gradedHandler() {
      this.showEditor = false;
      this.fetch();
    },
    async delHandler(row) {
      if (this.deleting) return;
      this.deleting = true;
      const ret = await this.API.addOrUpdatePaper({ exam_id: row.exam_id, result_id: row.result_id, optype: 2 });
      this.ResultNotify(ret);
      this.fetch();
      this.deleting = false;
    },
  },
};
</script>

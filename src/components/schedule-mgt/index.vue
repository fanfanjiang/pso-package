<template>
  <div class="pso-view">
    <div class="pso-view-body">
      <div ref="header">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-s-help"></i>
              <span>定时任务</span>
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
          <div class="pso-view-fun-r">
            <div class="view-data-fun">
              <el-button type="primary" size="mini" @click="addHandler">新增</el-button>
              <el-button type="danger" size="mini" @click="delHandler">删除</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="pso-view-table">
        <el-table
          v-loading="fetching"
          size="small"
          border
          :data="instances"
          style="width: 100%"
          @row-dblclick="rowdbClickHandler"
          @selection-change="changeHandler"
        >
          <template #default>
            <el-table-column type="selection" width="40" header-align="center" align="center"></el-table-column>
            <el-table-column type="index" label="序号" :index="1" width="50"></el-table-column>
            <el-table-column prop="job_id" label="ID"></el-table-column>
            <el-table-column prop="job_group" label="分组"></el-table-column>
            <el-table-column prop="job_name" label="名称"></el-table-column>
            <el-table-column prop="job_trigger" label="触发器"></el-table-column>
            <el-table-column prop="job_config" label="脚本"></el-table-column>
            <el-table-column prop="job_key" label="执行类名"></el-table-column>
            <el-table-column prop="job_map" label="配置参数"></el-table-column>
            <el-table-column prop="job_note" label="说明"></el-table-column>
            <el-table-column prop="is_auto" label="自动执行"></el-table-column>
            <el-table-column prop="job_status" label="状态"></el-table-column>
            <el-table-column prop="create_time" label="创建时间"></el-table-column>
            <el-table-column label="操作" width="80" fixed="right" align="center" header-align="center">
              <template slot-scope="scope">
                <el-popconfirm title="你确定吗？" @confirm="startOrStop(scope.row)">
                  <el-button slot="reference" size="mini" :type="scope.row.job_status === '0' ? 'success' : 'danger'">
                    {{ scope.row.job_status === "0" ? "开始" : "停止" }}
                  </el-button>
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
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <div class="form-executor-header" v-loading="editing">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>任务设置</span>
            </div>
          </div>
          <div class="form-executor-header__r">
            <el-button type="primary" size="mini" @click="saveHandler()">保存</el-button>
          </div>
        </div>
      </template>
      <div style="height: 100%; padding: 15px; overflow: auto" v-loading="editing">
        <el-form label-position="left" label-width="100px" size="small">
          <el-form-item label="分组" required>
            <el-select filterable clearable size="small" v-model="curInstance.job_group">
              <el-option v-for="(t, i) in TYPES" :key="i" :label="t.n" :value="t.v"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称" required>
            <el-input v-model="curInstance.job_name" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="触发器" required>
            <el-select filterable clearable size="small" v-model="curInstance.job_trigger">
              <el-option v-for="(t, i) in triggers" :key="i" :label="t.trigger_name" :value="t.trigger_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="脚本" required>
            <el-button size="small" type="primary" icon="el-icon-edit" circle @click="openSql"></el-button>
          </el-form-item>
          <el-form-item label="自动执行" required>
            <el-checkbox size="small" v-model="curInstance.is_auto" true-label="1" false-label="0">自动执行</el-checkbox>
          </el-form-item>
          <el-form-item label="执行类名" required>
            <el-input v-model="curInstance.job_key" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="参数" required>
            <el-input v-model="curInstance.job_map" type="textarea" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="说明" required>
            <el-input v-model="curInstance.job_note" type="textarea" size="small" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
    <sql-designer ref="designer" :opener="sqlOpener" :sql="curScript"></sql-designer>
  </div>
</template>
<script>
import { PagingMixin } from "../../mixin/view";
import SqlDesigner from "../sql-designer";

const TYPES = [
  { n: "系统", v: "System" },
  { n: "脚本", v: "Script" },
  { n: "API", v: "ApiJob" },
];

const DATA = {
  job_group: "",
  job_name: "",
  job_trigger: "",
  job_config: "",
  job_key: "",
  job_map: "",
  job_note: "",
  job_stime: "",
  job_etime: "",
  is_auto: "",
};

export default {
  components: { SqlDesigner },
  mixins: [PagingMixin],
  data() {
    this.TYPES = TYPES;
    return {
      sqlOpener: { show: false },
      fetching: false,
      editing: false,
      instances: [],
      dataTotal: 0,
      showEditor: false,
      curInstance: { ...DATA },
      selected: [],
      triggers: [],
      curScript: [],
      starting: false,
    };
  },
  async created() {
    this.triggers = (await this.API.getScheduleTriggers({ start: 0, limit: 9999 })).data;

    this.startWatch();
    await this.fetch();
    this.$on("load", () => {
      this.fetch();
    });
  },
  methods: {
    async fetch() {
      this.fetching = true;
      const ret = await this.API.schedule({ data: this.getFetchParams("job_name"), method: "get" });
      this.instances = ret.data;
      this.fetching = false;
    },
    addHandler() {
      this.curInstance = { ...DATA };
      this.makeSql();
      this.showEditor = true;
    },
    rowdbClickHandler(row) {
      this.curInstance = row;
      this.makeSql();
      this.showEditor = true;
    },
    makeSql() {
      if (this.curInstance.job_config) {
        this.curScript = JSON.parse(this.curInstance.job_config);
      } else {
        this.curScript = [];
      }
    },
    async saveHandler(params) {
      if (this.editing) return;
      this.editing = true;
      let data = {};
      if (params) {
        data = { ...params, optype: 2 };
      } else {
        const { job_id } = this.curInstance;
        data = { ...this.curInstance, optype: job_id ? 1 : 0 };
      }
      const ret = await this.API.schedule({ data: { ...data, job_config: JSON.stringify(this.curScript) }, method: "put" });
      this.ResultNotify(ret);
      this.showEditor = false;
      this.fetch();
      this.editing = false;
    },
    async delHandler() {
      if (!this.selected.length) {
        return;
      }
      this.saveHandler({ job_id: this.selected[0].job_id });
    },
    changeHandler(rows) {
      this.selected = rows;
    },
    openSql() {
      this.sqlOpener.show = true;
    },
    async startOrStop({ job_id, job_status }) {
      if (this.starting) return;
      this.starting = true;
      const ret = await this.API.schedule({ data: { job_id, action: job_status === "0" ? "start" : "pause" }, method: "put" });
      this.ResultNotify(ret);
      this.starting = false;
    },
  },
};
</script>

<template>
  <div class="pso-view">
    <div class="pso-view-body">
      <div ref="header">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-s-help"></i>
              <span>定时任务触发器</span>
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
            <el-table-column prop="trigger_id" label="ID"></el-table-column>
            <el-table-column prop="trigger_group" label="分组"></el-table-column>
            <el-table-column prop="trigger_name" label="名称"></el-table-column>
            <el-table-column prop="trigger_type" label="类型"></el-table-column>
            <el-table-column prop="trigger_config" label="配置"></el-table-column>
            <el-table-column prop="trigger_params" label="参数"></el-table-column>
            <el-table-column prop="trigger_note" label="说明"></el-table-column>
            <el-table-column prop="trigger_stime" label="开始时间"></el-table-column>
            <el-table-column prop="trigger_etime" label="结束时间"></el-table-column>
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
              <span>定时任务触发器</span>
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
            <el-select filterable clearable size="small" v-model="curInstance.trigger_group">
              <el-option v-for="(t, i) in TYPES" :key="i" :label="t.n" :value="t.v"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称" required>
            <el-input v-model="curInstance.trigger_name" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" required>
            <el-select filterable clearable size="small" v-model="curInstance.trigger_type">
              <el-option v-for="(t, i) in TYPES" :key="i" :label="t.n" :value="t.v"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配置" required>
            <el-input v-model="curInstance.trigger_config" type="textarea" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="参数" required>
            <el-input v-model="curInstance.trigger_params" type="textarea" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="说明" required>
            <el-input v-model="curInstance.trigger_note" type="textarea" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" required>
            <el-date-picker v-model="curInstance.trigger_stime" size="mini" type="datetime" :value-format="format" :format="format">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" required>
            <el-date-picker v-model="curInstance.trigger_etime" size="mini" type="datetime" :value-format="format" :format="format">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { PagingMixin } from "../../mixin/view";

const TYPES = [
  { n: "Cron", v: "Cron表达式" },
  { n: "CalendarInterval", v: "CalendarInterval" },
  { n: "DailyTimeInterval", v: "DailyTimeInterval" },
  { n: "Simple", v: "Simple" },
];

const DATA = {
  trigger_group: "",
  trigger_name: "",
  trigger_type: "",
  trigger_config: "",
  trigger_params: "",
  trigger_note: "",
  trigger_stime: "",
  trigger_etime: "",
};

export default {
  mixins: [PagingMixin],
  data() {
    this.TYPES = TYPES;
    this.format = "yyyy-MM-dd HH:mm:ss";
    return {
      fetching: false,
      editing: false,
      instances: [],
      dataTotal: 0,
      showEditor: false,
      curInstance: { ...DATA },
      selected: [],
    };
  },
  async created() {
    this.startWatch();
    await this.fetch();
    this.$on("load", () => {
      this.fetch();
    });
  },
  methods: {
    async fetch() {
      this.fetching = true;
      const ret = await this.API.getScheduleTriggers(this.getFetchParams("trigger_name"));
      this.instances = ret.data;
      this.fetching = false;
    },
    addHandler() {
      this.curInstance = { ...DATA };
      this.showEditor = true;
    },
    rowdbClickHandler(row) {
      this.curInstance = row;
      this.showEditor = true;
    },
    async saveHandler(params) {
      if (this.editing) return;
      this.editing = true;
      let trigger_id;
      let data = {};
      if (params) {
        data = { ...params, optype: 2 };
      } else {
        const { trigger_id } = this.curInstance;
        data = { ...this.curInstance, optype: trigger_id ? 1 : 0 };
      }
      const ret = await this.API.addOrUpdateScheduleTrigger(data);
      this.ResultNotify(ret);
      this.showEditor = false;
      this.fetch();
      this.editing = false;
    },
    async delHandler() {
      if (!this.selected.length) {
        return;
      }
      this.saveHandler({ trigger_id: this.selected[0].trigger_id });
    },
    changeHandler(rows) {
      this.selected = rows;
    },
  },
};
</script>

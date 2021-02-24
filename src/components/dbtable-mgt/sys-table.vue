<template>
  <div class="pso-view">
    <div class="pso-view-body">
      <div class="pso-view-fun">
        <div class="pso-view-fun-l">
          <div class="view-table-fun" v-if="!staticMode">
            <el-button type="text" icon="el-icon-refresh" @click="fetch">刷新</el-button>
          </div>
        </div>
        <div class="pso-view-fun-r">
          <div class="view-data-fun">
            <el-button v-if="!selectable" type="primary" size="mini" @click="confirm">确定</el-button>
            <el-button v-if="selectable" type="primary" size="mini" @click="showEditor = true">选择数据</el-button>
            <el-button v-if="selectable" type="danger" size="mini" :disabled="!selected.length" @click="cancel">取消选择</el-button>
          </div>
        </div>
      </div>
      <div class="pso-view-table">
        <div class="pso-view-table__body" ref="tableRef">
          <el-table
            ref="table"
            style="width: 100%"
            size="mini"
            border
            v-loading="fetching"
            :data="instances"
            @selection-change="changeHandler"
          >
            <template #default>
              <el-table-column type="selection" width="40" header-align="center" align="center"></el-table-column>
              <el-table-column v-for="(f, i) in fields" :key="i" :prop="f" :label="f"></el-table-column>
            </template>
            <template #empty>
              <pso-empty></pso-empty>
            </template>
          </el-table>
          <div class="pso-view-table__footer" v-if="!staticMode">
            <el-pagination
              :small="true"
              layout=" prev, next"
              :total="dataTotal"
              :page-sizes="[20, 30, 50, 100]"
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
    <pso-dialog :visible="showEditor" width="70%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>选择数据</span>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content" v-loading="editing">
        <pso-sys-table :code="code" :selectable="false" :static-mode="false" @confirm="confirmHandler"></pso-sys-table>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { PagingMixin } from "../../mixin/view";
export default {
  name: "pso-sys-table",
  mixins: [PagingMixin],
  props: {
    cid: {
      type: String,
      default: "",
    },
    code: {
      type: String,
      default: "",
    },
    selectable: {
      type: Boolean,
      default: true,
    },
    staticMode: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showEditor: false,
      fetching: false,
      dataTotal: 0,
      instances: [],
      selected: [],
      fields: ["空空如也"],
    };
  },
  created() {
    this.startWatch();
    this.$on("load", () => {
      this.fetch();
    });
    if (!this.staticMode) {
      this.fetch();
    }
  },
  methods: {
    async fetch() {
      this.fetching = true;
      const ret = await this.API.getSysData({ ...this.getFetchParams(), custom_id: this.cid, code: this.code });
      if (ret.success) {
        this.analyzeData(ret.data.data);
        this.instances = ret.data.data;
        this.dataTotal = ret.data.page;
      }
      this.fetching = false;
    },
    changeHandler(data) {
      this.selected = data;
    },
    confirm() {
      this.$emit("confirm", this.selected);
    },
    cancel() {
      this.selected.forEach(({ id }) => {
        this.instances.splice(_.findIndex(this.instances, { id }), 1);
      });
    },
    confirmHandler(data) {
      this.analyzeData(data);
      for (let d of data) {
        const exist = _.find(this.instances, { id: d.id });
        if (!exist) {
          this.instances.push(d);
        }
      }
      this.showEditor = false;
    },
    analyzeData(data) {
      if (data.length) {
        this.fields = Object.keys(data[0]);
      }
    },
  },
};
</script>
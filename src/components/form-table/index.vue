<template>
  <div class="pso-formTable">
    <div v-if="!initializing">
      <div class="pso-formTable__top">
        <div class="pso-formTable__title">
          <form-icon></form-icon>
          <span>{{cfg.data_name}}</span>
        </div>
        <div class="pso-formTable-view" v-if="viewAuths.length>1">
          <el-tabs v-model="activeView">
            <el-tab-pane :label="auth.n" :name="auth.v+''" v-for="auth in viewAuths" :key="auth.v"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="pso-formTable-status" v-if="statuses.length">
        <el-badge
          :hidden="status.total==='0'"
          :value="status.total"
          class="item"
          :type="index>3?'info':''"
          :max="99"
          v-for="(status,index) in statuses"
          :key="index"
        >
          <el-tag
            size="medium"
            :effect="curStatus===status?'dark':'plain'"
            @click="handleStatusClick(status)"
          >{{status.name}}</el-tag>
        </el-badge>
        <el-tag size="medium" @click="handleStatusClick()" :effect="!curStatus?'dark':'plain'">全部</el-tag>
      </div>
      <div class="pso-formTable-sort" v-if="sorts.length">
        <el-tag
          size="small"
          v-for="(sort,index) in sorts"
          :key="sort.prop"
          closable
          @close="handleDelSort(index)"
        >{{sort.name}} {{sort.order==='desc'?'降序':'升序'}}</el-tag>
      </div>
      <div class="pso-formTable-header" v-if="!readOnly">
        <div class="pso-formTable-header__left">
          <el-popover v-model="showFilter" placement="bottom-start" width="400" trigger="click">
            <div class="pso-formTable__filter">
              <div class="pso-formTable__filter-body">
                <pso-data-filter v-model="condition" :fieldsOptions="conditionOptions"></pso-data-filter>
              </div>
              <div class="pso-formTable__filter-footer">
                <el-button type="primary" size="mini" @click="goFilter">确定</el-button>
              </div>
            </div>
            <el-button type="text" icon="fa fa-filter" slot="reference">筛选</el-button>
          </el-popover>
          <el-divider direction="vertical"></el-divider>
          <el-popover v-model="showSetting" placement="bottom-start" width="300" trigger="click">
            <div class="pso-formTable__setting">
              <div class="pso-formTable__setting-item" v-for="fItem of fields" :key="fItem.fid">
                <el-switch
                  v-model="fItem.show"
                  :inactive-text="fItem.display"
                  active-value="1"
                  inactive-value="0"
                ></el-switch>
              </div>
            </div>
            <el-button type="text" icon="el-icon-setting" slot="reference">列表</el-button>
          </el-popover>
          <el-divider direction="vertical"></el-divider>
          <el-input
            ref="keywords"
            v-show="showKeywords"
            placeholder="按回车搜索"
            prefix-icon="el-icon-search"
            size="mini"
            v-model="keywords"
            clearable
            @blur="handleKeywordsBlur"
            @clear="showKeywords=false"
            @change="getFormData"
          ></el-input>
          <el-button
            v-show="!showKeywords"
            type="text"
            icon="el-icon-search"
            @click="showKeywords=true"
          >搜索</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" icon="el-icon-refresh" @click="getFormData">刷新</el-button>
        </div>
        <div class="pso-formTable-header__right">
          <el-button v-if="opAddable" type="primary" size="mini" @click="newData">{{cpntText.add}}</el-button>
          <el-button v-if="selectable" type="primary" size="mini" @click="selectConfirmHandler">确定</el-button>
          <slot name="op"></slot>
          <el-dropdown size="small" trigger="click" v-if="opChangable">
            <el-button
              type="primary"
              size="mini"
              :disabled="!selectedList.length"
            >{{cpntText.change}}</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(status,index) in opStatuses" :key="index">
                <el-popconfirm
                  confirmButtonText="确定"
                  cancelButtonText="取消"
                  icon="el-icon-info"
                  iconColor="red"
                  title="你确认要修改吗"
                  @onConfirm="handleStatusChange(status)"
                >
                  <span slot="reference">{{status.name}}</span>
                </el-popconfirm>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            v-if="opAddable"
            type="primary"
            size="mini"
            @click="handleCopy"
            :disabled="selectedList.length !== 1"
          >{{cpntText.copy}}</el-button>
          <el-dropdown size="small" @command="handleMore">
            <el-button class="el-dropdown-link" size="mini" type="text">
              更多
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>下载模板</el-dropdown-item>
              <el-dropdown-item v-if="opAddable">导入</el-dropdown-item>
              <el-dropdown-item command="export" v-if="opExportable">导出EXCEL</el-dropdown-item>
              <el-dropdown-item v-if="opExportable">全部导出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="pso-formTable-table">
        <el-table
          id="pso-formTable-table"
          ref="table"
          v-loading="loadingTable"
          style="width: 100%"
          size="small"
          border
          :highlight-current-row="radio"
          :data="formData"
          :summary-method="handleSummary"
          :show-summary="showSummary"
          @row-click="instanceClick"
          @selection-change="handleSelectionChange"
          @sort-change="handleSort"
        >
          <template #default>
            <el-table-column v-if="checkbox" type="selection" width="40"></el-table-column>
            <el-table-column type="index" label="序号" :index="1" width="50"></el-table-column>
            <el-table-column
              resizable
              show-overflow-tooltip
              min-width="120"
              :prop="field.field_name"
              :label="field.display"
              v-for="field of showFieldsReal"
              :key="field.field_name"
              :width="field.width"
              :align="field.align"
              :sortable="field.sortable==='1'?'custom':false"
            >
              <template slot-scope="scope">
                <a
                  v-if="field.url"
                  href="javascript:;"
                  @click.stop.prevent="handleUrlClick({row:scope.row,field})"
                >{{getVal(scope.row[field.field_name])}}</a>
                <span v-else>{{getVal(scope.row[field.field_name])}}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="operate" :label="opText" fixed="right">
              <template slot-scope="scope" v-if="deletable">
                <el-button
                  size="mini"
                  type="danger"
                  @click.stop.prevent="deleteForm(scope.row.leaf_id)"
                >删除</el-button>
              </template>
              <template slot-scope="scope" v-if="!deletable">
                <slot name="column" v-bind:data="{row:scope.row,code:cfg.data_code}"></slot>
              </template>
            </el-table-column>
          </template>
          <template #empty>
            <pso-empty></pso-empty>
          </template>
        </el-table>
        <div class="pso-formTable-footer">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[30,50,100,200,500]"
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
    <pso-skeleton v-else :lines="5"></pso-skeleton>
    <pso-drawer
      size="48%"
      :visible="showFormViewer"
      :title="cfg.data_name"
      @close="showFormViewer=false"
    >
      <div class="pso-formTable-formViewer" v-if="cfg.data_code">
        <pso-form-view
          ref="formImage"
          :form-entity="cfg"
          :data-id="dataId"
          :data-instance="instance"
          :editable="dataId?edtailEditable:addable"
        ></pso-form-view>
      </div>
      <template v-slot:footer v-if="dataId?edtailEditable:addable">
        <div class="pso-drawer-footer__body">
          <el-button v-if="deletable" type="danger" size="small" @click="deleteForm(dataId)">删除</el-button>
          <el-button
            type="primary"
            size="small"
            @click="saveForm"
            :disabled="saving"
            :loading="saving"
          >保存</el-button>
        </div>
      </template>
    </pso-drawer>
  </div>
</template>
<script>
import PsoDataFilter from "../data-filter/index";
import shortid from "shortid";
import FormStore from "../form-designer/model/store.js";
import XLSX from "xlsx";
import Qs from "qs";
import { MENU_LEAF_AUTH } from "../../const/menu";
import FormIcon from "./form-icon";

export default {
  components: { PsoFormView: () => import("../form-interpreter"), PsoDataFilter, FormIcon },
  props: {
    cfgId: String,
    autoSubmit: {
      type: Boolean,
      default: true
    },
    columnFilter: Array,
    operate: {
      type: Boolean,
      default: false
    },
    addable: {
      type: Boolean,
      default: true
    },
    edtailEditable: {
      type: Boolean,
      default: true
    },
    deletable: {
      type: Boolean,
      default: true
    },
    checkbox: {
      type: Boolean,
      default: true
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Boolean,
      default: false
    },
    selectionType: {
      type: String,
      default: "checkbox"
    },
    dataPovider: Function,
    opText: {
      type: String,
      default: "操作"
    },
    where: Object,
    viewAuth: {
      type: Number,
      default: 0
    },
    defOpauth: Number,
    textGroup: String,
    plug_code: String,
    defKeys: String
  },
  data() {
    return {
      loadingTable: false,
      initializing: false,
      showFormViewer: false,
      cfg: {
        data_code: "",
        data_design: []
      },
      fields: [],
      formData: [],
      currentRow: {},
      conditionOptions: [],
      condition: "",
      showFilter: false,
      showSetting: false,
      showKeywords: false,
      keywords: "",
      dataId: "",
      saving: false,
      limit: 15,
      page: 1,
      defaultKeys: {},
      keys: {},
      dataTotal: 0,
      selectedList: [],
      store: null,
      sorts: [],
      summary: null,
      statuses: [],
      curStatus: "",
      instance: null,
      viewAuths: [],
      activeView: 0,
      opAuth: "",
      cpntText: {
        add: "新增",
        change: "更改",
        copy: "复制"
      }
    };
  },
  computed: {
    showFieldsReal() {
      return this.fields.filter(
        item => item.show === "1" && (this.columnFilter ? this.columnFilter.indexOf(item.field_name) === -1 : true)
      );
    },
    showSummary() {
      return this.summary;
    },
    opAddable() {
      return this.addable && (this.opAuth & 1) === 1;
    },
    opChangable() {
      return this.statuses.length && (this.opAuth & 2) === 2;
    },
    opExportable() {
      return (this.opAuth & 4) === 4;
    },
    defWhere() {
      return {
        limit: this.limit,
        page: this.page - 1
      };
    },
    opStatuses() {
      return this.statuses.filter(item => item.value !== "0");
    }
  },
  watch: {
    showKeywords(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.keywords.focus();
        });
      }
    },
    defWhere: {
      deep: true,
      handler() {
        !this.initializing && this.getFormData();
      }
    },
    cfgId() {
      this.getFormCfg();
    },
    activeView() {
      !this.initializing && this.getFormStatus();
    }
  },
  async created() {
    if (typeof this.defOpauth !== "undefined") {
      this.opAuth = this.defOpauth;
    }
    await this.getFormCfg();
  },
  methods: {
    handleKeywordsBlur() {
      if (this.keywords === "") {
        this.showKeywords = false;
      }
    },
    handleMore(command) {
      this[command] && this[command]();
    },
    handleCopy() {
      if (this.selectedList.length !== 1) {
        return this.$message("请先选择一条要复制的数据");
      }
      this.dataId = "";
      this.instance = { ...this.selectedList[0], leaf_id: "" };
      this.showFormViewer = true;
    },
    async handleStatusChange(status) {
      if (!this.selectedList.length) {
        return this.$message("请先选择要更改的数据");
      }

      const ret = await this.API.updateFormStatus({
        data_code: this.cfg.data_code,
        d_status: status.value,
        leafids: this.selectedList.map(item => item.leaf_id).join(",")
      });

      this.ResultNotify(ret);
      this.getFormStatus();
    },
    handleStatusClick(status) {
      this.curStatus = status;
      if (status) {
        this.$set(this.keys, "d_status", { value: status.value, type: 1 });
      } else {
        delete this.keys.d_status;
      }
      !this.initializing && this.getFormData();
    },
    getVal(val) {
      return _.isNull(val) ? "" : decodeURIComponent(val);
    },
    reset() {
      this.viewAuths = [];
    },
    async getFormCfg() {
      this.reset();

      this.initializing = true;
      const ret = await this.API.formsCfg({ data: { id: this.cfgId, auth: 1 }, method: "get" });
      if (!ret.success) return;

      this.store = new FormStore(ret.data);
      this.cfg = Object.assign({}, this.cfg, ret.data);

      this.conditionOptions = this.store.search({
        options: { db: true },
        onlyMain: true,
        onlyData: true,
        beforePush: item => {
          item.data.displayName = `[${item.CPNT.name}]${item.data._fieldName}`;
          return true;
        }
      });

      if (this.cfg.display_columns) {
        this.fields = JSON.parse(this.cfg.display_columns).filter(item => item.using === "1");
      }

      if (!this.fields.length) {
        this.fields = this.store.search({
          options: { table_show: true },
          onlyMain: true,
          onlyData: true,
          beforePush: item => {
            this.$set(item.data, "display", item.data._fieldName);
            this.$set(item.data, "field_name", item.data._fieldValue);
            this.$set(item.data, "show", "1");
            return true;
          }
        });
      }
      this.fields = _.orderBy(this.fields, ["number"], ["asc"]);

      //视图权限
      if (this.viewAuth) {
        MENU_LEAF_AUTH.forEach(a => {
          if ((a.v & this.viewAuth) === a.v) {
            this.viewAuths.push(a);
          }
        });
        this.viewAuths = _.orderBy(this.viewAuths, ["v"], ["desc"]);
        this.activeView = this.viewAuths[0].v + "";
      }

      //获取操作权限
      if (this.cfg.opAuth) {
        this.opAuth = this.cfg.opAuth.leaf_auth;
      }

      //获取按钮文本
      if (this.textGroup && this.plug_code) {
        const tpRet = await this.API.getTreeNode({ code: this.plug_code });
        if (tpRet.success) {
          const tpCfg = tpRet.data.data;
          if (tpCfg.tp_text) {
            const text = JSON.parse(tpCfg.tp_text);
            const selectedText = _.find(text, { id: this.textGroup });
            if (selectedText) {
              selectedText.list.forEach(item => {
                this.cpntText[item.id] = item.value || item.name;
              });
            }
          }
        }
      }

      try {
        //外部传入的请求参数
        if (this.where) {
          for (let key in this.where) {
            this.defaultKeys[key] = { value: this.where[key], type: 1 };
          }
        }
        if (this.defKeys) {
          let keyList = this.defKeys.split(",");
          keyList.forEach(item => {
            const key = item.split("=");
            this.defaultKeys[key[0]] = { value: key[1], type: 1 };
          });
        }
      } catch (error) {}

      this.initializing = false;
      this.getFormStatus();
    },
    async getFormStatus() {
      const ret = await this.API.getFormStatus({
        leaf_auth: this.activeView,
        data_code: this.cfg.data_code,
        keys: JSON.stringify({ ...this.defaultKeys })
      });

      //状态设置
      if (ret.success && ret.data) {
        this.statuses = ret.data;
        if (this.statuses.length) {
          this.handleStatusClick(this.statuses[0]);
        } else {
          this.handleStatusClick();
        }
      }
    },
    async getFormData() {
      this.loadingTable = true;

      const order = this.sorts.map(item => `${item.prop} ${item.order}`).join(",");

      const parameters = {
        ...this.defWhere,
        leaf_auth: this.activeView,
        orderby: order ? `order by ${order}` : "",
        data_code: this.cfg.data_code,
        keys: { ...this.keys, ...this.defaultKeys }
      };

      if (this.condition !== "【】") {
        parameters.condition = this.condition;
      }

      if (this.keywords !== "" && !parameters.keys.d_name) {
        parameters.keys.d_name = { value: this.keywords, type: 2 };
      }

      parameters.keys = JSON.stringify(parameters.keys);

      const ret = await this.API.form({
        data: parameters,
        method: "get"
      });

      if (this.dataPovider) {
        await this.dataPovider(ret.data);
      }
      this.loadingTable = false;
      if (ret.success) {
        this.formData = ret.data;
        this.dataTotal = ret.total;

        if (ret.sum) {
          this.summary = ret.sum;
        } else {
          this.summary = null;
        }
      }

      this.$emit("data-loaded");
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
    async goFilter() {
      this.showFilter = false;
      await this.getFormData();
    },
    async reload() {
      await this.getFormData();
    },
    instanceClick(row) {
      this.currentRow = row;
      this.dataId = row.leaf_id;
      this.instance = null;
      this.showFormViewer = true;
    },
    newData() {
      this.dataId = "";
      this.instance = null;
      this.showFormViewer = true;
    },
    async deleteForm(leaf_id) {
      this.loadingTable = true;
      const ret = await this.API.form({
        data: { leaf_id, data_code: this.store.data_code, dataArr: [{ optype: 2, leaf_id }] },
        method: "delete"
      });
      this.$notify({ title: "删除成功", type: "success" });
      this.getFormStatus();
      this.loadingTable = false;
      this.showFormViewer = false;
    },
    startSave() {
      this.saving = true;
    },
    savedForm() {
      this.showFormViewer = false;
      this.saving = false;
      this.$notify({ title: "成功", type: "success" });
      this.getFormStatus();
    },
    handleSelectionChange(val) {
      if (this.selectionType === "radio" && val.length > 1) {
        this.$refs.table.clearSelection();
        this.$refs.table.toggleRowSelection(val[val.length - 1], true);
        val = [val[val.length - 1]];
      }
      this.selectedList = val;
    },
    selectConfirmHandler() {
      this.$emit("selection-confirm", this.selectedList);
    },
    async saveForm() {
      try {
        const formData = await this.$refs.formImage.makeData();
        this.updateFormData({ leaf_id: this.dataId, formData });
      } catch (error) {
        return null;
      }
    },
    async updateFormData({ leaf_id, formData }) {
      leaf_id = leaf_id || shortid.generate();
      if (this.autoSubmit) {
        this.startSave();
        const ret = await this.API.form({ data: { leaf_id, formData }, method: "put" });
        this.savedForm();
      } else {
        this.$emit("submit", { leaf_id: this.dataId, formData });
      }
    },
    export() {
      const dom = $(".pso-formTable").find("#pso-formTable-table");
      const et = XLSX.utils.table_to_book(dom[0]);
      const etout = XLSX.write(et, { bookType: "xlsx", bookSST: true, type: "array" });
      try {
        FileSaver.saveAs(
          new Blob([etout], {
            type: "application/octet-stream"
          }),
          "trade-publish.xlsx"
        );
      } catch (e) {
        console.log(e, etout);
      }
      return etout;
    },
    handleDelSort(index) {
      this.sorts.splice(index, 1);
      this.getFormData();
    },
    handleSort({ column, prop, order }) {
      order = order === "descending" ? "desc" : "asc";
      const sort = _.find(this.sorts, { prop });
      if (sort) {
        sort.order = order;
      } else {
        this.sorts.push({ prop, order, name: _.find(this.fields, { field_name: prop }).display });
      }
      this.getFormData();
    },
    handleUrlClick({ row, field }) {
      window.open(`${field.url}?${Qs.stringify({ [field.field_name]: row[field.field_name] })}`);
    },
    handleSummary({ columns }) {
      const indexs = new Array(columns.length).fill("");
      if (this.summary) {
        for (let key in this.summary) {
          const index = _.findIndex(columns, { property: key });
          console.log(index);
          if (index !== -1) {
            indexs[index] = this.summary[key];
          }
        }
      }
      return indexs;
    }
  }
};
</script>

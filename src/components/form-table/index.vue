<template>
  <div class="pso-formTable">
    <div class="pso-formTable-header" v-if="!readOnly">
      <div class="pso-formTable-header__left">
        <el-popover v-model="showFilter" placement="bottom-start" width="400" trigger="click">
          <div class="pso-formTable__filter">
            <div class="pso-formTable__filter-body">
              <pso-datafilter v-model="condition" :fieldsOptions="conditionOptions"></pso-datafilter>
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
            <div class="pso-formTable__setting-item" v-for="fItem of showFields" :key="fItem.fid">
              <el-switch v-model="fItem._showColumn" :inactive-text="fItem._fieldName"></el-switch>
            </div>
          </div>
          <el-button type="text" icon="el-icon-setting" slot="reference">列表管理</el-button>
        </el-popover>
        <el-divider direction="vertical"></el-divider>
        <el-input
          ref="keywords"
          v-show="showKeywords"
          placeholder="搜索"
          prefix-icon="el-icon-search"
          size="small"
          @blur="showKeywords=false"
          v-model="keywords"
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
        <el-button v-if="addable" type="primary" size="mini" round @click="newData">{{addBtnText}}</el-button>
        <el-button v-if="checkbox" type="primary" size="mini" round @click="selectConfirmHandler">确定</el-button>
      </div>
    </div>
    <div class="pso-formTable-table" v-if="!initializing">
      <el-table
        ref="table"
        v-loading="loadingTable"
        :data="formData"
        style="width: 100%"
        size="medium"
        max-height="500"
        @row-click="instanceClick"
        @selection-change="handleSelectionChange"
        :highlight-current-row="radio"
      >
        <el-table-column v-if="checkbox" type="selection" width="55"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          :prop="tableField._fieldValue"
          :label="tableField._fieldName"
          v-for="(tableField) of showFieldsReal"
          :key="tableField.fid"
        >
          <template slot-scope="scope">
            <el-tag
              disable-transitions
              v-if="tableField.componentid === 'attachment'"
              size="mini"
            >附件</el-tag>
            <el-tag
              disable-transitions
              v-else-if="tableField.componentid === 'table'"
              size="mini"
            >{{tableField.name}}</el-tag>
            <div v-else>{{decodeURIComponent(scope.row[tableField._fieldValue])}}</div>
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
      </el-table>
      <div class="pso-formTable-footer">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[30,50,100,200,500]"
          :total="dataTotal"
          :page-size="where.limit"
          :current-page="where.start"
          @size-change="sizeChangeHandler"
          @current-change="currentChangeHandler"
          @prev-click="prevClickHandler"
          @next-click="nextClickHandler"
        ></el-pagination>
      </div>
    </div>
    <pso-skeleton v-else :lines="5"></pso-skeleton>
    <pso-drawer
      size="40%"
      :visible="showFormViewer"
      :title="cfg.data_name"
      @close="showFormViewer=false"
    >
      <div class="pso-formTable-formViewer" v-if="cfg.data_code">
        <pso-form-view
          ref="formImage"
          :form-entity="cfg"
          :data-id="dataId"
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
import PsoDatafilter from "../data-filter/index";
import shortid from "shortid";
import FormStore from "../form-designer/model/store.js";

export default {
  components: { PsoFormView: () => import("../form-interpreter/index"), PsoDatafilter },
  props: {
    cfgId: String,
    autoSubmit: {
      type: Boolean,
      default: true
    },
    columnFilter: Array,
    addBtnText: {
      type: String,
      default: "新增"
    },
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
      default: false
    },
    readOnly: {
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
    }
  },
  data() {
    return {
      loadingTable: false,
      initializing: false,
      showFormViewer: false,
      cfg: {
        data_code: "",
        data_config: []
      },
      showFields: [],
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
      where: {
        limit: 30,
        start: 1
      },
      dataTotal: 0,
      selectedList: [],
      store: null,
      backup: []
    };
  },
  computed: {
    showFieldsReal() {
      return this.showFields.filter(
        item => item._showColumn && (this.columnFilter ? this.columnFilter.indexOf(item._fieldValue) === -1 : true)
      );
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
    where: {
      deep: true,
      handler() {
        this.getFormData();
      }
    }
  },
  created() {
    this.getFormCfg();
  },
  methods: {
    async getFormCfg() {
      this.initializing = true;
      const ret = await this.API.formsCfg({ data: { id: this.cfgId }, method: "get" });
      if (!ret.success) return;
      this.store = new FormStore(ret.data);
      ret.data.data_config = JSON.parse(ret.data.data_design);
      this.cfg = Object.assign({}, this.cfg, ret.data);
      this.initializing = false;
      this.conditionOptions = this.store.search({
        options: { db: true },
        onlyMain: true,
        onlyData: true,
        beforePush: item => {
          item.data.displayName = `[${item.CPNT.name}]${item.data._fieldName}`;
          return true;
        }
      });
      this.showFields = this.store.search({
        options: { table_show: true },
        onlyMain: true,
        onlyData: true,
        beforePush: item => {
          this.$set(item.data, "_showColumn", true);
          return true;
        }
      });
      await this.getFormData();
    },
    async getFormData() {
      this.loadingTable = true;
      const ret = await this.API.form({
        data: {
          form_code: this.cfg.data_code,
          limit: this.where.limit,
          start: this.where.start - 1
        },
        method: "get"
      });

      if (this.dataPovider) {
        await this.dataPovider(ret.data);
      }
      this.loadingTable = false;
      this.backup = ret.data;
      this.formData = ret.data;
      this.dataTotal = ret.total;
      this.$emit("data-loaded");
    },
    sizeChangeHandler(size) {
      this.where.limit = size;
    },
    currentChangeHandler(page) {
      this.where.start = page;
    },
    prevClickHandler() {
      this.where.start -= 1;
    },
    nextClickHandler() {
      this.where.start += 1;
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
      this.showFormViewer = true;
    },
    newData() {
      this.dataId = "";
      this.showFormViewer = true;
    },
    async deleteForm(leaf_id) {
      this.loadingTable = true;
      const ret = await this.API.form({
        data: { leaf_id, datacode: this.store.data_code, dataArr: [{ optype: 2, leaf_id }] },
        method: "delete"
      });
      this.$notify({ title: "删除成功", type: "success" });
      this.reload();
      this.loadingTable = false;
    },
    startSave() {
      this.saving = true;
    },
    savedForm() {
      this.showFormViewer = false;
      this.saving = false;
      this.$notify({ title: "添加成功", type: "success" });
      this.getFormData();
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
      let formData;
      const leaf_id = this.dataId || shortid.generate();
      try {
        formData = await this.$refs.formImage.makeData();
      } catch (error) {
        return null;
      }
      if (this.autoSubmit) {
        this.startSave();
        let ret = await this.API.form({ data: { leaf_id, formData }, method: "put" });
        this.savedForm();
      } else {
        this.$emit("submit", { leaf_id: this.dataId, formData });
      }
    }
  }
};
</script>
<style lang="less">
.pso-formTable-formViewer {
  padding: 15px;
}
</style>
<style lang="less" scoped>
@deep: ~">>>";
@{deep} {
  .el-table::before {
    background-color: transparent;
  }
  .pso-drawer-footer__body {
    text-align: right;
  }
}
.pso-formTable__filter {
  position: relative;
  .pso-formTable__filter-body {
    max-height: 400px;
    overflow: scroll;
    padding-bottom: 30px;
  }
  .pso-formTable__filter-footer {
    position: absolute;
    text-align: right;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
  }
}
.pso-formTable__setting {
  max-height: 500px;
  overflow: scroll;
  .pso-formTable__setting-item {
    & + .pso-formTable__setting-item {
      margin-top: 15px;
    }
  }
  @{deep} {
    .el-switch {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
.pso-formTable {
  padding: 10px;
  height: 100%;
  width: 100%;
  background-color: #f7f7f7;

  .pso-formTable-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 5px 10px;
    border-bottom: 1px solid #ebeef5;
    .pso-formTable-header__left {
      flex: 1;
      @{deep} {
        .el-input {
          width: 150px;
        }
      }
    }
  }
  .pso-formTable-footer {
    padding: 10px 5px;
    background-color: #fff;
  }
}
</style>

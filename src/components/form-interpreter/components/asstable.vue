<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required" v-loading="loading">
    <div class="pso-form-asstable-table">
      <el-table
        ref="table"
        border
        v-loading="loadingTable"
        :data="proxy.valList"
        style="width: 100%"
        size="mini"
        max-height="500"
        @row-click="instanceClick"
        @selection-change="handleSelectionChange"
        v-show="proxy.valList.length"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          :prop="tableField._fieldValue"
          :label="tableField._fieldName"
          v-for="(tableField) of showFields"
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
      </el-table>
    </div>
    <el-button
      type="primary"
      plain
      icon="el-icon-plus"
      size="small"
      @click="handleClickAdd"
    >添加{{cpnt.data._fieldName}}</el-button>
    <el-button
      v-show="selectedList.length"
      type="danger"
      icon="el-icon-delete"
      size="small"
      @click="handleDelList(selectedList)"
    >取消所选关联数据</el-button>
    <el-dialog
      width="70%"
      append-to-body
      close-on-click-modal
      custom-class="form-table-dialog"
      title="选择关联数据"
      @close="showTable=false"
      :visible="showTable"
    >
      <pso-form-table
        :cfgId="cpnt.data._option"
        checkbox
        :deletable="deletable"
        :operate="deletable"
        :selection-type="selectionType"
        :addable="cpnt.data._new"
        :edtail-editable="false"
        @selection-confirm="handleAddSelection"
      ></pso-form-table>
    </el-dialog>
    <pso-drawer
      size="40%"
      :visible="showFormViewer"
      :title="store.data_name"
      @close="showFormViewer=false"
    >
      <div class="pso-formTable-formViewer" v-if="store.data_code">
        <pso-form-interpreter
          ref="formImage"
          :form-id="store.data_id"
          :data-id="dataId"
          :editable="!dataId"
        ></pso-form-interpreter>
      </div>
      <template v-slot:footer>
        <div class="pso-drawer-footer__body">
          <el-button
            v-if="dataId"
            type="danger"
            size="small"
            @click="handleDeleteForm"
            :disabled="deletingFrom"
            :loading="deletingFrom"
          >删除</el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleSaveForm"
            :disabled="savingFrom"
            :loading="savingFrom"
          >保存</el-button>
        </div>
      </template>
    </pso-drawer>
  </el-form-item>
</template> 
<script>
import PsoFormTable from "../../form-table";
import { pickerMixin } from "../../../mixin/picker";
import cpntMixin from "../mixin";
import FormStore from "../../form-designer/model/store.js";
import shortid from "shortid";

export default {
  components: { PsoFormInterpreter: () => import("../index"), PsoFormTable },
  mixins: [
    cpntMixin,
    pickerMixin({
      baseObjName: "proxy",
      showName: "showTable",
      dataListName: "valList",
      typeName: "_type",
      idName: "leaf_id",
      radioVal: 1,
      checkboxVal: 2
    })
  ],
  props: {
    deletable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      showTable: false,
      selecedList: [],
      loadingTable: false,
      savingFrom: false,
      deletingFrom: false,
      store: {},
      proxy: {
        valList: [],
        _type: this.cpnt.data._type
      },
      showFormViewer: false,
      dataId: "",
      selectedList: []
    };
  },
  computed: {
    selectionType() {
      return this.cpnt.data._type === 1 ? "radio" : "checkbox";
    },
    showFields() {
      return this.store.search
        ? this.store.search({
            options: { table_show: true },
            onlyData: true,
            beforePush: item => !item.parent.CPNT.host_db
          })
        : [];
    }
  },
  watch: {
    "proxy.valList"(val) {
      this.cpnt.data._val = _.map(val, "leaf_id").join(",");
      this.dispatch("PsoformInterpreter", "asstable-selected", { cpnt: this.cpnt, data: val, store: this.store });
    },
    "cpnt.data._type": {
      handler(val) {
        this.proxy._type = val;
      }
    }
  },
  async created() {
    await this.getFormCfg();
    if (this.cpnt.data._val && typeof this.cpnt.data._val === "string") {
      const list = [];
      this.loading = true;
      for (let id of this.cpnt.data._val.split(",")) {
        const ret = await this.getFormData(id);
        if (ret && ret.leaf_id) list.push(ret);
      }
      this.proxy.valList = list;
      this.loading = false;
    }
  },
  methods: {
    async getFormCfg() {
      this.loading = true;
      const ret = await this.API.formsCfg({ data: { id: this.cpnt.data._option }, method: "get" });
      ret.data.data.data_id = this.cpnt.data._option;
      this.store = new FormStore(ret.data.data);
      this.loading = false;
    },
    async getFormData(value) {
      this.loadingTable = true;
      const ret = await this.API.formSearch({
        form_code: this.store.data_code,
        limit: 9999,
        start: 0,
        keys: {
          leaf_id: {
            type: 2,
            value
          }
        }
      });
      this.loadingTable = false;
      return ret.data[0];
    },
    instanceClick(row) {
      this.dataId = row.leaf_id;
      this.showFormViewer = true;
    },
    handleSelectionChange(data) {
      this.selectedList = data;
    },
    handleClickAdd() {
      if (this.cpnt.data._relate) {
        this.showTable = true;
      } else if (this.cpnt.data._new) {
        this.dataId = "";
        this.showFormViewer = true;
      }
    },
    async handleSaveForm() {
      const leaf_id = this.dataId || shortid.generate();
      try {
        const formData = await this.$refs.formImage.makeData();
        this.savingFrom = true;
        const ret = await this.API.form({ data: { leaf_id, formData }, method: "put" });
        if (ret.success) {
          this.$notify({ title: "保存成功", type: "success" });
          if (this.dataId) {
            const index = _.findIndex(proxy.valList, { leaf_id });
            this.proxy.valList.splice(index, 1, formData.dataArr[0]);
          } else {
            this.proxy.valList.push(formData.dataArr[0]);
          }
        }
        this.savingFrom = false;
      } catch (error) {}
      this.showFormViewer = false;
    },
    async handleDeleteForm() {
      this.deletingFrom = true;
      const leaf_id = this.dataId;
      const ret = await this.API.form({
        data: { leaf_id, data_code: this.store.data_code, dataArr: [{ optype: 2, leaf_id }] },
        method: "delete"
      });
      if (ret.success) {
        this.$notify({ title: "删除成功", type: "success" });
      }
      this.deletingFrom = false;
      this.showFormViewer = false;
    }
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
.pso-form-asstable {
  background-color: #f7f7f7;
}
.pso-form-asstable-table {
  margin-bottom: 5px;
}
</style>
<style lang="less">
.form-table-dialog {
  .el-dialog__body {
    padding: 0;
  }
}
</style>
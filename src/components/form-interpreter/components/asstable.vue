<template>
  <el-form-item
    :label="cpnt.data._fieldName"
    :required="cpnt.data._required"
    v-loading="initializing||loading"
  >
    <div class="pso-ip__ast" v-if="!initializing">
      <div class="pso-ip__ast-btns" style="margin-bottom:5px" v-if="cpntEditable">
        <el-button
          v-if="cpnt.data._relate"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="showTable=true"
        >选择{{cpnt.data._fieldName}}</el-button>
        <el-button
          v-if="cpnt.data._new"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleClickAdd"
        >添加{{cpnt.data._fieldName}}</el-button>
        <el-button
          v-show="selectedList.length"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="handleDelList(selectedList)"
        >取消所选关联数据</el-button>
      </div>
      <div class="pso-form-asstable-table">
        <el-tag
          v-if="selectionType==='radio'&&proxy.valList.length"
          :closable="cpntEditable"
          @close="handleDelList(proxy.valList)"
        >{{proxy.valList[0][`${cpnt.data._radioField}_x`]||proxy.valList[0][cpnt.data._radioField||'leaf_id']}}</el-tag>
        <el-table
          v-if="selectionType==='checkbox'"
          ref="table"
          border
          v-loading="loadingTable"
          :data="proxy.valList"
          style="width: 100%"
          size="mini"
          max-height="500"
          @row-click="instanceClick"
          @selection-change="handleSelectionChange"
        >
          <template #default>
            <el-table-column
              v-if="cpntEditable"
              type="selection"
              width="40"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              type="index"
              label="序号"
              :index="1"
              width="50"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              resizable
              show-overflow-tooltip
              min-width="120"
              v-for="field of showFieldsReal"
              :prop="field.field_name"
              :label="field.display"
              :key="field.field_name"
              :width="field.width"
              :align="field.align"
              header-align="center"
            >
              <template slot-scope="scope">
                <span>{{getTrueVal(scope.row,field)}}</span>
              </template>
            </el-table-column>
          </template>
          <template #empty>
            <pso-empty></pso-empty>
          </template>
        </el-table>
      </div>
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
          :deletable="false"
          :selection-type="selectionType"
          :view-auth="formTableViewAuth"
          :addable="false"
          :edtail-editable="false"
          selectable
          :changable="false"
          :stageable="false"
          :params="formTableCfg"
          :def-keys="devKeysCfg"
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
            :form-id="store.data_code"
            :data-id="dataId"
            :data-default="defForm"
            :editable="cpntEditable"
            :mock-asstables="unsavedSelf"
          ></pso-form-interpreter>
        </div>
        <template v-slot:footer>
          <div class="pso-drawer-footer__body" v-if="cpntEditable">
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
    </div>
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
      checkboxVal: 2,
    }),
  ],
  props: {
    deletable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    this.clearDefFormOnClose = false;
    return {
      initializing: true,
      loading: false,
      showTable: false,
      selecedList: [],
      loadingTable: false,
      savingFrom: false,
      deletingFrom: false,
      store: {},
      proxy: {
        valList: [],
        _type: this.cpnt.data._type,
      },
      showFormViewer: false,
      dataId: "",
      selectedList: [],
      fields: [],
      defForm: null,
      unsavedSelf: null,
      subAsstables: [],
      addDataCallback: null,
    };
  },
  computed: {
    selectionType() {
      return this.cpnt.data._type === 1 ? "radio" : "checkbox";
    },
    showFieldsReal() {
      return this.fields.filter((item) => item.using === "1" && item.show === "1");
    },
    authCfg() {
      if (this.cpnt.store && this.cpnt.store.sub_config) {
        return _.find(this.cpnt.store.sub_config, { id: this.cpnt.data._fieldValue }) || {};
      }
      return {};
    },
    formTableViewAuth() {
      if (this.authCfg.authable) {
        return this.cpnt.data.__auth__ || 0;
      } else {
        return 4;
      }
    },
    devKeysCfg() {
      const params = [];
      if (this.authCfg.status && this.authCfg.status.length) {
        params.push(`d_status#${this.authCfg.status.join(",")}#4`);
      }
      if (this.cpnt.data._filter) {
        this.cpnt.data._filter.forEach((f) => {
          if (f.value || f.sid) {
            let value = f.value;
            if (f.sid) {
              const source = this.cpnt.store.searchByField(f.sid);
              if (source && source.data._val) {
                value = source.data._val;
              }
            }
            if (value) {
              params.push(`${f.tid}#${value}#${f.op}`);
            }
          }
        });
      }
      return params.join(";");
    },
    formTableCfg() {
      return {
        searchType: this.authCfg.searchType,
        auth_config: this.authCfg.authCfg,
      };
    },
  },
  watch: {
    "proxy.valList"(val) {
      this.cpnt.data._val = _.map(val, "leaf_id").join(",");
      this.dispatch("PsoformInterpreter", "asstable-selected", { cpnt: this.cpnt, data: val, store: this.store });
    },
    "cpnt.data._type": {
      handler(val) {
        this.proxy._type = val;
      },
    },
    showFormViewer(val) {
      if (!val && this.clearDefFormOnClose) {
        this.defForm = null;
      }
    },
  },
  async created() {
    await this.getFormCfg();
    if (this.cpnt.data._val && typeof this.cpnt.data._val === "string") {
      await this.setDataByIds(this.cpnt.data._val.split(","));
    } else {
      if (this.cpnt.store && this.cpnt.store.mockAsstables && this.cpnt.store.mockAsstables[this.cpnt.data._fieldValue]) {
        this.handleAddSelection([this.cpnt.store.mockAsstables[this.cpnt.data._fieldValue]]);
      } else {
        this.proxy.valList = [];
      }
    }
    this.dispatch("PsoformInterpreter", "asstable-initialized", {
      cpnt: this.cpnt,
      data: this.cpnt.data._val,
      proxy: this.proxy,
      fields: this.fields,
    });
  },
  methods: {
    async setDataByIds(idList) {
      this.loading = true;
      const list = [];
      for (let id of idList) {
        const ret = await this.getFormData(id);
        if (ret && ret.leaf_id) list.push(ret);
      }
      this.handleAddSelection(list);
      this.loading = false;
    },
    async getFormCfg() {
      this.initializing = true;
      const ret = await this.API.formsCfg({ data: { id: this.cpnt.data._option }, method: "get" });
      this.store = new FormStore(ret.data);
      this.fields = [];
      if (ret.data.display_columns && typeof ret.data.display_columns === "string") {
        const columns = JSON.parse(ret.data.display_columns).column;
        let targetColumn = columns[0].data;
        if (this.cpnt.data._showFields) {
          const exist = _.find(columns, { name: this.cpnt.data._showFields });
          if (exist) targetColumn = exist.data;
        }
        targetColumn.forEach((item) => {
          const exist = this.store.searchByField(item.field_name);
          if (exist) {
            Object.assign(item, exist.data);
          } else {
            item.fid = item.fid || item.field_name;
          }
          this.fields.push(item);
        });
      }

      if (!this.fields.length) {
        this.fields = this.store.search({
          options: { table_show: true },
          onlyMain: true,
          onlyData: true,
          beforePush: (item) => {
            this.$set(item.data, "display", item.data._fieldName);
            this.$set(item.data, "field_name", item.data._fieldValue);
            this.$set(item.data, "show", "1");
            return true;
          },
        });
      }

      this.fields = _.orderBy(this.fields, ["number"], ["asc"]);

      if (this.cpnt.store) {
        this.subAsstables = this.store.search({
          options: { componentid: "asstable" },
          onlyMain: true,
          onlyData: true,
          beforePush: (item) => {
            return item.data._option === this.cpnt.store.data_code;
          },
        });

        if (this.subAsstables.length) {
          if (this.cpnt.store.instance_id) {
            this.defForm = { [this.subAsstables[0]._fieldValue]: this.cpnt.store.instance_id };
          }
        }
      }

      this.initializing = false;
    },
    async getFormData(value) {
      this.loadingTable = true;
      const ret = await this.API.formSearch({
        form_code: this.store.data_code,
        limit: 9999,
        start: 0,
        leaf_auth: 4,
        keys: {
          leaf_id: {
            type: 1,
            value,
          },
        },
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
    getVal(val) {
      return _.isNull(val) ? "" : val;
    },
    getTrueVal(d, f) {
      if ((f.componentid === "select" || f.componentid === "checkbox") && f._option) {
        const opt = _.find(f._option, { _optionValue: d[f.field_name] });
        if (opt) {
          return opt._optionName;
        }
      }
      return this.getVal(d[f.field_name]);
    },
    handleSelect() {
      this.showTable = true;
    },
    handleClickAdd(callback) {
      this.dataId = "";

      if (typeof callback === "function") {
        this.addDataCallback = callback;
      } else {
        this.addDataCallback = null;
      }

      if (this.subAsstables.length) {
        if (!this.cpnt.store.instance_id) {
          const data = { leaf_id: this.cpnt.store.beInstanceId };
          for (let cpnt of Object.values(this.cpnt.store.cpntsMap)) {
            if (cpnt.CPNT.layout || cpnt.componentid === "stage") continue;
            data[cpnt.data._fieldValue] = cpnt.data._val;
          }
          this.unsavedSelf = { [this.subAsstables[0]._fieldValue]: data };
        }
      } else {
        this.unsavedSelf = null;
      }

      this.showFormViewer = true;
    },
    async handleSaveForm() {
      const leaf_id = this.dataId || shortid.generate();
      try {
        const formData = await this.$refs.formImage.makeData();
        this.savingFrom = true;
        const ret = await this.API.form({ data: { leaf_id, formData }, method: "put" });
        if (ret.success) {
          this.$notify({ title: "保存成功", type: "success" });
          let data;
          if (this.dataId) {
            data = await this.getFormData(this.dataId);
            this.proxy.valList.splice(_.findIndex(this.proxy.valList, { leaf_id }), 1);
          } else {
            data = await this.getFormData(ret.data.data);
            //新增数据回调
            this.addDataCallback && this.addDataCallback(data);
          }
          this.handleAddSelection([data]);
        }
        this.savingFrom = false;
        this.showFormViewer = false;
      } catch (error) {
        console.log(error);
      }
    },
    async handleDeleteForm() {
      this.deletingFrom = true;
      const leaf_id = this.dataId;
      const ret = await this.API.form({
        data: { leaf_id, data_code: this.store.data_code, dataArr: [{ optype: 2, leaf_id }] },
        method: "delete",
      });
      if (ret.success) {
        this.proxy.valList.splice(_.findIndex(this.proxy.valList, { leaf_id }), 1);
        this.$notify({ title: "删除成功", type: "success" });
      }
      this.deletingFrom = false;
      this.showFormViewer = false;
    },
    setDefForm(data, clearOnClose = true) {
      //一般用于外部强制设定表单数据
      this.defForm = data;
      this.clearDefFormOnClose = clearOnClose;
    },
  },
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
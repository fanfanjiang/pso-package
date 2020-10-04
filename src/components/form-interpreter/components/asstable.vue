<template>
  <pso-label :cpnt="cpnt" v-loading="initializing || loading">
    <div class="pso-ip__ast" v-if="!initializing">
      <div class="pso-ip__ast-btns" style="margin-bottom: 5px" v-if="cpntEditable">
        <el-button v-if="cpnt.data._relate" type="primary" plain icon="el-icon-plus" size="mini" @click="showTable = true"
          >选择{{ cpnt.data._fieldName }}</el-button
        >
        <el-button v-if="cpnt.data._new" type="primary" plain icon="el-icon-plus" size="mini" @click="handleClickAdd"
          >添加{{ cpnt.data._fieldName }}</el-button
        >
        <transition name="el-zoom-in-center">
          <el-button
            v-show="!justShowOne && selectedList.length"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelList(selectedList)"
            >取消所选数据</el-button
          >
        </transition>
      </div>
      <div class="pso-form-asstable-table">
        <el-tag
          v-if="justShowOne && instances.length"
          :closable="cpntEditable"
          @click="astStore.showInstance.call(astStore, instances[0])"
          @close="handleDelList(instances)"
          >{{ firstInstanceDisplay }}
        </el-tag>
        <view-table
          v-if="!justShowOne"
          :store="astStore"
          :params="tableParams"
          :dragable="false"
          :pagination="false"
          :refresh="false"
        ></view-table>
      </div>
      <pso-dialog
        width="70%"
        append-to-body
        close-on-click-modal
        custom-class="form-table-dialog"
        title="选择关联数据"
        @close="showTable = false"
        :visible="showTable"
      >
        <pso-form-view
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
          table-max-height="400px"
          @selection-confirm="handleAddSelection"
        ></pso-form-view>
      </pso-dialog>
      <pso-form-executor
        :params="executorParams"
        :title="store.data_name"
        :opener="astStore"
        :instanceids="astStore.instanceids"
        :keepable="false"
        @data-changed="dataChangeHandler"
        @prev="astStore.showPrev.call(astStore, $event)"
        @next="astStore.showNext.call(astStore, $event)"
      ></pso-form-executor>
    </div>
  </pso-label>
</template> 
<script>
import { pickerMixin } from "../../../mixin/picker";
import cpntMixin from "../mixin";
import FormStore from "../../form-designer/model/store.js";
import shortid from "shortid";

import ASTStore from "../astStore";
import ViewTable from "../../form-view/table";

export default {
  components: { PsoFormInterpreter: () => import("../index"), ViewTable },
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
      astStore: null,
      store: {},
      proxy: {
        valList: [],
        _type: this.cpnt.data._type,
      },
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
    justShowOne() {
      return this.selectionType === "radio";
    },
    instances() {
      return this.astStore.instances;
    },
    selectedList() {
      return this.astStore.selectedList;
    },
    dataId() {
      return this.astStore.dataId;
    },
    firstInstanceDisplay() {
      if (this.instances.length) {
        const data = this.instances[0];
        const field = this.cpnt.data._radioField;
        return data[`${field}_x`] || data[field || "leaf_id"];
      }
    },
    tableParams() {
      return {
        selectionType: this.selectionType,
        modifiable: this.cpntEditable,
        checkbox: this.cpntEditable,
        tableSize: "small",
      };
    },
    executorParams() {
      return {
        formId: this.astStore.store.data_code,
        dataId: this.astStore.dataId,
        dataDefault: this.defForm,
        editable: this.cpntEditable,
        mockAsstables: this.unsavedSelf,
      };
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
              } else {
                value = this.cpnt.store.instance[f.sid];
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
    "proxy.valList"(data) {
      this.astStore.instances = data;
      this.cpnt.data._val = _.map(data, "leaf_id").join(",");
      this.dispatch("PsoformInterpreter", "asstable-selected", { cpnt: this.cpnt, data, store: this.store });
    },
    "cpnt.data._type": {
      handler(val) {
        this.proxy._type = val;
      },
    },
    "astStore.showExecutor"(val) {
      if (!val && this.clearDefFormOnClose) {
        this.defForm = null;
      }
    },
  },
  async created() {
    await this.initialize();

    //初始赋值
    if (this.cpnt.data._val && typeof this.cpnt.data._val === "string") {
      await this.setDataByIds(this.cpnt.data._val.split(","));
    } else {
      if (this.cpnt.store && this.cpnt.store.mockAsstables && this.cpnt.store.mockAsstables[this.cpnt.data._fieldValue]) {
        this.handleAddSelection([this.cpnt.store.mockAsstables[this.cpnt.data._fieldValue]]);
      } else {
        this.proxy.valList = [];
      }
    }

    this.cpnt._handleClickAdd = this.handleClickAdd;
    this.cpnt._setDefForm = this.setDefForm;

    this.dispatch("PsoformInterpreter", "asstable-initialized", {
      cpnt: this.cpnt,
      data: this.cpnt.data._val,
      value: this.cpnt.data._val,
      proxy: this.proxy,
      fields: this.fields,
      store: this.store,
    });

    this.$on("data-changed", async (evt) => {
      this.astStore.dataId = evt.leaf_id;
      await this.dataChangeHandler(evt);
      this.astStore.dataId = "";
    });
  },
  methods: {
    async initialize() {
      this.initializing = true;
      if (!this.cpnt.data._option) return;

      const ret = await this.API.formsCfg({ data: { id: this.cpnt.data._option }, method: "get" });

      this.astStore = new ASTStore({ $vue: this, limit: 10 });
      this.astStore.analyzeFormCfg(ret.data, this.cpnt.data._showFields);
      this.store = this.astStore.store;

      if (this.cpnt.store) {
        this.subAsstables = this.astStore.store.search({
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
    async setDataByIds(idList) {
      this.loading = true;
      const list = [];
      for (let id of idList) {
        const data = await this.astStore.findById(id);
        if (data) list.push(data);
      }
      this.handleAddSelection(list);
      this.loading = false;
    },
    handleClickAdd(callback) {
      //设置数据修改回调
      this.addDataCallback = typeof callback === "function" ? callback : null;

      //设置提前数据
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

      this.astStore.newInstance();
    },
    async dataChangeHandler({ leaf_id, op, formData }) {
      if (op === 1 || op === 2) {
        let data;
        if (this.dataId) {
          data = await this.astStore.findById(this.dataId);
          data && this.proxy.valList.splice(_.findIndex(this.proxy.valList, { leaf_id }), 1);
        } else {
          data = await this.astStore.findById(leaf_id);
          //新增数据回调
          data && this.addDataCallback && this.addDataCallback(data);
        }
        if (data) {
          this.handleAddSelection([data]);
        }
      } else if (op === 3) {
        this.proxy.valList.splice(_.findIndex(this.proxy.valList, { leaf_id }), 1);
      }
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
<template>
  <div>
    <common-panel :cpnt="cpnt" info="关联相关工作表，可以从中引用或创建记录，如：订单关联商品" :needDefaultValue="false">
      <el-form-item label="选择工作表" v-loading="loading">
        <el-select size="mini" v-model="cpnt.data._option" filterable placeholder="请选择" @change="formChangeHandler">
          <el-option v-for="item in options" :key="item.node_name" :label="item.node_display" :value="item.node_name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联方式">
        <el-radio v-model="cpnt.data._type" :label="1">单条</el-radio>
        <el-radio v-model="cpnt.data._type" :label="2">多条</el-radio>
      </el-form-item>
      <el-form-item label="展示方式">
        <el-radio v-model="cpnt.data._displayType" label="1" :disabled="cpnt.data._type === 2">标签</el-radio>
        <el-radio v-model="cpnt.data._displayType" label="2">列表</el-radio>
      </el-form-item>
      <el-form-item label="选择显示列表" v-loading="loading">
        <el-select clearable size="mini" v-model="cpnt.data._showFields" placeholder="请选择">
          <el-option v-for="item in column" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="cpnt.data._type === 1" label="选择单选显示字段" v-loading="loading">
        <el-select size="mini" v-model="cpnt.data._radioField" placeholder="请选择">
          <el-option
            v-for="item in cpnt.cache.fieldOptions"
            :key="item._fieldValue"
            :label="item._fieldName"
            :value="item._fieldValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设置">
        <div class="act-panel_check">
          <el-switch size="mini" v-model="cpnt.data._new" active-text="允许新增关联数据"></el-switch>
          <el-tooltip effect="dark" placement="top-start">
            <div slot="content">允许新增关联数据</div>
            <i class="tip el-icon-question"></i>
          </el-tooltip>
        </div>
        <div class="act-panel_check">
          <el-switch size="mini" v-model="cpnt.data._relate" active-text="允许关联已有数据"></el-switch>
          <el-tooltip effect="dark" placement="top-start">
            <div slot="content">允许关联已有数据</div>
            <i class="tip el-icon-question"></i>
          </el-tooltip>
        </div>
      </el-form-item>
      <el-button v-if="cpnt.data._relate" icon="el-icon-plus" plain size="mini" @click="showDialog = true">筛选</el-button>
    </common-panel>
    <el-dialog title="设置筛选条件" append-to-body :visible.sync="showDialog" width="40%">
      <dynamic-filter :targets="filterFields" :sources="selfCpnts" v-model="cpnt.data._filter"></dynamic-filter>
    </el-dialog>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";
import { genComponentData } from "../helper";
import FormStore from "../../form-designer/model/store.js";
import DynamicFilter from "../../dynamic-filter";
import { makeSysFormFields } from "../../../tool/form";

export default {
  props: ["cpnt"],
  components: {
    commonPanel,
    DynamicFilter,
  },
  data() {
    this.column = [];
    return {
      options: [],
      loading: false,
      showDialog: false,
      sysFields: [],
      filterFields: [],
    };
  },
  computed: {
    selfCpnts() {
      return this.cpnt.store.search({ options: { db: true }, onlyData: true }).concat(this.sysFields);
    },
  },
  watch: {
    "cpnt.data._type"(type) {
      this.cpnt.cache.defaultEl._type = type;
    },
  },
  created() {
    this.sysFields = makeSysFormFields();
    this.getFormList();
    this.setCache();
    if (this.cpnt.data._option) this.formChangeHandler(this.cpnt.data._option, true);
  },
  beforeUpdate() {
    this.setCache();
  },
  methods: {
    setCache() {
      if (!this.cpnt.cache.defaultEl) {
        this.$set(this.cpnt.cache, "fieldOptions", []);

        this.$set(
          this.cpnt.cache,
          "defaultEl",
          genComponentData({
            componentid: this.cpnt.componentid,
            _type: this.cpnt.data._type,
            _option: this.cpnt.data._option,
            _fieldName: "设置默认关联",
            _required: false,
            _val: "",
            _relate: this.cpnt.data._relate,
            _new: this.cpnt.data._new,
          })
        );

        this.$watch(`cpnt.cache.defaultEl._val`, (val) => {
          this.cpnt.data._defaultValue = val;
        });

        this.$watch(`cpnt.data._relate`, (val) => {
          this.cpnt.cache.defaultEl._relate = val;
        });

        this.$watch(`cpnt.data._new`, (val) => {
          this.cpnt.cache.defaultEl._new = val;
        });
      }
    },
    async getFormList() {
      this.loading = true;
      this.options = await this.API.getFormTree();

      this.loading = false;
    },
    async formChangeHandler(id, notReset = false) {
      this.loading = true;

      this.cpnt.cache.defaultEl._option = "";
      this.cpnt.data._outputFormat = id;

      const ret = await this.API.formsCfg({ data: { id }, method: "get" });

      const store = new FormStore(ret.data);

      if (ret.data.display_columns && typeof ret.data.display_columns === "string") {
        this.column = JSON.parse(ret.data.display_columns).column;
      } else {
        this.column = [];
      }

      this.cpnt.cache.fieldOptions = store.search({
        options: { table_show: true },
        onlyData: true,
        beforePush: (item) => {
          item.data.fieldDisplay = `[${store.data_name}]${item.data._fieldName}`;
          return !item.parent.CPNT.host_db;
        },
      });

      this.filterFields = [].concat(this.cpnt.cache.fieldOptions, this.sysFields);

      this.cpnt.cache.defaultEl._option = id;

      this.loading = false;
    },
  },
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
.act-panel_check {
  .tip {
    margin-left: 5px;
    color: #999;
  }
}
@{deep} {
  .el-form-item__label {
    line-height: 20px;
    color: #000;
  }
  .el-select {
    width: 100%;
  }
}
</style>
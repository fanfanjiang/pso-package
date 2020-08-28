<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <template v-if="cpnt.data._type === '2'&&cpntEditable">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="showTable=true"
      >选择{{cpnt.data._fieldName}}</el-button>
      <el-button
        v-show="selected.length"
        type="danger"
        icon="el-icon-delete"
        size="mini"
        @click="handleDelList(selected)"
      >取消所选数据</el-button>
    </template>
    <el-table
      v-show="proxy.valList.length"
      border
      :data="proxy.valList"
      size="mini"
      style="width: 100%"
      max-height="500"
      @selection-change="handleSelectionChange"
    >
      <template #default>
        <el-table-column
          v-if="storeEditable && !cpnt.data._read"
          type="selection"
          width="40"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          resizable
          show-overflow-tooltip
          v-for="f of fieldsShow"
          :key="f.field"
          :prop="f.field"
          :label="f.name"
          :width="f.width"
          :align="f.align"
        >
          <template slot-scope="scope">{{scope.row[f.field]}}</template>
        </el-table-column>
      </template>
      <template #empty>
        <pso-empty></pso-empty>
      </template>
    </el-table>
    <el-dialog
      width="70%"
      append-to-body
      close-on-click-modal
      custom-class="form-table-dialog"
      title="选择数据"
      @close="showTable=false"
      :visible="showTable"
    >
      <pscript-table
        :data="table"
        :fields="fields"
        :condition-options="conditionOptions"
        @selection-confirm="handleAddSelection"
      ></pscript-table>
    </el-dialog>
  </el-form-item>
</template>
<script>
import cpntMixin from "../mixin";
import { genComponentData } from "../../form-designer/helper";
import PscriptTable from "../../pscript-table";
import { pickerMixin } from "../../../mixin/picker";
import debounce from "throttle-debounce/debounce";

export default {
  mixins: [
    cpntMixin,
    pickerMixin({
      baseObjName: "proxy",
      showName: "showTable",
      dataListName: "valList",
      idName: "leaf_id",
    }),
  ],
  components: { PscriptTable },
  data() {
    return {
      initializing: false,
      saved: false,
      showTable: false,
      table: [],
      fields: [],
      conditionOptions: [],
      selected: [],
      proxy: {
        valList: [],
      },
    };
  },
  computed: {
    scriptParams() {
      const params = {};
      for (let fid of this.cpnt.data._option) {
        const cpnt = this.cpnt.store.search({ options: { fid }, onlyData: true });
        if (cpnt) {
          params[cpnt._fieldValue] = cpnt._val;
        }
      }
      return params;
    },
    fieldsShow() {
      return this.fields.filter((item) => item.show === "1");
    },
  },
  watch: {
    "proxy.valList"(val) {
      this.cpnt.data._val = _.map(val, this.cpnt.data._saveField || "leaf_id").join(",");
      if (val.length) {
        this.fillOut(val[0]);
      }
      this.dispatch("PsoformInterpreter", "pscript-selected", { cpnt: this.cpnt, data: val, store: this.store });
    },
    scriptParams: {
      deep: true,
      handler() {
        this.proxy.valList = [];
        this.fetch();
      },
    },
  },
  async created() {
    //列参数
    this.fetch = debounce(500, this.fetchData);

    this.resetPicker({ idName: this.cpnt.data._saveField, reset: false });

    this.fields = _.orderBy(this.cpnt.data._column, ["number"], ["asc"]);
    this.fields.forEach((f) => {
      if (f.searchable === "1") {
        const sItem = { componentid: "text", fid: f.field, _fieldValue: f.field, _fieldName: f.name, displayName: f.name };
        if (f.searchList && f.searchList.length) {
          sItem.componentid = "select";
          sItem._option = f.searchList.map((i) => ({ _optionName: i.n, _optionValue: i.v }));
        }
        this.conditionOptions.push(genComponentData(sItem));
      }
    });

    //已经存储过，不能再修改
    if (this.cpnt.data._saveOnce && this.cpnt.store.instance_id) {
      this.saved = true;
    }

    //开始都请求一次，无论参数有没有值
    await this.fetchData();

    if (this.cpnt.data._val && this.cpnt.data._type === "2") {
      const exist = _.find(this.table, { [this.cpnt.data._saveField]: this.cpnt.data._val });
      if (exist) {
        this.proxy.valList = [exist];
      }
    }
  },
  methods: {
    async fetchData() {
      //获取数据
      this.cpnt.store.storeLoading = true;
      const ret = await this.API.getPscriptData({ script: this.cpnt.data._script, params: this.scriptParams });
      this.cpnt.store.storeLoading = false;
      if (ret.success) {
        this.table = ret.data;

        if (this.cpnt.data._type === "1" && ret.data.length && !this.saved) {
          this.fillOut(ret.data[0]);
        }
      }
    },
    fillOut(data) {
      //填充表单
      //保存本体字段值
      if (this.cpnt.data._saveField) {
        this.cpnt.data._val = data[this.cpnt.data._saveField];
      } else {
        this.cpnt.data._val = 1;
      }

      for (let key in data) {
        const cpnts = this.cpnt.store.search({ options: { db: true }, dataOptions: { _fieldValue: key }, onlyData: true });
        if (cpnts && cpnts.length) {
          cpnts[0]._val = data[key];
        }
      }
    },
    handleSelectionChange(data) {
      this.selected = data;
    },
  },
};
</script>
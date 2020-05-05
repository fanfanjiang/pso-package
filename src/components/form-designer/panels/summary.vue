<template>
  <common-panel :cpnt="cpnt" info="统计关联的记录中的数据。" :needDefaultValue="false">
    <el-form-item label="关联表">
      <el-select v-model="cpnt.data._selectedTable" placeholder="请选择">
        <el-option
          v-for="item in tableOptions"
          :key="item.fid"
          :label="item._fieldName"
          :value="item.fid"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="选择字段">
      <el-select v-model="cpnt.data._selectedField" placeholder="请选择">
        <el-option
          v-for="item in fieldOptions"
          :key="item.fid"
          :label="item._fieldName"
          :value="item.fid"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="选择操作">
      <el-select v-model="cpnt.data._selectedOp" placeholder="请选择">
        <el-option v-for="item in opOtions" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="单位">
      <el-input v-model="cpnt.data._unit"></el-input>
    </el-form-item>
    <el-form-item label="小数点">
      <el-input-number v-model="cpnt.data._decimalPlaces" :min="0" :max="5"></el-input-number>
    </el-form-item>
  </common-panel>
</template>
<script>
import commonPanel from "../common/common-panel";
import { SUMMARY_OP } from "../../../const/form";
import FormStore from "../../form-designer/model/store.js";

export default {
  props: ["cpnt"],
  components: {
    commonPanel
  },
  data() {
    return {
      asstableCaching: false
    };
  },
  computed: {
    tableOptions() {
      const tables = this.cpnt.store.search({ options: { host_db: true }, onlyData: true });
      const asstables = this.cpnt.store.search({
        options: { ass_db: true },
        dataOptions: { _type: 2 },
        onlyData: true,
        beforePush: item => item.data._option
      });
      return tables.concat(asstables);
    },
    fieldOptions() {
      let option = [];
      if (this.cpnt.data._selectedTable) {
        const table = this.cpnt.store.search({ options: { fid: this.cpnt.data._selectedTable } });
        if (table) {
          if (table.CPNT.host_db) {
            option = table.data.children;
          } else if (table.CPNT.ass_db) {
            if (table.cache && table.cache.fieldOptions && table.cache.fieldOptions.length) {
              option = table.cache.fieldOptions;
              this.asstableCaching = false;
            } else {
              this.asstableCaching = true;
            }
          }
        }
      }
      return option;
    },
    opOtions() {
      if (this.cpnt.data._selectedField) {
        let cpnt;
        const table = this.cpnt.store.search({ options: { fid: this.cpnt.data._selectedTable } });
        if (table && this.fieldOptions.length) {
          if (table.CPNT.host_db) {
            cpnt = this.cpnt.store.search({ options: { fid: this.cpnt.data._selectedField }, onlyData: true });
          } else if (table.CPNT.ass_db && this.fieldOptions.length) {
            cpnt = _.find(this.fieldOptions, { fid: this.cpnt.data._selectedField });
          }
          return SUMMARY_OP[cpnt._fieldRealType];
        }
      }
      return [];
    }
  },
  watch: {
    tableOptions: {
      deep: true,
      handler(val, oldval) {
        if (this.cpnt.data._selectedTable) {
          const existed = _.find(val, { fid: this.cpnt.data._selectedTable });
          if (!existed) {
            this.cpnt.data._selectedTable = "";
            this.cpnt.data._selectedField = "";
            this.cpnt.data._selectedOp = "";
          }
        }
      }
    },
    fieldOptions: {
      deep: true,
      handler(val) {
        if (this.cpnt.data._selectedField && !this.asstableCaching) {
          const existed = _.find(val, { fid: this.cpnt.data._selectedField });
          if (!existed) {
            this.cpnt.data._selectedField = "";
            this.cpnt.data._selectedOp = "";
          }
        }
      }
    }
  }
};
</script>

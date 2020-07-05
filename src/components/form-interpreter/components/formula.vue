<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-input size="small" readonly :value="cpnt.data._val" :placeholder="cpnt.data._placeholder"></el-input>
  </el-form-item>
</template>
<script>
import cpntMixin from "../mixin";
import { FORMULA_OP, FORMULA_NUM_TYPE, FORMULA_DATE_TYPE, FORMULA_OP_LIST } from "../../../const/form";
const formulajs = require("@handsontable/formulajs");

export default {
  mixins: [cpntMixin],
  data() {
    return {};
  },
  computed: {
    numProxy() {
      if (this.cpnt.data._type !== 1) return [];
      return this.cpnt.store.search({
        options: { db: true },
        onlyData: true,
        beforePush: item => {
          if (item.fid === this.cpnt.fid) return false;
          if (item.parent.CPNT.host_db) return false;
          if (item.CPNT.componentid === this.cpnt.CPNT.componentid) {
            if (item.data._type === 2 && item.data._dateComputeMode === FORMULA_DATE_TYPE.COMPUTE) return false;
          }
          return true;
        }
      });
    }
  },
  watch: {
    numProxy: {
      deep: true,
      immediate: true,
      handler() {
        this.figure();
      }
    }
  },
  created() {
    Object.keys(formulajs).forEach(key => {
      window[key] = formulajs[key];
    });
  },
  methods: {
    figure() {
      let datasource = this.cpnt.data._datasource;
      this.numProxy.forEach(item => {
        datasource = datasource.replace(new RegExp(`@${item.fid}@`, "g"), item._val);
      });
      try {
        console.log(datasource);
        this.cpnt.data._val = eval(datasource);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
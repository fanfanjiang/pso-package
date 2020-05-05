<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-input readonly :value="cpnt.data._val" :placeholder="cpnt.data._placeholder"></el-input>
  </el-form-item>
</template>
<script>
import cpntMixin from "../mixin";
import { SUMMARY_OP_TYPE } from "../../../const/form";
import Big from "big.js/big.mjs";

export default {
  mixins: [cpntMixin],
  created() {
    this.cpnt.data._val = this.cpnt.data._val || 0;

    this.$on("asstable-selected", ({ cpnt, data, store }) => {
      if (cpnt.fid === this.cpnt.data._selectedTable) {
        if (data.length) {
          this.figure(data, store.search({ options: { fid: this.cpnt.data._selectedField } }).data._fieldValue);
        } else {
          this.cpnt.data._val = 0;
        }
      }
    });
    this.$on("table-selected", ({ cpnt, store }) => {
      const data = cpnt.data._val.dataArr;
      if (cpnt.fid === this.cpnt.data._selectedTable) {
        if (data.length) {
          this.figure(data, store.search({ options: { fid: this.cpnt.data._selectedField } }).data._fieldValue);
        } else {
          this.cpnt.data._val = 0;
        }
      }
    });
  },
  methods: {
    figure(data, field) {
      const op = this.cpnt.data._selectedOp;
      switch (op) {
        case SUMMARY_OP_TYPE.COUNT_FILLED:
          this.cpnt.data._val = data.filter(item => item[field]).length;
          break;
        case SUMMARY_OP_TYPE.COUNT_UNDERFILL:
          this.cpnt.data._val = data.filter(item => typeof item[field] === "undefined" || item[field] === "").length;
          break;
        case SUMMARY_OP_TYPE.MAX:
          this.cpnt.data._val = _.maxBy(data, field)[field];
          break;
        case SUMMARY_OP_TYPE.MIN:
          this.cpnt.data._val = _.minBy(data, field)[field];
          break;
        case SUMMARY_OP_TYPE.FIRST:
          break;
        case SUMMARY_OP_TYPE.LAST:
          break;
      }
      if (op === SUMMARY_OP_TYPE.SUM || op === SUMMARY_OP_TYPE.AVG) {
        this.cpnt.data._val = _.sumBy(data, item => {
          try {
            return Math.floor(item[field]);
          } catch (error) {
            return 0;
          }
        }).toFixed(this.cpnt.data._decimalPlaces || 0);
        if (op === SUMMARY_OP_TYPE.AVG) {
          this.cpnt.data._val = this.cpnt.data._val / data.length;
        }
      }
    }
  }
};
</script>
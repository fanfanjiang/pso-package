<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-input type="text" :disabled="true" :value="transWords"></el-input>
  </el-form-item>
</template>
<script>
const MoneyWords = require("../../../utils/sumInWords");
import cpntMixin from "../mixin";

export default {
  mixins: [cpntMixin],
  computed: {
    transWords() {
      if (this.cpnt.data._option) {
        const target = this.cpnt.store.search({ options: { fid: this.cpnt.data._option }, onlyData: true });
        if (target && target._val) {
          try {
            return (this.cpnt.data._val = MoneyWords.cn.toMoney(target._val));
          } catch (error) {
            return (this.cpnt.data._val = "");
          }
        }
      }
      return (this.cpnt.data._val = "");
    }
  }
};
</script>
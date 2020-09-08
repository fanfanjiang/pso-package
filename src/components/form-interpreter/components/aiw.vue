<template>
  <pso-label :cpnt="cpnt">
    <el-input size="small" type="text" :disabled="true" :value="transWords"></el-input>
  </pso-label>
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
    },
  },
};
</script>
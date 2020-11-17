<template>
  <pso-label :cpnt="cpnt">
    <el-input
      size="small"
      :disabled="!cpnt.store.editable||cpnt.data._read"
      v-model="cpnt.data._val"
      :placeholder="cpnt.data._placeholder"
    ></el-input>
  </pso-label>
</template>
<script>
import cpntMixin from "../mixin";
import { cpntFix } from "../mixins";

export default {
  mixins: [cpntMixin, cpntFix],
  data() {
    return {
      sourceField: "_datasource",
    };
  },
  created() {
    //开始监听
    if (this.cpnt.data._datasource) {
      this.$watch("fixValue", (val) => {
        if (typeof val === "number") {
          val = parseFloat(val).toFixed(this.cpnt.data._decimalPlaces);
        }
        this.cpnt.data._val = val;
      });
      this.startWatch();
    }
  },
};
</script>
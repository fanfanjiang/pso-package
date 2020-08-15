<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <div class="pso-number">
      <el-input-number
        size="small"
        v-model="cpnt.data._val"
        :disabled="!cpnt.store.editable||cpnt.data._read"
        :controls="false"
        :precision="precisionVal"
        :min="min"
      ></el-input-number>
      <span v-if="cpnt.data._unit" class="pso-number-unit">{{cpnt.data._unit}}</span>
    </div>
  </el-form-item>
</template>
<script>
import cpntMixin from "../mixin";
import Big from "big.js/big.mjs";
export default {
  mixins: [cpntMixin],
  props: {
    min: {
      type: Number,
      default: -Infinity,
    },
    max: {
      type: Number,
      default: Infinity,
    },
    precision: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      emitSilent: true,
    };
  },
  computed: {
    minNum() {
      return typeof this.cpnt.data._min === "undefined" ? this.min : this.cpnt.data._min;
    },
    maxNum() {
      return typeof this.cpnt.data._max === "undefined" ? this.max : this.cpnt.data._max;
    },
    precisionVal() {
      return typeof this.cpnt.data._decimalPlaces === "undefined" ? this.precision : this.cpnt.data._decimalPlaces;
    },
  },
  created() {
    this.cpnt.data._val = parseInt(this.cpnt.data._val || 0);
    this.watchCpntVal();
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";

.pso-number {
  position: relative;
  width: fit-content;
  .pso-number-unit {
    position: absolute;
    color: #999;
    padding: 0 5px;
    right: 0;
  }
  @{deep} .el-input {
    > input {
      padding-right: 22px;
      text-align: left;
    }
  }
}
</style>
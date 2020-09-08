<template>
  <pso-label :cpnt="cpnt">
    <div class="pso-number">
      <el-input-number
        ref="cpnt"
        size="small"
        v-model="cpnt.data._val"
        :disabled="!cpnt.store.editable||cpnt.data._read"
        :controls="false"
        :precision="precisionVal"
        :min="minNum"
        :max="maxNum"
      ></el-input-number>
      <span v-if="cpnt.data._unit" class="pso-number-unit">{{cpnt.data._unit}}</span>
    </div>
  </pso-label>
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
      return this.cpnt.data._useRange && typeof this.cpnt.data._min !== "undefined" ? this.cpnt.data._min : this.min;
    },
    maxNum() {
      return this.cpnt.data._useRange && typeof this.cpnt.data._max !== "undefined" ? this.cpnt.data._max : this.max;
    },
    precisionVal() {
      return typeof this.cpnt.data._decimalPlaces === "undefined" ? this.precision : this.cpnt.data._decimalPlaces;
    },
  },
  created() {
    this.cpnt.data._val = parseFloat(this.cpnt.data._val || 0);
    this.watchCpntVal();
  },
  mounted() {
    if (this.cpnt.data._autofocus) {
      this.$refs.cpnt.focus();
    }
  },
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
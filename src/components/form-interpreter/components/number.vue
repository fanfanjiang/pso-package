<template>
  <pso-label :cpnt="cpnt">
    <div class="pso-number">
      <el-input-number
        ref="cpnt"
        size="small"
        v-model="cpnt.data._val"
        :disabled="!cpnt.store.editable || cpnt.data._read"
        :controls="false"
        :precision="precisionVal"
        :min="minNum"
        :max="maxNum"
      ></el-input-number>
      <span v-if="cpnt.data._unit" class="pso-number-unit">{{ cpnt.data._unit }}</span>
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
      return this.getLimitVal("min");
    },
    maxNum() {
      return this.getLimitVal("max");
    },
    precisionVal() {
      return typeof this.cpnt.data._decimalPlaces === "undefined" ? this.precision : this.cpnt.data._decimalPlaces;
    },
  },
  watch: {
    minNum(num) {
      this.checkVal();
    },
    maxNum(num) {
      this.checkVal();
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
  methods: {
    getLimitVal(type) {
      const fieldTypeTarget = this.cpnt.data[`_${type}Field`];
      const numberTypeTarget = this.cpnt.data[`_${type}`];
      const limit = this[type];

      if (this.cpnt.data._useRange) {
        if (fieldTypeTarget) {
          const cpnt = this.cpnt.store.searchByField(fieldTypeTarget, true);
          if (cpnt) {
            return cpnt._val;
          }
        } else if (typeof numberTypeTarget !== "undefined") {
          return numberTypeTarget;
        }
      }
      return limit;
    },
    checkVal() {
      const oldVal = this.cpnt.data._val;
      if (oldVal >= this.maxNum) this.cpnt.data._val = this.max;
      if (oldVal <= this.minNum) this.cpnt.data._val = this.min;
    },
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
<template>
  <pso-label :cpnt="cpnt">
    <div class="pso-number" v-if="show">
      <el-input v-if="shouldDesen" :size="size" :disabled="true" :value="desensitized"></el-input>
      <el-input-number
        v-else
        ref="cpnt"
        :size="size"
        v-model="proxy"
        :disabled="!cpntEditable"
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
import MATH from "../../../utils/math";

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
      show: false,
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
    proxy: {
      get() {
        const { _usePercent } = this.cpnt.data;
        return _usePercent ? MATH.multiply(this.cpnt.data._val, 100) : this.cpnt.data._val;
      },
      set(val) {
        const { _usePercent } = this.cpnt.data;
        this.cpnt.data._val = _usePercent ? MATH.divide(val, 100) : val;
      },
    },
  },
  watch: {
    minNum(num, onum) {
      this.checkVal();
    },
    maxNum(num, onum) {
      this.checkVal();
    },
  },
  created() {
    this.cpnt.data._val = parseFloat(this.cpnt.data._val || 0);
    this.show = true;
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
      let newVal = this.cpnt.data._val;
      if (_.isNumber(this.maxNum) && oldVal >= this.maxNum) newVal = this.maxNum;
      if (_.isNumber(this.minNum) && oldVal <= this.minNum) newVal = this.minNum;
      if (oldVal !== newVal) {
        this.cpnt.data._val = newVal;
      }
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
<template>
  <div class="data-filter" :class="classObj">
    <div class="data-filter__or" v-for="(orCondition,orIndex) in conditionMap" :key="orIndex">
      <el-divider v-if="orIndex!==0&&!fixed" content-position="center">或</el-divider>
      <div class="data-filter__and" v-for="(andCondition,andIndex) in orCondition" :key="andIndex">
        <el-divider v-if="andIndex!==0&&!fixed" content-position="left">且</el-divider>
        <div class="data-filter__picker">
          <pso-datafilteritem :fixed="fixed" :pick="andCondition" :fieldsOptions="fieldsOptions"></pso-datafilteritem>
          <i
            v-if="!fixed"
            class="data-filter__del el-icon-delete-solid"
            @click="delCondition({orIndex,andIndex})"
          ></i>
        </div>
      </div>
      <div class="data-filter__andbtn" v-if="!fixed">
        <el-button
          @click="addCondition(orIndex)"
          size="mini"
          icon="el-icon-plus"
          type="success"
          plain
        >且</el-button>
      </div>
    </div>
    <div class="data-filter__orbtn" v-if="!fixed">
      <el-button
        @click="addCondition()"
        size="mini"
        icon="el-icon-plus"
        type="success"
        plain
      >{{conditionMap.length?'或':'添加筛选条件'}}</el-button>
    </div>
  </div>
</template>
<script>
import PsoDatafilteritem from "./filter";
import { transCMapToCondition } from "../../tool/form";

export default {
  props: {
    value: [String, Array],
    condition: {
      type: Array,
      default: function () {
        return [];
      },
    },
    fieldsOptions: {
      type: Array,
      default: function () {
        return [];
      },
    },
    autoTrans: {
      type: Boolean,
      default: true,
    },
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  components: { PsoDatafilteritem },
  data() {
    return {
      conditionMap: [],
    };
  },
  computed: {
    classObj() {
      return {
        fixed: this.fixed,
      };
    },
  },
  created() {
    this.conditionMap = _.cloneDeep(this.condition);
  },
  watch: {
    conditionMap: {
      deep: true,
      handler(val, oldVal) {
        this.$emit("change", this.autoTrans ? transCMapToCondition(val) : val);
      },
    },
    fieldsOptions: {
      deep: true,
      handler(val, oldVal) {
        this.conditionMap = [];
      },
    },
  },
  methods: {
    addCondition(orIndex) {
      const condition = { cpnt: "", field: "", op: "", data: "", match: "" };
      if (typeof orIndex === "undefined") {
        this.conditionMap.push([condition]);
      } else {
        this.conditionMap[orIndex].push(condition);
      }
    },
    delCondition({ orIndex, andIndex }) {
      this.conditionMap[orIndex].splice(andIndex, 1);
      if (!this.conditionMap[orIndex].length) this.conditionMap.splice(orIndex, 1);
    },
  },
};
</script>

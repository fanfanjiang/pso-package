<template>
  <div class="dynamic-rule">
    <div class="dynamic-rule-item" v-for="(r, i) in rules" :key="i">
      <div class="dynamic-rule-item-body">
        <dynamic-filter :pick="r" :fields-options="fields" fixedfield :cpntable="false" @del="delHandler(i)"></dynamic-filter>
        <div class="dynamic-rule-type" v-if="i !== rules.length - 1">
          <el-select size="mini" v-model="ruleType">
            <el-option v-for="rt in RULETYPE" :key="rt.n" :label="rt.n" :value="rt.v"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="dynamic-rule-add">
      <el-dropdown size="mini" trigger="click" @command="addHandler">
        <el-button class="el-dropdown-link" size="mini" icon="el-icon-plus">添加筛选条件</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(o, i) in fields" :key="i" :command="i">{{ o._fieldName }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import DynamicFilter from "./filter";
import { makeSysFormFields } from "../../tool/form";

export default {
  components: { DynamicFilter },
  props: {
    rules: Array,
    options: Array,
    type: String,
    sysable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    this.RULETYPE = [
      { n: "且", v: "1" },
      { n: "或", v: "2" },
    ];
    return {
      ruleType: this.type,
      fields: [],
    };
  },
  watch: {
    ruleType(value) {
      this.$emit("typechange", value);
    },
  },
  created() {
    this.fields = _.cloneDeep(this.options);
    if (this.sysable) {
      this.fields.push(...makeSysFormFields());
    }
  },
  methods: {
    addHandler(index) {
      const { fid } = this.fields[index];
      this.rules.push({ field: fid, op: "", data: "", match: "", type: "1" });
    },
    delHandler(index) {
      this.rules.splice(index, 1);
    },
  },
};
</script>
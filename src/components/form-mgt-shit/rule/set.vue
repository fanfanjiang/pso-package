<template>
  <div class="form-rule-set">
    <div class="form-rule-title">规则设置</div>
    <el-form size="mini" label-position="top" style="margin-bottom: 50px">
      <el-form-item label="规则名称" style="margin-bottom: 10px">
        <el-input size="small" v-model="instance.name"></el-input>
      </el-form-item>
    </el-form>
    <div class="form-rule-stitle">当满足以下条件时</div>
    <dynamic-rule :rules="instance.rule" :type="instance.ruleType" :options="options" sysable @typechange="onTypeChange"></dynamic-rule>
    <div class="form-rule-stitle" style="margin-top: 50px">则执行以下动作：</div>
    <rule-practice :data="instance.practices" :store="store"></rule-practice>
  </div>
</template>
<script>
import DynamicRule from "../../dynamic-rule";
import RulePractice from "./practice.vue";
export default {
  components: { DynamicRule, RulePractice },
  props: {
    instance: Object,
    options: Array,
    store: Object,
  },
  methods: {
    onTypeChange(type) {
      this.instance.ruleType = type;
    },
  },
};
</script>
<style lang="less">
.form-rule-set {
  padding: 15px;
  padding-right: 300px;
  .form-rule-title {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 15px;
  }
  .form-rule-stitle {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 20px;
  }
}
</style>
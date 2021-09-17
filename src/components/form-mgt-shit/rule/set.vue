<template>
  <div class="form-rule-set">
    <div class="form-rule-stitle">当满足以下条件时</div>
    <dynamic-rule :rules="instance.rule" :type="instance.ruleType" :options="options" sysable @typechange="onTypeChange"></dynamic-rule>
    <div class="form-rule-stitle" style="margin-top: 20px">则执行动作</div>
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
  .form-rule-stitle {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
  }
}
</style>
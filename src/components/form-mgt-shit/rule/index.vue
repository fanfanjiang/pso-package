<template>
  <div :class="viewClass">
    <div class="pso-view-extend">
      <shit-tab title="规则" :data="data" v-model="curTab" @add="onAdd" @remove="onRemove"></shit-tab>
    </div>
    <div class="pso-view-body">
      <rule-set v-if="curInst"></rule-set>
    </div>
  </div>
</template>
<script>
import { MgtMixin } from "../../../mixin/view";
import ShitTab from "../tab";
import RuleSet from "./set";

export default {
  mixins: [MgtMixin],
  components: { RuleSet, ShitTab },
  props: {
    data: Array,
  },
  data() {
    return {
      curTab: "",
      curInst: null,
    };
  },
  watch: {
    curTab() {
      this.getCurAction();
    },
  },
  methods: {
    onAdd() {},
    onRemove() {},
    getCurAction() {
      this.curInst = null;
      this.$nextTick(() => {
        this.curInst = _.find(this.data, { id: this.curTab });
      });
    },
  },
};
</script>

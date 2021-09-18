<template>
  <div :class="viewClass">
    <div class="pso-view-extend">
      <shit-tab title="规则" :data="data" v-model="curTab" @add="onAdd" @remove="onRemove"></shit-tab>
    </div>
    <div class="pso-view-body">
      <rule-set v-if="curInst" :instance="curInst" :options="options" :store="store"></rule-set>
    </div>
  </div>
</template>
<script>
import { MgtMixin } from "../../../mixin/view";
import ShitTab from "../tab";
import RuleSet from "./set";

const RULE = {
  name: "",
  id: "",
  rule: [],
  ruleType: "1",
  practices: [],
};

export default {
  mixins: [MgtMixin],
  components: { RuleSet, ShitTab },
  props: {
    data: Array,
    store: Object,
  },
  data() {
    return {
      curTab: "",
      curInst: null,
      options: [],
    };
  },
  watch: {
    curTab() {
      this.setCurInst();
    },
  },
  created() {
    this.options = this.store.search({ onlyData: true, options: { db: true } });
    if (this.data.length) {
      this.curTab = this.data[0].id;
    }
  },
  methods: {
    onAdd() {
      const inst = { ..._.cloneDeep(RULE), name: `规则${this.data.length + 1}`, id: psodataid() };
      this.data.push(inst);
      this.curTab = inst.id;
    },
    onRemove({ i }) {
      this.data.splice(i, 1);
    },
    setCurInst() {
      this.curInst = null;
      this.$nextTick(() => {
        this.curInst = _.find(this.data, { id: this.curTab });
      });
    },
  },
};
</script>

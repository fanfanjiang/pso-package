<template>
  <pso-label :cpnt="cpnt">
    <el-input size="small" readonly :value="showVal || cpnt.data._val" :placeholder="cpnt.data._placeholder"></el-input>
  </pso-label>
</template>
<script>
import cpntMixin from "../mixin";

export default {
  mixins: [cpntMixin],
  props: {
    cpnt: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      showVal: "",
    };
  },
  created() {
    this.$on("asstable-selected", ({ cpnt, data }) => {
      if (cpnt.fid === this.cpnt.data._selectedTable) {
        if (data.length) {
          let value = data[0][this.cpnt.data._selectedField];
          if (_.isNull(value) || typeof value === "undefined") {
            value = "";
          }
          this.cpnt.data._val = value;
          const showVal = data[0][this.cpnt.data._selectedField + "_x"];
          if (typeof showVal !== "undefined") {
            this.showVal = this.cpnt.data.__showVal__ = showVal;
            this.dispatch("PsoformInterpreter", "cpnt-shownval-done", { cpnt: this.cpnt });
          }
        } else {
          this.cpnt.data._val = "";
        }
      }
    });
  },
};
</script>
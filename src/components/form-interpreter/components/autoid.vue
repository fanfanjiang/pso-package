<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-input size="small" :disabled="!cpnt.store.editable||cpnt.data._read" v-model="idVal"></el-input>
  </el-form-item>
</template>
<script>
import { FIELD_FORMAT } from "../../../const/form";
import cpntMixin from "../mixin";
import { cpntFix } from "../mixins";

export default {
  mixins: [cpntMixin, cpntFix],
  data() {
    return {
      emitSilent: true,
      sourceField: "_source",
      idVal: "",
      scriptVal: "",
    };
  },
  async created() {
    let instance_id = this.cpnt.store.instance_id;

    if (this.cpnt.store.copyMode) {
      this.cpnt.data._val = "";
      instance_id = "";
    }

    if (instance_id) {
      this.idVal = this.cpnt.data._val;
    }

    if (!instance_id) {
      if (this.cpnt.data._fieldFormat === FIELD_FORMAT.autotag.value) {
        if (this.cpnt.data._bind) {
          this.$on("cpnt-value-changed", ({ cpnt }) => {
            if (cpnt.fid === this.cpnt.data._bind) {
              this.cpnt.data._val = cpnt.data._val;
            }
          });
        }
      } else {
        if (this.cpnt.data._source) {
          this.$watch("fixValue", (val) => {
            this.scriptVal = this.goFormat(val);
            this.setTrueVal();
          });
          this.$watch("idVal", (val) => {
            this.setTrueVal();
          });
          this.scriptVal = this.goFormat(this.cpnt.data._source);
          this.setTrueVal();
          this.startWatch();
        } else {
          if (!instance_id) {
            this.scriptVal = this.goFormat(`@__date__@@__no__@`);
            this.setTrueVal();
          }
        }
      }
    }
  },
  methods: {
    goFormat(source) {
      return source.replace(/@__date__@/g, `[date(${this.cpnt.data._format})]`).replace(/@__no__@/g, `%0${this.cpnt.data._digit}d`);
    },
    setTrueVal() {
      this.cpnt.data._val = this.idVal + this.scriptVal;
    },
  },
};
</script>
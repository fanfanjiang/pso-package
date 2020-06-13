<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-input size="small" disabled :value="showVal"></el-input>
  </el-form-item>
</template>
<script>
import { FIELD_FORMAT } from "../../../const/form";
import cpntMixin from "../mixin";
export default {
  mixins: [cpntMixin],
  data() {
    return {
      emitSilent: true
    };
  },
  computed: {
    showVal() {
      return !this.cpnt.store.instance_id ? "" : this.cpnt.data._val;
    }
  },
  async created() {
    if (!this.cpnt.data._val && !this.cpnt.store.instance_id) {
      if (this.cpnt.data._fieldFormat === FIELD_FORMAT.autotag.value && this.cpnt.data._bind) {
        this.cpnt.data._val = this.cpnt.data._bind;
      } else {
        let source = this.cpnt.data._source || `#date##no#`;
        this.cpnt.data._val = source
          .replace(/#date#/g, `[date(${this.cpnt.data._format})]`)
          .replace(/#no#/g, `%0${this.cpnt.data._digit}d`);
      }
    }
  }
};
</script>
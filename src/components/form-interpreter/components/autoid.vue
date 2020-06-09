<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-input size="small" disabled :value="cpnt.data._val"></el-input>
  </el-form-item>
</template>
<script>
import cpntMixin from "../mixin";
export default {
  mixins: [cpntMixin],
  async created() {
    if (!this.cpnt.data._val && !this.cpnt.store.instance_id) {
      let source = this.cpnt.data._source || `#date##no#`;
      source = source.replace(/#date#/g, `[date(${this.cpnt.data._format})]`).replace(/#no#/g, `%0${this.cpnt.data._digit}d`);
      const ret = await this.API.getFormNumber({ data_code: this.cpnt.store.data_code, keys: { [this.cpnt.data._fieldValue]: source } });
      if (ret.success) {
        this.cpnt.data._val = ret.data[this.cpnt.data._fieldValue];
      }
    }
  }
};
</script>
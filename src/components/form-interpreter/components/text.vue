<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-input
      size="small"
      :type="type||cpnt.data._type||'text'"
      :clearable="true"
      :disabled="!cpnt.store.editable||cpnt.data._read"
      v-model="cpnt.data._val"
      :placeholder="cpnt.data._placeholder"
    ></el-input>
  </el-form-item>
</template>
<script>
import cpntMixin from "../mixin";
import { cpntFix } from "../mixins";

export default {
  mixins: [cpntMixin, cpntFix],
  props: {
    type: {
      type: String,
      default: "",
    },
  },
  created() {
    if (!this.cpnt.store.instance_id && this.fixable) {
      this.$watch("fixValue", (val) => {
        this.cpnt.data._val = val;
      });
    }
  },
};
</script>
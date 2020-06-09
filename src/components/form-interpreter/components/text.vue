<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-input
      size="small"
      :type="type||cpnt.data._type||'text'"
      :clearable="true"
      :disabled="!cpnt.store.editable||cpnt.data._read"
      v-model.trim="cpnt.data._val"
      :placeholder="cpnt.data._placeholder"
    ></el-input>
  </el-form-item>
</template>
<script>
import cpntMixin from "../mixin";

export default {
  mixins: [cpntMixin],
  props: {
    type: {
      type: String,
      default: ""
    }
  }
};
</script>
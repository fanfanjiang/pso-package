<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-rate  size="small" :value="cpnt.data._val" :disabled="!cpnt.store.editable||cpnt.data._read"></el-rate>
  </el-form-item>
</template>
<script>
import cpntMixin from "../mixin";
export default {
  mixins: [cpntMixin]
};
</script>
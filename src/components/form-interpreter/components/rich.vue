<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <mavon-editor v-model="cpnt.data._val" :subfield="false" />
  </el-form-item>
</template>
<script>
import cpntMixin from "../mixin";
export default {
  mixins: [cpntMixin]
};
</script>
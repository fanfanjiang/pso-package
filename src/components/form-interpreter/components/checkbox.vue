<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-checkbox-group v-model="cpnt.data._val">
      <el-checkbox
        v-for="opt in cpnt.data._option"
        :key="opt._optionValue"
        :label="opt._optionName||opt._optionValue"
        :value="opt._optionValue"
        :disabled="!cpnt.store.editable||cpnt.data._read"
      ></el-checkbox>
    </el-checkbox-group>
  </el-form-item>
</template>
<script>
import cpntMixin from "../mixin";
export default {
  mixins: [cpntMixin],
  created() {
    this.cpnt.data._val = this.cpnt.data._val
      ? typeof this.cpnt.data._val === "string"
        ? this.cpnt.data._val.split(",")
        : this.cpnt.data._val
      : [];
  }
};
</script>
<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-checkbox-group v-model="proxy">
      <el-checkbox
        size="small"
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
  data() {
    return {
      proxy: []
    };
  },
  created() {
    if (this.cpnt.data._val) {
      this.proxy = this.cpnt.data._val.split(",");
    }
  },
  watch: {
    proxy(val) {
      this.cpnt.data._val = val.join(",");
    }
  }
};
</script>
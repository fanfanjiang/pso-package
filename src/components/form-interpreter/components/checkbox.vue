<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-checkbox-group v-model="proxy" v-if="!reloading">
      <el-checkbox
        size="small"
        v-for="opt in fixedOptions"
        :key="opt._optionValue"
        :label="opt._fixedVal||opt._optionValue"
        :disabled="!cpnt.store.editable||cpnt.data._read"
      >{{opt._fixedName||opt._optionName||opt._optionValue}}</el-checkbox>
    </el-checkbox-group>
  </el-form-item>
</template>
<script>
import cpntMixin from "../mixin";
import { optionFix } from "../mixins";

export default {
  mixins: [cpntMixin, optionFix],
  data() {
    return {
      proxy: [],
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
    },
  },
};
</script>
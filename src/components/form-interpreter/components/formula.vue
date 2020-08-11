<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-input
      size="small"
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
  data() {
    return {
      sourceField: "_datasource",
    };
  },
  created() {
    let instance_id = this.cpnt.store.instance_id;
 
    //开始监听
    if (this.cpnt.data._datasource && !instance_id) {
      this.$watch("fixValue", (val) => {
        this.cpnt.data._val = val;
      });
      this.startWatch();
    }
  },
};
</script>
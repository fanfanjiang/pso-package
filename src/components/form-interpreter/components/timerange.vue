<template>
  <pso-label :cpnt="cpnt">
    <el-date-picker
      value-format="yyyy-MM-dd HH:mm:ss"
      type="datetimerange"
      v-model="cpnt.data._val"
      :disabled="!cpnt.store.editable||cpnt.data._read"
      :placeholder="cpnt.data._placeholder"
    ></el-date-picker>
  </pso-label>
</template>
<script>
import cpntMixin from "../mixin";

export default {
  mixins: [cpntMixin],
  async created() {
    if (this.cpnt.data._val) {
      this.cpnt.data._val = this.cpnt.data._val.split(",");
    }
  },
};
</script>

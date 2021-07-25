<template>
  <pso-label :cpnt="cpnt">
    <el-date-picker
      :size="size"
      value-format="yyyy-MM-dd HH:mm:ss"
      type="datetimerange"
      v-model="cpnt.data._val"
      :placeholder="cpnt.data._placeholder"
      :disabled="!cpnt.store.editable || cpnt.data._read"
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

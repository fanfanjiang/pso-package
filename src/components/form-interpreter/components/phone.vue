<template>
  <pso-label :cpnt="cpnt">
    <el-input
      size="small"
      type="text"
      :clearable="true"
      :disabled="!cpnt.store.editable||cpnt.data._read"
      v-model="cpnt.data._val"
      :placeholder="cpnt.data._placeholder"
    ></el-input>
  </pso-label>
</template>
<script>
import cpntMixin from "../mixin";
export default {
  mixins: [cpntMixin],
};
</script>

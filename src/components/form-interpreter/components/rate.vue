<template>
  <pso-label :cpnt="cpnt">
    <el-rate size="small" v-model="cpnt.data._val" :disabled="!cpntEditable"></el-rate>
  </pso-label>
</template>
<script>
import cpntMixin from "../mixin";
export default {
  mixins: [cpntMixin],
};
</script>
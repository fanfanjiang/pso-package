<template>
  <div>
    <el-form-item label="限制数值范围">
      <el-switch size="mini" v-model="cpnt.data._useRange"></el-switch>
    </el-form-item>
    <div v-if="cpnt.data._useRange">
      <el-input-number size="mini" v-model="cpnt.data._min" :controls="false"></el-input-number>
      <span style="margin:0 10px">~</span>
      <el-input-number size="mini" v-model="cpnt.data._max" :controls="false"></el-input-number>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    cpnt: {
      type: Object,
    },
  },
};
</script>
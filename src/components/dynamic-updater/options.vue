<template>
  <el-select size="small" v-model="data[field]" :clearable="clearable" @change="$emit('change')" @clear="$emit('clear')">
    <el-option v-for="(o, i) in options" :key="i" :label="o._fieldName" :value="o._fieldValue"></el-option>
  </el-select>
</template>
<script>
export default {
  props: {
    options: Array,
    data: Object,
    field: String,
    clearable: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
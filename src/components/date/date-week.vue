<template>
  <el-date-picker
    :size="size"
    v-model="date"
    type="week"
    format="yyyy 第 WW 周"
    value-format="yyyy-MM-dd"
    align="right"
    clearable
  ></el-date-picker>
</template>
<script>
import dayjs from "dayjs";
export default {
  props: {
    value: Array,
    size: {
      type: String,
      default: "mini",
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      date: "",
    };
  },
  watch: { 
    date(val) {
      this.$emit("change", val ? [val, dayjs(val).add(6, "day").format("YYYY-MM-DD")] : []);
    },
  },
};
</script>
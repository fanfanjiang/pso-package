<template>
  <el-checkbox-group v-model="auth">
    <el-checkbox v-for="(o, i) in data" :label="o.v" :key="i">{{ o.n }}</el-checkbox>
  </el-checkbox-group>
</template>
<script>
export default {
  props: {
    data: Array,
    value: [String, Number],
  },
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      auth: [],
    };
  },
  computed: {
    selectAuth() {
      return this.auth.length ? this.auth.reduce((a, b) => a + b) : 0;
    },
  },
  watch: { 
    auth: {
      deep: true,
      handler() {
        this.$emit("change", this.selectAuth);
      },
    },
  },
  created() {
    this.data.forEach((d) => {
      if ((d.v & parseInt(this.value)) === d.v) {
        this.auth.push(d.v);
      }
    });
  },
};
</script>
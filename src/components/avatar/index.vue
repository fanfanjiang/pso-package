<template>
  <el-avatar :size="size">
    <slot>{{ text }}</slot>
  </el-avatar>
</template>
<script>
export default {
  props: {
    size: {
      type: [Number, String],
      default: "small",
    },
    nick: {
      type: String,
      default: "",
    },
  },
  computed: {
    text() {
      return this.nick.length > 2 ? this.nick.slice(-2) : this.nick;
    },
  },
};
</script>
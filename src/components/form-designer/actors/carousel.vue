<template>
  <div class="actor-text">
    <el-carousel height="150px">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3 class="small">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";

export default {
  name: "pso-text-actor",
  props: ["cpnt"],
  components: {
    commonActor
  }
};
</script>
<style lang="less" scoped>
</style>

<template>
  <div class="actor-money">
    <common-actor :cpnt="cpnt" :placeholder="true">
      <span>{{cpnt.data._unit}}</span>
    </common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";

export default {
  name: "pso-money-actor",
  props: ["cpnt"],
  components: {
    commonActor
  }
};
</script>
<style lang="less" scoped>
</style>

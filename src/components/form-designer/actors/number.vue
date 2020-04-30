<template>
  <div class="actor-text">
    <common-actor :cpnt="cpnt" :placeholder="true">
      <span>{{cpnt.data._unit}}</span>
    </common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";

export default {
  name: "pso-number-actor",
  props: ["cpnt"],
  components: {
    commonActor
  }
};
</script>
<style lang="less" scoped>
</style>

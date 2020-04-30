<template>
  <div class="actor-attachement">
    <common-actor :cpnt="cpnt" :placeholder="false">
      <div>
        <span class="el-icon-paperclip"></span>
        <span>添加附件</span>
      </div>
    </common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";

export default {
  name: "pso-attachement-actor",
  props: ["cpnt"],
  components: {
    commonActor
  }
};
</script>
<style lang="less" scoped>
</style>

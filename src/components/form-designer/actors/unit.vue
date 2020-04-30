<template>
  <div class="actor-tag">
    <common-actor :cpnt="cpnt" :placeholder="false">
      <div>
        <span class="el-icon-plus"></span>
        <span>选择</span>
      </div>
    </common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";

export default {
  name: "pso-tag-actor",
  props: ["cpnt"],
  components: {
    commonActor
  }
};
</script>


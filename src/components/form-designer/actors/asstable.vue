<template>
  <div class="actor-asstable">
    <common-actor :cpnt="cpnt">
      <div>
        <i class="el-icon-plus"></i>
        <span>记录</span>
      </div>
    </common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";
export default {
  name: "pso-asstable-actor",
  props: ["cpnt"],
  components: {
    commonActor
  }
};
</script>
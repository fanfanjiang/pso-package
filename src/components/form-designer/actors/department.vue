<template>
  <div class="actor-dept">
    <common-actor :cpnt="cpnt" :placeholder="false">
      <div>
        <span class="el-icon-plus"></span>
        <span>添加部门</span>
      </div>
    </common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";
export default {
  name: "pso-dept-actor",
  props: ["cpnt"],
  components: {
    commonActor
  }
};
</script>

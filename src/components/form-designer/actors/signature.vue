<template>
  <div class="actor-signature">
    <common-actor :cpnt="cpnt">
      <div>
        <i class="el-icon-edit"></i>
        <span>添加签名</span>
      </div>
    </common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";
export default {
  name: "pso-signature-actor",
  props: ["cpnt"],
  components: {
    commonActor
  }
};
</script>
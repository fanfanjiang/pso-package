<template>
  <div class="actor-rate">
    <common-actor :cpnt="cpnt" :placeholder="false" :border="visible">
      <el-rate :value="cpnt.data._defaultValue" :disabled="true"></el-rate>
    </common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";

export default {
  name: "pso-rate-actor",
  components: { commonActor },
  props: ["cpnt"],
  computed: {
    visible() {
      return this.cpnt.parent.componentid === "table";
    }
  }
};
</script>
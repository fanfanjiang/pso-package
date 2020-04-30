<template>
  <div class="actor-autoid">
    <common-actor :cpnt="cpnt" :placeholder="false"></common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";

export default {
  name: "pso-autoid-actor",
  props: ["cpnt"],
  components: {
    commonActor
  }
};
</script>


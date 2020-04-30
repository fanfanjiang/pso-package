<template>
  <div class="actor-credential">
    <common-actor :cpnt="cpnt" :placeholder="false"></common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";

export default {
  name: "pso-credential-actor",
  props: ["cpnt"],
  components: {
    commonActor
  }
};
</script>


<template>
  <div class="actor-text">
    <common-actor :cpnt="cpnt" :placeholder="true"></common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";

export default {
  name: "pso-text-actor",
  props: ["cpnt"],
  components: {
    commonActor
  }
};
</script>


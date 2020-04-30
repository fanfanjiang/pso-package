<template>
  <div class="actor-formula">
    <common-actor :cpnt="cpnt"></common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";
export default {
  name: "pso-formula-actor",
  props: ["cpnt"],
  components: {
    commonActor
  }
};
</script>

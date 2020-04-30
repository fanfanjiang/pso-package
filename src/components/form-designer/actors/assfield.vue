<template>
  <div class="actor-asstable">
    <common-actor :cpnt="cpnt"></common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";
export default {
  name: "pso-assfield-actor",
  props: ["cpnt"],
  components: {
    commonActor
  }
};
</script>
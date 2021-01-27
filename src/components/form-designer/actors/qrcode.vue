<template>
  <div class="actor-timerange">
    <common-actor :cpnt="cpnt" :placeholder="true"></common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";

export default {
  name: "pso-qrcode-actor",
  props: ["cpnt"],
  components: {
    commonActor
  }
};
</script>

<template>
  <div class="actor-rich">
    <mavon-editor :editable="false" :subfield="false" />
  </div>
</template>
<script>
export default {
  name: "pso-rich-actor",
  props: ["cpnt"]
};
</script>
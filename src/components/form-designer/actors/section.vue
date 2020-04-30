<template>
  <div class="actor-section">
    <el-divider content-position="left">{{cpnt.data._defaultValue}}</el-divider>
  </div>
</template> 
<script>
export default {
  name: "pso-section-actor",
  props: ["cpnt"]
};
</script>
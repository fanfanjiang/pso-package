<template>
  <workflow :params="params"></workflow>
</template>
<script>
import Workflow from "@/components/workflow-designer/index";
export default {
  props: ["params"],
  components: { Workflow }
};
</script>

<template>
  <pso-templete-mgt :params="params"></pso-templete-mgt>
</template>
<script>
import PsoTempleteMgt from "@/components/templete-mgt";
export default {
  props: ["params"],
  components: { PsoTempleteMgt }
}; 
</script>
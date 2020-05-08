<template>
  <pso-element-mgt :params="params"></pso-element-mgt>
</template>
<script>
import PsoElementMgt from "@/components/element-mgt";
export default {
  props: ["params"],
  components: { PsoElementMgt }
}; 
</script>
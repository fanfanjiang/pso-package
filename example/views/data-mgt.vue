<template>
  <pso-data-mgt :params="params"></pso-data-mgt>
</template>
<script>
import PsoDataMgt from "@/components/data-mgt";
export default {
  props: ["params"],
  components: { PsoDataMgt }
};
</script>
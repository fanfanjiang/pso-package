<template>
  <pso-view-designer :params="params"></pso-view-designer>
</template>
<script>
import PsoViewDesigner from "@/components/view-designer";
export default {
  props: ["params"],
  components: { PsoViewDesigner }
}; 
</script>
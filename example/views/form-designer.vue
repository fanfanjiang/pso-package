<template>
  <pso-form-designer :params="params" @back="backHandler" @saved="backHandler"></pso-form-designer>
</template>
<script>
import PsoFormDesigner from "@/components/form-designer";
export default {
  props: ["params"],
  components: { PsoFormDesigner },
  methods: {
    backHandler() {
    }
  }
}; 
</script>
<template>
  <pso-form-designer :params="params" @back="backHandler" @saved="backHandler"></pso-form-designer>
</template>
<script>
export default {
  props: ["params"],
  methods: {
    backHandler() {
    }
  }
}; 
</script>
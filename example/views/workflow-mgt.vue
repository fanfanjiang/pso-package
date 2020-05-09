<template>
  <pso-workflow-mgt :params="params" @designer="handleGo"></pso-workflow-mgt>
</template>
<script>
export default { 
  props: ["params"],
  methods: {
    handleGo(query) {
      this.$router.push({
        name: "wfDesigner",
        params: { appid: "3" },
        query
      });
    }
  }
};
</script>
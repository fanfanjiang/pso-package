<template>
  <pso-wf-executor2 :params="params"></pso-wf-executor2>
</template>
<script>
export default {
  computed: {
    params() {
      return { node_id: 578, instance: { instanceId: "" }, displayMode: "simple" };
    }
  }
};
</script>
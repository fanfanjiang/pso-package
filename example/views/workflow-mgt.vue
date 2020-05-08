<template>
  <pso-workflow-mgt :params="params" @designer="handleGo"></pso-workflow-mgt>
</template>
<script>
import PsoWorkflowMgt from "@/components/workflow-mgt";
export default {
  props: ["params"],
  components: { PsoWorkflowMgt },
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
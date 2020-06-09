<template>
  <pso-knowl-mgt :params="params" @go="handleGo"></pso-knowl-mgt>
</template>
<script>
export default {
  props: ["params"],
  methods: {
    handleGo({ data, node }) {
      if (node.data_type === "formtp") {
        this.$router.push({ name: "formDesigner", query: { templateId: data.leaf_id } });
      }
      if (node.data_type === "flowtp") {
        this.$router.push({ name: "wfDesigner", query: { templateId: data.leaf_id } });
      } 
    }
  }
};
</script>
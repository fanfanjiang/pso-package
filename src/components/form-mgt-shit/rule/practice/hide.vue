<template>
  <rule-select :store="store" :instance="instance"></rule-select>
</template>
<script>
import RuleSelect from "../select";

export default {
  components: { RuleSelect },
  props: {
    store: Object,
    instance: Object,
  },
};
</script>
<template>
  <component v-bind:is="currentCpnt" :params="params" @excuted="$emit('excuted',$event)"></component>
</template> 
<script>
import PsoExecutor from "./executor";
import PsoExecutorSimple from "./executor-simple";
export default {
  components: { PsoExecutor, PsoExecutorSimple },
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    currentCpnt() {
      return `pso-executor` + (this.params.displayMode ? `-${this.params.displayMode}` : "");
    }
  }
};
</script>
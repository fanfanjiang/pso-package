<template>
  <component v-bind:is="currentCpnt" :params="params" @excuted="$emit('excuted',$event)"></component>
</template> 
<script>
import PsoExecutor from "./executor";
import PsoExecutorSimple from "./executor-simple";
export default {
  componentName: "PsoWfExecutor",
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
  },
  created() {
    this.$on("before-save", val => {
      this.$emit("before-save", val);
    });
    this.$on("before-next", val => {
      this.$emit("before-next", val);
    });
    this.$on("excuted", val => {
      this.$emit("excuted", val);
    });
  }
};
</script>
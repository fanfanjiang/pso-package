<template>
  <component v-bind:is="currentCpnt" :params="params">
    <template slot="data" slot-scope="{store}">
      <slot name="data" :store="store"></slot>
    </template>
    <template slot="content" slot-scope="{store}">
      <slot name="content" :store="store"></slot>
    </template>
  </component>
</template> 
<script>
import PsoExecutor from "./executor";
import PsoExecutorSimple from "./executor-simple";
export default {
  componentName: "PsoWfExecutorBox",
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
    this.$on("op-before-save", val => {
      this.$emit("before-save", val);
    });
    this.$on("op-before-next", val => {
      this.$emit("before-next", val);
    });
    this.$on("op-excuted", val => {
      this.$emit("excuted", val);
    });
    this.$on("initialized", val => {
      this.$emit("executor-initialized", val);
    });
  }
};
</script>
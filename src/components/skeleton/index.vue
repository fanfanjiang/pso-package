<template>
  <div :class="classObject" :style="sStyle">
    <pso-skeleton-heading v-if="heading" :img="headimg"></pso-skeleton-heading>
    <slot />
    <pso-skeleton-text :lines="lines"></pso-skeleton-text>
  </div>
</template>

<script>
import PsoSkeletonHeading from "./psoSkeletonHeading";
import PsoSkeletonImg from "./psoSkeletonImg";
import PsoSkeletonText from "./psoSkeletonText";
import { skeleton } from "./mixin";

export default {
  name: "psoSkeleton",
  mixins: [skeleton],
  components: { PsoSkeletonHeading, PsoSkeletonImg, PsoSkeletonText },
  computed: {
    classObject() {
      return {
        "pso-skeleton": true,
        "pso-skeleton-is-rounded": this.rounded,
        "pso-skeleton-is-centered": this.centered,
        "pso-skeleton-is-animated": this.animated,
      };
    },
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>

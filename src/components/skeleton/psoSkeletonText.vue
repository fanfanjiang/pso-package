<template>
  <div :class="className">
    <div v-for="n in lines" :key="n" :class="`${className}__line`" />
  </div>
</template>

<script>
export default {
  name: 'psoSkeletonText',
  data () {
    return {
      className: 'pso-skeleton-text',
    }
  },
  props: {
    lines: {
      type: Number,
      default: 4,
    },
  },
}
</script>

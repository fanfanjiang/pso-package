<template>
  <div :class="className">
    <div v-if="img" :class="`${className}__img`" />
    <div :class="`${className}__content`">
      <div :class="`${className}__title`" />
      <div :class="`${className}__subtitle`" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'psoSkeletonHeading',
  data () {
    return {
      className: 'pso-skeleton-heading',
    }
  },
  props: {
    img: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <div class="pso-title" :style="style">
    <div class="pso-title__title">
      <slot>{{title}}</slot>
    </div>
    <div class="pso-title__info" v-if="!!info">{{info}}</div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    size: {
      type: Number,
      default: 16
    },
    info: {
      type: String,
      default: ""
    }
  },
  computed: {
    style() {
      return {
        "font-size": `${this.size}px`
      };
    }
  }
};
</script>
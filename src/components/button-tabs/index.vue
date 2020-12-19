<template>
  <div class="pso-btntabs">
    <div :class="tabsClass(i)" v-for="(d, i) in data" :key="i" @click="clickHandler(i)">
      <div class="pso-btntabs-label">
        <i :class="d.icon" v-if="d.icon"></i>
        <span>{{ d.label }}</span>
      </div>
      <span class="pso-btntabs-split" v-if="i !== data.length - 1">/</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: Array,
  },
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      activeIndex: 0,
    };
  },
  watch: {
    activeIndex(val) {
      this.$emit("change", val);
    },
  },
  methods: {
    tabsClass(index) {
      return {
        "pso-btntabs-item__active": index === this.activeIndex,
        "pso-btntabs-item": true,
      };
    },
    clickHandler(i) {
      this.activeIndex = i;
    },
  },
};
</script>
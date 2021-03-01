<template>
  <div class="pso-btntabs">
    <div :class="tabsClass(d, i)" v-for="(d, i) in data" :key="i" @click="clickHandler(d, i)">
      <div class="pso-btntabs-label">
        <i :class="d.icon" v-if="d.icon"></i>
        <span>{{ d.label }}</span>
      </div>
      <span class="el-breadcrumb__separator" v-if="i !== data.length - 1">/</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: Array,
    value: [Number, String],
    indexed: {
      type: Boolean,
      default: true,
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      activeIndex: this.value,
    };
  },
  watch: {
    activeIndex(val) {
      this.$emit("change", val);
    },
  },
  methods: {
    tabsClass(tab, index) {
      return {
        "pso-btntabs-item__active": this.getID(tab, index) === this.activeIndex,
        "pso-btntabs-item": true,
      };
    },
    clickHandler(tab, index) {
      this.activeIndex = this.getID(tab, index);
    },
    getID(tab, index) {
      return this.indexed ? index : tab.id || tab.label;
    },
  },
};
</script>
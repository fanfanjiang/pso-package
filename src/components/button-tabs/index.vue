<template>
  <div class="pso-btntabs">
    <div :class="tabsClass(d, i)" v-for="(d, i) in data" :key="i" @click="clickHandler(d, i)">
      <div class="pso-btntabs-label" :style="labelStyle">
        <i class="pso-btntabs-label__icon" :class="d.icon" v-if="d.icon"></i>
        <span class="pso-btntabs-label__title">{{ d.label }}</span>
        <span v-if="checkActive(d, i)" :style="anchorStyle" class="pso-btntabs-label__anchor"></span>
      </div>
      <span :style="labelStyle" class="el-breadcrumb__separator" v-if="i !== data.length - 1">/</span>
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
    color: {
      type: String,
      default: "",
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
  computed: {
    labelStyle() {
      if (this.color) {
        return {
          color: this.color,
        };
      }
    },
    anchorStyle() {
      if (this.color) {
        return {
          "background-color": this.color,
        };
      }
    },
  },
  watch: {
    value(value) {
      this.activeIndex = value;
    },
    activeIndex(val) {
      this.$emit("change", val);
    },
  },
  methods: {
    checkActive(tab, index) {
      return this.getID(tab, index) === this.activeIndex;
    },
    tabsClass(tab, index) {
      return {
        "pso-btntabs-item__active": this.checkActive(tab, index),
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
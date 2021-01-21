<template>
  <div class="pso-grid-info">
    <div class="pso-grid-info-body"> 
      <div class="pso-grid-info__item" v-for="(item, index) in list" :key="index">
        <div class="pso-grid-info__item-v">
          {{ item[v] }}<span>{{ unit }}</span>
        </div>
        <div class="pso-grid-info__item-n">{{ item[n] }}</div>
      </div>
    </div>
    <slot></slot>
    <div class="pso-grid-latest" v-if="latest" @click="$emit('more')">
      <span>{{ latestText }}</span>
      <el-button :icon="icon" circle></el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: Array,
    latest: {
      type: Boolean,
      default: false,
    },
    latestText: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "el-icon-document",
    },
    n: {
      type: String,
      default: "n",
    },
    v: {
      type: String,
      default: "v",
    },
    unit: {
      type: String,
      default: "",
    },
  },
};
</script>

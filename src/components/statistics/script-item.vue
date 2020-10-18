<template>
  <div>
    <div class="script-item" v-for="(value, name) in data" :key="name">
      <span class="script-item__title">{{ name }}</span>
      <div class="script-item__ary" v-if="Array.isArray(value)">
        <div v-for="(item, index) in value" :key="index">{{ item.__formatVal__ }}</div>
      </div>
      <script-item v-else :data="value"></script-item>
    </div>
  </div>
</template>
<script>
export default {
  name: "script-item",
  props: {
    data: {
      type: Object,
    },
  },
};
</script>
<style lang="less">
.script-item {
  display: flex;
  & + .script-item {
    margin-top: 15px;
  }
  .script-item__title {
    width: 140px;
  }
  .script-item__ary {
    padding: 10px;
    background: #f8f8f9;
    > div {
      & + div {
        margin-top: 12px;
      }
    }
  }
}
</style>

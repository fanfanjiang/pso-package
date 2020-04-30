<template>
  <div>
    <panel-header
      :icon="cpnt.CPNT.icon"
      :name="cpnt.CPNT.name"
      :info="'布局组件，用于将组件放置在一行中展示，建议一行最多放置两个组件'"
    ></panel-header>
  </div>
</template>
<script>
import panelHeader from "../common/panel-header";

export default {
  props: ["cpnt"],
  components: {
    panelHeader
  },
  created() {}
};
</script>
<style lang="less" scoped>
</style>
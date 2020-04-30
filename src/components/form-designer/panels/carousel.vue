<template>
  <div>
    <panel-header
      :icon="cpnt.CPNT.icon"
      :name="cpnt.CPNT.name"
      :info="'走马灯'"
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
  created() {

  }
};
</script>
<style lang="less" scoped>
</style>
<template>
  <div>
    <panel-header :icon="cpnt.CPNT.icon" :name="cpnt.CPNT.name" info="布局容器"></panel-header>
  </div>
</template>
<script>
import panelHeader from "../common/panel-header";

export default {
  props: ["cpnt"],
  components: {
    panelHeader
  }
};
</script>

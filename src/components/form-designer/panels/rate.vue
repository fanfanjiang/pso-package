<template>
  <div class="act-text-body">
    <common-panel :cpnt="cpnt" info="可设置分数" :needPlaceholder="true"></common-panel>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";

export default {
  props: ["cpnt"],
  components: {
    commonPanel
  }
};
</script>

<template>
  <div class="act-text-body">
    <common-panel
      :cpnt="cpnt"
      info="可以添加图片、文件"
      :needPlaceholder="false"
      :needDefaultValue="false"
      :needUnique="false"
    ></common-panel>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";

export default {
  props: ["cpnt"],
  components: {
    commonPanel
  },
  created() {}
};
</script>
<style lang="less" scoped>
</style>
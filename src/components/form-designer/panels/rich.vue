<template>
  <div class="act-select-body">
    <common-panel
      :cpnt="cpnt"
      info="富文本编辑器"
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
  }
};
</script>

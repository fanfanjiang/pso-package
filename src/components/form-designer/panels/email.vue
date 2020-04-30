<template>
  <div class="act-text-body">
    <common-panel :cpnt="cpnt" info="输入邮箱，并验证格式" :needPlaceholder="true" :needUnique="true"></common-panel>
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

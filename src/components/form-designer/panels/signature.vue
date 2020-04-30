<template>
  <div>
    <common-panel
      :cpnt="cpnt"
      info="通过签名确定签名人身份"
      :needPlaceholder="false"
      :needDefaultValue="false"
    >
    </common-panel>
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

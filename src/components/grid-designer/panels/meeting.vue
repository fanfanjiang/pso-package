<template>
  <panel-wrapper :cpnt="cpnt">
    <common-panel :cpnt="cpnt" position="top">
    </common-panel>
  </panel-wrapper>
</template>    
<script>
import PanelWrapper from "../panel";
import CommonPanel from "../common-panel";

import { CpntMixin } from "../mixin";
export default { 
  components: { PanelWrapper, CommonPanel },
  mixins: [CpntMixin],
};
</script> 
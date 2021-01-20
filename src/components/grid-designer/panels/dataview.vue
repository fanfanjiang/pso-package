<template>
  <panel-wrapper :cpnt="cpnt">
    <common-panel :cpnt="cpnt" position="top">
      <data-panel :cpnt="cpnt"> </data-panel>
    </common-panel>
  </panel-wrapper>
</template>   
<script>
import PanelWrapper from "../panel";
import CommonPanel from "../common-panel";
import DataPanel from "../data-panel";

import { CpntMixin } from "../mixin";
export default {
  components: { PanelWrapper, CommonPanel, DataPanel },
  mixins: [CpntMixin],
  data() {
    return {
      showDesigner: false,
    };
  },
  computed: {},
  methods: {},
};
</script>
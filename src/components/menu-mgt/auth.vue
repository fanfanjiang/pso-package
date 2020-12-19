<template>
  <div style="margin-top: 20px">
    <div class="pso-view-mgt-tabs">
      <button-tabs v-model="curTab" :data="TABS"></button-tabs>
    </div>
    <div class="pso-view-table" v-if="node">
      <node-auth v-if="curTab === 0" key="0" v-bind="authOptions" bind-type="0" id-name="user_id"></node-auth>
      <node-auth v-if="curTab === 1" key="1" v-bind="authOptions" bind-type="1"></node-auth>
      <node-auth v-if="curTab === 2" key="2" v-bind="authOptions" bind-type="2" id-name="duty_id"></node-auth>
      <node-auth v-if="curTab === 3" key="3" v-bind="authOptions" bind-type="3" id-name="user_type"></node-auth>
    </div>
  </div>
</template> 
<script>
import NodeAuth from "../common-auth";
import ButtonTabs from "../button-tabs";
const TABS = [{ label: "用户" }, { label: "部门" }, { label: "职位" }, { label: "角色" }];
export default {
  components: { NodeAuth, ButtonTabs },
  props: {
    node: Object,
  },
  computed: {
    authOptions() {
      return {
        leaf: !!this.node.is_leaf,
        type: "menu",
        bindId: this.node.node_id,
        selectId: "user_id",
      };
    },
  },
  data() {
    this.TABS = TABS;
    return {
      curTab: 0,
    };
  },
};
</script>
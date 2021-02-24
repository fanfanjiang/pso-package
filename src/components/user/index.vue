<template>
  <div class="users-mgt">
    <div class="users-mgt-l">
      <users @clickinstance="clickHandler" syncable></users>
    </div>
    <div class="users-mgt-r">
      <div class="pso-view-mgt-tabs">
        <button-tabs v-model="curTab" :data="TABS"></button-tabs>
      </div>
      <div class="pso-view-table" v-if="user">
        <node-auth v-if="curTab === 0" key="form" type="form" :bind-id="user.user_id" bind-type="0"></node-auth>
        <node-auth v-if="curTab === 1" key="wf" type="wf" :bind-id="user.user_id" bind-type="0"></node-auth>
      </div>
    </div>
  </div>
</template>
<script>
import Users from "./users";
import NodeAuth from "../common-auth";
import ButtonTabs from "../button-tabs";
const TABS = [{ label: "表单权限" }, { label: "流程权限" }];
export default {
  components: { Users, NodeAuth, ButtonTabs },
  data() {
    this.TABS = TABS;
    return {
      user: null,
      curTab: 0,
    };
  },
  methods: {
    clickHandler(user) {
      this.user = user;
    },
  },
};
</script>
<style lang="less">
.users-mgt {
  height: 100%;
  display: flex;
  .users-mgt-l {
    width: 760px;
  }
  .users-mgt-r {
    flex: 1;
    padding: 10px;
    height: 100%;
    overflow: auto;
  }
}
</style>
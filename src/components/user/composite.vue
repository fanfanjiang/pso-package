<template>
  <div class="pso-view-withtop">
    <div class="pso-view-top">
      <pso-typebar :defBar="defGroup" v-model="curGroup"></pso-typebar>
    </div>
    <role-mgt v-show="curGroup.feildvalue === 'role'"></role-mgt>
    <position-mgt v-show="curGroup.feildvalue === 'position'"></position-mgt>
  </div>
</template>
<script>
import RoleMgt from "./role-mgt";
import PositionMgt from "./position-mgt";
export default {
  components: { RoleMgt, PositionMgt },
  data() {
    this.defGroup = [
      { feildname: "角色", feildvalue: "role" },
      { feildname: "职位", feildvalue: "position" },
      { feildname: "来源", feildvalue: "source" },
    ];
    return {
      curGroup: {},
    };
  },
};
</script>
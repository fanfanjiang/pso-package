<template>
  <div class="actor-select">
    <common-actor :cpnt="cpnt" :placeholder="false">
      <div class="actor-cascader-select flex-row-center-between">
        <span class="actor-select__default">{{cpnt.data._defaultValue}}</span>
        <span class="el-icon-arrow-down"></span>
      </div>
    </common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";

export default {
  name: "pso-cascader-actor",
  props: ["cpnt"],
  components: {
    commonActor
  }
};
</script>
<style lang="less" scoped>
.actor-cascader-select {
  width: 100%;
}
</style>

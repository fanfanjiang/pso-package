<template>
  <div class="actor-select">
    <common-actor
      :cpnt="cpnt"
      :placeholder="false"
      :border="visible||cpnt.data._showType==='select'"
    >
      <div
        class="actor-select-select flex-row-center-between"
        v-if="visible||cpnt.data._showType==='select'"
      >
        <span class="actor-select__default">{{cpnt.data._defaultValue}}</span>
        <span class="el-icon-arrow-down"></span>
      </div>
      <div class="actor-select-radio flex-row-center-between" v-else>
        <div
          class="actor-select-radio__item flex-row-center"
          v-for="item of cpnt.data._option"
          :key="item._optionValue"
        >
          <span
            :class="{'icon':true,'actor-select-radio__selected':cpnt.data._defaultValue===item._optionValue}"
          ></span>
          <span>{{item._optionName||item._optionValue}}</span>
        </div>
      </div>
    </common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";

export default {
  name: "pso-select-actor",
  props: ["cpnt"],
  components: {
    commonActor
  },
  computed: {
    visible() {
      return this.cpnt.parent.componentid === "table";
    }
  }
};
</script>
<style lang="less" scoped>
.actor-select-select {
  width: 100%;
}
.actor-select-radio {
  .actor-select-radio__item {
    margin-right: 20px;
    .icon {
      display: inline-block;
      margin-right: 5px;
      border-radius: 100%;
      height: 14px;
      width: 14px;
      border: 2px solid #409eff;
      position: relative;
      &.actor-select-radio__selected:after {
        content: "";
        position: absolute;
        height: 6px;
        width: 6px;
        top: 2px;
        left: 2px;
        border-radius: 100%;
        background-color: #409eff;
      }
    }
    .icon + span {
      color: #666;
    }
  }
}
</style>

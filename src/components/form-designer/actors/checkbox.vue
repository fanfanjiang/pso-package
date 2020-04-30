<template>
  <div class="actor-select">
    <common-actor :cpnt="cpnt" :placeholder="false" :border="visible">
      <div class="actor-select-radio flex-row-center-between" v-if="!visible">
        <div
          class="actor-select-radio__item flex-row-center"
          v-for="(item,idx) of cpnt.data._option"
          :key="item._optionValue"
        >
          <span
            :class="{'icon':true,'actor-select-radio__selected':cpnt.data._defaultValueList[idx]===item._optionValue}"
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
        background-color: #409eff;
      }
    }
    .icon + span {
      color: #666;
    }
  }
}
</style>

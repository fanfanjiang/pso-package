<template>
  <div class="actor-panel-header">
    <div class="actor-panel-header__title">
      <span :class="icon"></span>
      <span v-if="!$parent.$props||$parent.$props.cpnt.CPNT.layout">{{name}}</span>
      <el-dropdown
        v-else-if="$parent.$props.cpnt"
        @command="changeHandler"
        size="mini"
        trigger="click"
      >
        <span class="el-dropdown-link">
          {{name}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <template v-for="m in $parent.$props.cpnt.store.__menu__">
            <el-dropdown-item
              v-if="!m.layout&&$parent.$props.cpnt.componentid!==m.componentid"
              :key="m.componentid"
              :command="m.componentid"
            >{{m.name}}</el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="actor-panel-header__info">{{info}}</div>
  </div>
</template>
<script>
import { transferCpnt } from "../helper";
export default {
  props: ["icon", "name", "info"],
  methods: {
    changeHandler(cid) {
      transferCpnt(this.$parent.$props.cpnt.data, cid);
    },
  },
};
</script>
<style lang="less" scoped>
.actor-panel-header {
  padding: 15px;
  background-color: #f1f2f3;
  margin-bottom: 20px;
  border-radius: 10px;
  .actor-panel-header__title {
    > span:first-child {
      color: #999;
      margin-right: 10px;
    }
    > span:last-child {
      font-size: 16px;
      color: #666;
      font-weight: bold;
    }
  }
  .actor-panel-header__info {
    font-size: 12px;
    color: #999;
    margin-top: 20px;
  }
}
</style>
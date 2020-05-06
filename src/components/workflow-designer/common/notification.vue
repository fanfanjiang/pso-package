<template>
  <div class="pso-wf-notification">
    <el-divider content-position="left">设置通知</el-divider>
    <el-form-item label="通知类型">
      <el-radio v-model="node.notification.type" :label="2">自定义</el-radio>
      <el-radio v-model="node.notification.type" :label="1">系统</el-radio>
    </el-form-item>
    <el-form-item label="设置通知人" v-if="node.notification.type===2">
      <pso-picker-user
        ref="userSelector"
        :pattern="node.notification.pattern"
        :show="showUserSelector"
        @confirm="handleAddSelection"
        @cancel="showUserSelector=false"
      ></pso-picker-user>
      <div class="wf-panel-usersection">
        <div class="wf-panel-usersection__list">
          <el-tag
            size="medium"
            closable
            @close="handleDelSelection(item)"
            v-for="(item,index) of node.notification.list"
            :key="index"
          >{{item.user_name}}</el-tag>
        </div>
      </div>
    </el-form-item>
  </div>
</template>
<script>
import { pickerMixin } from "../../../mixin/picker";

export default {
  props: ["node"],
  mixins: [pickerMixin({ baseObjName: "node.notification", dataListName: "list", typeName: "pattern" })],
  data() {
    return {
      showUserSelector: false
    };
  },
  watch: {
    "node.notification.list": {
      deep: true,
      handler(users) {
        this.node.notification.value = _.map(users, "user_id").join(",");
      }
    }
  }
};
</script>
<style lang="less" scoped>
.pso-wf-notification {
  margin-bottom: 50px;
}
.wf-panel-usersection {
  .wf-panel-usersection__list {
    > span {
      margin-right: 5px;
    }
  }
}
</style>
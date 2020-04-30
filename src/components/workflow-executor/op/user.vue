<template>
  <div class="pso-wf-executor__user">
    <div class="pso-wf-executor__user-header">
      <span>{{wfExecutor.userOp.text}}</span>
      <pso-picker-user
        ref="userSelector"
        :show="show"
        pattern="checkbox"
        @confirm="getUsers"
        @cancel="show=false"
      ></pso-picker-user>
    </div>
    <div class="pso-wf-executor__user-body">
      <el-tag
        v-for="item in wfExecutor.userOp.users"
        :key="item.user_id"
        closable
        @close="delUser(item)"
      >{{item.user_name}}</el-tag>
    </div>
    <div class="pso-wf-executor__user-footer">
      <el-button type="text" size="small" @click="$emit('close')">取消</el-button>
      <el-button type="success" size="small" @click="$emit('confirm')">{{wfExecutor.userOp.text}}</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

export default {
  props: {},
  data() {
    return {
      show: false
    };
  },
  computed: {
    ...mapState(["wfExecutor"])
  },
  methods: {
    getUsers(users) {
      this.wfExecutor.userOp.users = _.uniqBy(this.wfExecutor.userOp.users.concat(this.$refs.userSelector.getUsers()), "user_id");
      this.show = false;
    },
    delUser(user) {
      let index = _.findIndex(this.wfExecutor.userOp.users, { user_id: user.user_id });
      this.wfExecutor.userOp.users.splice(index, 1);
    }
  }
};
</script>
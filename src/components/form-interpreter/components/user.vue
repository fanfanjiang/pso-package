<template>
  <pso-label :cpnt="cpnt">
    <div style="display: flex; align-items: center">
      <div class="pso-form-user-selectedlist" v-if="!loading && proxy.list.length">
        <el-tag v-for="item in proxy.list" size="medium" :key="item.user_id" :closable="cpntEditable" @close="handleDelSelection(item)">{{
          item.user_name
        }}</el-tag>
      </div>
      <pso-skeleton v-if="loading" :lines="1" :s-style="{ width: '120px', padding: '0 5px' }"></pso-skeleton>
      <pso-picker-user v-if="cpntEditable" :pattern="cpnt.data._type" @confirm="handleAddSelection">
        <div style="margin-top: -4px">
          <el-button size="mini" icon="el-icon-plus" circle></el-button>
        </div>
      </pso-picker-user>
    </div>
  </pso-label>
</template>
<script>
import { pickerMixin } from "../../../mixin/picker";
import cpntMixin from "../mixin";
import { mapState } from "vuex";

export default {
  mixins: [pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type" }), cpntMixin],
  data() {
    return {
      loading: false,
      proxy: {
        list: [],
        type: this.cpnt.data._type,
      },
    };
  },
  computed: {
    ...mapState(["base"]),
  },
  watch: {
    "proxy.list"(val) {
      if (val && val.length) {
        this.cpnt.data._val = _.map(val, "user_id").join(",");
      } else {
        this.cpnt.data._val = "";
      }
    },
  },
  async created() {
    this.loading = true;

    if (this.cpnt.data._val) {
      await this.setDataByIds(this.cpnt.data._val.split(","));
    } else if (this.cpnt.data._defaultValType === "current" && this.base.user && this.base.user.user_id) {
      await this.setDataByIds([this.base.user.user_id]);
    } else {
      this.proxy.valList = [];
    }
    this.loading = false;
    //初始化时
    this.dispatch("PsoformInterpreter", "cpnt-user-changed", { cpnt: this.cpnt, value: this.cpnt.data._val, proxy: this.proxy });
  },
  methods: {
    async getUser(user_id) {
      return await this.API.user({ data: { user_id }, method: "get" });
    },
    async setDataByIds(users) {
      if (users && typeof users === "string") {
        users = users.split(",");
      }
      const list = [];
      for (let uid of users) {
        const userRet = await this.getUser(uid);
        if (userRet && userRet.user_id) list.push(userRet);
      }
      this.handleAddSelection(list);
    },
  },
};
</script>
<style lang="less" scoped>
.pso-form-user-selectedlist {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 5px;
  > span {
    margin: 2px;
    box-sizing: content-box;
  }
}
</style>
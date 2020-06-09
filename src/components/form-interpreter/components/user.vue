<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <div class="pso-form-user-selectedlist" v-if="!loading&&proxy.list.length">
      <el-tag
        v-for="item in proxy.list"
        :key="item.user_id"
        :closable="storeEditable&&!cpnt.data._read"
        @close="handleDelSelection(item)"
      >{{item.user_name}}</el-tag>
    </div>
    <pso-skeleton v-if="loading" :lines="1"></pso-skeleton>
    <pso-picker-user
      v-if="storeEditable&&!cpnt.data._read"
      :pattern="cpnt.data._type"
      @confirm="handleAddSelection"
    ></pso-picker-user>
  </el-form-item>
</template>
<script>
import { pickerMixin } from "../../../mixin/picker";
import cpntMixin from "../mixin";

export default {
  mixins: [pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type" }), cpntMixin],
  data() {
    return {
      loading: false,
      proxy: {
        list: [],
        type: this.cpnt.data._type
      }
    };
  },
  watch: {
    "proxy.list"(val) {
      if (val && val.length) {
        this.cpnt.data._val = _.map(val, "user_id").join(",");
      } else {
        this.cpnt.data._val = "";
      }
    }
  },
  async created() {
    if (this.cpnt.data._val) {
      this.loading = true;
      for (let uid of this.cpnt.data._val.split(",")) {
        const userRet = await this.getUser(uid);
        if (userRet && userRet.user_id) this.proxy.list.push(userRet);
      }
      this.loading = false;
    } else if (this.cpnt.data._defaultValType === "current") {
    }
    this.dispatch("PsoformInterpreter", "cpnt-user-changed", { cpnt: this.cpnt, value: this.cpnt.data._val, proxy: this.proxy });
  },
  methods: {
    async getUser(user_id) {
      return await this.API.user({ data: { user_id }, method: "get" });
    }
  }
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
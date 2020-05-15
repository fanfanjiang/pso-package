<template>
  <div class="pso-wf-executor__user">
    <div class="pso-wf-executor__user-header">
      <span>{{store.userOp.text}}</span>
      <pso-picker-user
        ref="userSelector"
        :show="show"
        pattern="checkbox"
        @confirm="handleAddSelection"
        @cancel="show=false"
      ></pso-picker-user>
    </div>
    <div class="pso-wf-executor__user-body">
      <el-tag
        v-for="item in proxy.list"
        :key="item.user_id"
        closable
        @close="handleDelSelection(item)"
      >{{item.user_name}}</el-tag>
    </div>
    <div class="pso-wf-executor__user-footer">
      <el-button type="text" size="small" @click="$emit('close')">取消</el-button>
      <el-button type="success" size="small" @click="$emit('confirm')">{{store.userOp.text}}</el-button>
    </div>
  </div>
</template>
<script>
import { pickerMixin } from "../../../mixin/picker";
export default {
  mixins: [pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type" })],
  props: {
    store: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      show: false,
      proxy: {
        list: [],
        type: "checkbox"
      }
    };
  },
  watch: {
    "proxy.list"(val) {
      if (val && val.length) {
        this.store.userOp.users = _.map(val, "user_id").join(",");
      } else {
        this.store.userOp.users = "";
      }
    }
  }
};
</script>
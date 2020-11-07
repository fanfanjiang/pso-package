<template>
  <div class="multiple-users__item">
    <div class="multiple-users__item-body">
      <el-tag v-for="d in proxy.list" :key="d.user_id" closable @close="handleDelSelection(d)">{{ d.user_name }}</el-tag>
    </div>
    <pso-picker-user ref="userSelector" :show="show" pattern="checkbox" @confirm="handleAddSelection" @cancel="show = false">
      <div style="margin-top: -5px">
        <el-button size="mini" icon="el-icon-plus" circle></el-button>
      </div>
    </pso-picker-user>
  </div>
</template>
<script>
import { pickerMixin } from "../../mixin/picker";

export default {
  mixins: [pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type" })],
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    ufield: String,
  },
  data() {
    return {
      show: false,
      proxy: {
        list: [],
        type: "checkbox",
      },
    };
  },
  watch: {
    "proxy.list"(val) {
      if (val && val.length) {
        this.data[this.ufield] = _.map(val, "user_id").join(",");
      } else {
        this.data[this.ufield] = "";
      }
    },
  },
};
</script>
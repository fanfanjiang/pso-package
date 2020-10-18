<template>
  <div class="pso-wf-executor__user">
    <div class="pso-wf-executor__user-header">
      <span>{{ store.userOp.title || store.userOp.text }}</span>
      <pso-picker-user
        ref="userSelector"
        :show="show"
        pattern="checkbox"
        @confirm="handleAddSelection"
        @cancel="show = false"
      ></pso-picker-user>
    </div>
    <div class="pso-wf-executor__user-body">
      <el-tag v-for="item in proxy.list" :key="item.user_id" closable @close="handleDelSelection(item)">{{ item.user_name }}</el-tag>
    </div>
    <div class="pso-wf-executor__user-comment">
      <el-input type="textarea" :rows="2" placeholder="请输入意见" v-model="store.data.opinion"></el-input>
    </div>
    <div class="pso-executor-op__footer">
      <div class="pso-executor-op__footer-body">
        <el-form>
          <pso-form-attach :cpnt="attach" @value-change="handleAttachChange">
            <el-button icon="el-icon-paperclip" plain size="mini"></el-button>
          </pso-form-attach>
        </el-form>
      </div>
      <div class="pso-executor-op__footer-btn">
        <el-button size="mini" type="text" @click="$emit('close')">取消</el-button>
        <el-button type="success" size="mini" @click="handleConfirm">{{ store.userOp.text }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { pickerMixin } from "../../../mixin/picker";
import { opAttach } from "../mixin";

export default {
  mixins: [opAttach, pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type" })],
  props: {
    store: {
      type: Object,
      default: () => ({}),
    },
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
        this.store.userOp.users = _.map(val, "user_id").join(",");
      } else {
        this.store.userOp.users = "";
      }
    },
  },
  methods: {
    handleConfirm() {
      this.$emit("confirm");
    },
  },
};
</script>
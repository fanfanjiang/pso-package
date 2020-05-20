<template>
  <div class="pso-executor-op">
    <el-popconfirm
      v-if="justShowConfirm"
      @onConfirm="confirm"
      v-model="visible"
      :title="confirmText"
    >
      <el-button slot="reference" plain :type="type" size="small">{{text}}</el-button>
    </el-popconfirm>
    <el-popover
      v-else
      placement="top"
      width="300"
      transition="el-zoom-in-top"
      trigger="click"
      v-model="visible"
    >
      <el-radio-group v-if="store.curStep.atype==='tag'" v-model="store.data.opinion" size="mini">
        <template v-if="showOkTag">
          <el-radio :label="text" v-for="text of WF_TAG_TEXT_PASS" :key="text">{{text}}</el-radio>
        </template>
        <template v-else>
          <el-radio :label="text" v-for="text of WF_TAG_TEXT_REJECT" :key="text">{{text}}</el-radio>
        </template>
      </el-radio-group>
      <el-input
        v-if="store.curStep.atype==='opinion'"
        type="textarea"
        :rows="2"
        placeholder="请输入意见"
        v-model="store.data.opinion"
      ></el-input>
      <div class="pso-executor-op__confitm">
        <el-button size="small" type="text" @click="visible=false">取消</el-button>
        <el-button type="primary" size="small" @click="confirm">{{text}}</el-button>
      </div>
      <el-button slot="reference" plain :type="type" size="small">{{text}}</el-button>
    </el-popover>
  </div>
</template>
<script>
import { WF_TAG_TEXT_PASS, WF_TAG_TEXT_REJECT } from "../../../const/workflow";

export default {
  props: {
    op: Object,
    text: String,
    type: {
      type: String,
      default: "primary"
    },
    store: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    confirmText() {
      return `你确定要${this.text}吗？`;
    },
    showOkTag() {
      return ["confirm"].indexOf(this.op.id) !== -1;
    },
    justShowConfirm() {
      return this.store.curStep.atype === "form" || this.store.curStep.atype === "sign" || this.store.data.msg_tag === 1;
    }
  },
  data() {
    return {
      visible: false,
      WF_TAG_TEXT_PASS: WF_TAG_TEXT_PASS,
      WF_TAG_TEXT_REJECT: WF_TAG_TEXT_REJECT
    };
  },
  methods: {
    confirm() {
      this.visible = false;
      this.$emit("confirm");
    }
  }
};
</script>
<style lang="less" scoped>
.pso-executor-op {
  display: inline-block;
}
.pso-executor-op__confitm {
  text-align: right;
  margin-top: 20px;
}
</style>

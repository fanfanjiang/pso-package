<template>
  <div class="pso-executor-op">
    <el-popconfirm v-if="justShowConfirm" @onConfirm="confirm" v-model="visible" :title="confirmText">
      <el-button slot="reference" plain :type="type" size="small">{{ text }}</el-button>
    </el-popconfirm>
    <el-popover
      v-else
      placement="top"
      width="300"
      transition="el-zoom-in-top"
      trigger="click"
      ref="popover"
      :popper-options="{ boundariesElement: 'body', removeOnDestroy: true }"
      v-model="visible"
    >
      <el-radio-group v-if="store.curStep.atype === 'tag'" v-model="store.data.opinion" size="mini">
        <template v-if="showOkTag">
          <el-radio :label="text" v-for="text of WF_TAG_TEXT_PASS" :key="text">{{ text }}</el-radio>
        </template>
        <template v-else>
          <el-radio :label="text" v-for="text of WF_TAG_TEXT_REJECT" :key="text">{{ text }}</el-radio>
        </template>
      </el-radio-group>
      <el-input v-if="showOption" type="textarea" :rows="2" placeholder="请输入意见" v-model="store.data.opinion"></el-input>
      <div class="pso-executor-op__footer">
        <div class="pso-executor-op__footer-body">
          <el-form>
            <pso-form-attach :cpnt="attach" @value-change="handleAttachChange">
              <el-button icon="el-icon-paperclip" plain size="mini"></el-button>
            </pso-form-attach>
          </el-form>
        </div>
        <div class="pso-executor-op__footer-btn">
          <el-button size="mini" type="text" @click="visible = false">取消</el-button>
          <el-button :type="type" size="mini" @click="confirm">{{ text }}</el-button>
        </div>
      </div>
      <el-button slot="reference" plain :type="type" size="small">{{ text }}</el-button>
    </el-popover>
  </div>
</template>
<script>
import { WF_TAG_TEXT_PASS, WF_TAG_TEXT_REJECT } from "../../../const/workflow";
import { opAttach } from "../mixin";

export default {
  mixins: [opAttach],
  props: {
    op: Object,
    text: String,
    type: {
      type: String,
      default: "primary",
    },
    store: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    confirmText() {
      return `你确定要${this.text}吗？`;
    },
    showOkTag() {
      return ["confirm"].indexOf(this.op.id) !== -1;
    },
    justShowConfirm() {
      return (
        !this.store.mustFillAsCreator &&
        (this.store.curStep.atype === "form" || this.store.curStep.atype === "sign" || this.store.data.msg_tag === 1)
      );
    },
    showOption() {
      return this.store.mustFillAsCreator || this.store.curStep.atype === "opinion";
    },
  },
  data() {
    return {
      visible: false,
      WF_TAG_TEXT_PASS: WF_TAG_TEXT_PASS,
      WF_TAG_TEXT_REJECT: WF_TAG_TEXT_REJECT,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.store.data.opinion = "";
      }
    },
  },
  methods: {
    confirm() {
      this.visible = false;
      this.store.data.opinion = this.store.data.opinion || (this.showOkTag ? "通过" : "不同意");
      this.$emit("confirm", true);
    },
  },
};
</script>

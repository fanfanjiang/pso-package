<template>
  <div class="pso-wf-executor__op">
    <div v-if="store.curStep">
      <el-button v-if="showSave" type="primary" plain size="small" @click="saveForm">暂存</el-button>
      <pso-wf-confirm
        :store="store"
        v-if="showCommand(REVIEW_OP_TYPE.confirm.value)"
        :op="REVIEW_OP_TYPE.confirm"
        :text="nextText"
        @confirm="confirm"
      ></pso-wf-confirm>
      <pso-wf-confirm
        :store="store"
        v-if="showCommand(REVIEW_OP_TYPE.end.value)"
        :op="REVIEW_OP_TYPE.end"
        text="结束"
        @confirm="end"
      ></pso-wf-confirm>
      <el-button
        v-if="showCommand(REVIEW_OP_TYPE.pickreject.value)"
        type="primary"
        plain
        size="small"
        @click="goPickreject"
      >指定</el-button>
      <pso-wf-confirm
        :store="store"
        v-if="showCommand(REVIEW_OP_TYPE.rollback.value)"
        :op="REVIEW_OP_TYPE.rollback"
        type="danger"
        text="回退"
        @confirm="rollback"
      ></pso-wf-confirm>
      <pso-wf-confirm
        :store="store"
        v-if="showCommand(REVIEW_OP_TYPE.reject.value)"
        :op="REVIEW_OP_TYPE.reject"
        type="danger"
        text="打回"
        @confirm="reject"
      ></pso-wf-confirm>
    </div>
    <el-dropdown @command="handleCommand">
      <el-button size="small">
        更多
        <i class="el-icon-more"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <template v-if="superable&&store.curStep">
          <el-dropdown-item command="copy">抄送</el-dropdown-item>
          <el-dropdown-item command="distribute">分发</el-dropdown-item>
          <el-dropdown-item command="addSign">加签</el-dropdown-item>
        </template>
        <el-dropdown-item command="print">打印</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import PsoWfConfirm from "./confirm";
import { op } from "../mixin";

export default {
  components: { PsoWfConfirm },
  mixins: [op],
  props: {
    store: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    superable() {
      //只有分发才隐藏
      return this.store.data.msg_tag === 1 ? false : true;
    },
    showSave() {
      return this.store.hasCreatorPower && this.store.data.status === this.REVIEW_STATUS.save.value;
    },
    nextText() {
      return this.store.isCreator
        ? "提交"
        : this.store.data.instanceId && this.store.data.status != this.REVIEW_STATUS.save.value
        ? "通过"
        : "提交";
    },
    superpower() {
      return this.hasCreatorPower;
    }
  },
  methods: {
    handleCommand(command) {
      this[command] && this[command]();
    },
    showCommand(command) {
      if (command === 2 && this.store.hasCreatorPower) {
        return true;
      }
      if (this.store.curStep.atype === "sign") {
        return command === 2;
      } else if (this.store.data.msg_tag === 0) {
        return false;
      } else if (this.store.data.msg_tag === 1) {
        return command === 2;
      } else {
        return (this.store.curStep.op & command) === command;
      }
    },
    async confirm() {
      await this.nextStep(this.REVIEW_OP_TYPE.confirm.type);
    },
    async reject() {
      await this.nextStep(this.REVIEW_OP_TYPE.reject.type);
    },
    goPickreject() {
      if (this.store.displayMode === "simple") {
        $(".pso-wf-executor__main .vb-content").scrollTop(0);
      }
      if (this.store.showBody) {
        this.store.showBody = false;
        this.store.activeExtendTab = "flowchart";
      } else {
        this.store.showBody = true;
      }
    },
    async end() {
      await this.nextStep(this.REVIEW_OP_TYPE.end.type);
    },
    async rollback() {
      await this.nextStep(this.REVIEW_OP_TYPE.rollback.type);
    },
    copy() {
      this.openUserOp({ text: "抄送", op: "Copy" });
    },
    distribute() {
      this.openUserOp({ text: "分发", op: "Distribute" });
    },
    addSign() {
      this.openUserOp({ text: "加签", op: "AddSign" });
    },
    openUserOp({ text, op }) {
      this.store.userOp.text = text;
      this.store.userOp.appendType = op;
      this.store.showUserOp = true;
    },
    print() {
      this.$emit("print");
    }
  }
};
</script>
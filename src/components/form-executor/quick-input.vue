<template>
  <pso-dialog customclass="quick-input" :visible="show" width="40%" @close="show = false" @opened="openedHandler">
    <template #title>
      <pso-dialog-header>
        <template #title>
          <i class="el-icon-edit-outline"></i>
          <span>快捷输入</span>
        </template>
      </pso-dialog-header>
    </template>
    <div>
      <el-input ref="input" clearable v-model="input" @keydown.native.enter.exact="confirm" placeholder="按回车确认输入"></el-input>
    </div>
  </pso-dialog>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      input: "",
      quickStore: null,
    };
  },
  methods: {
    openedHandler() {
      this.focusInput();
    },
    focusInput() {
      this.$refs.input.focus();
    },
    confirm() {
      this.quickStore.setQuickInput && this.quickStore.setQuickInput(this.input);
      this.show = false;
    },
    initKeyevent(store) {
      this.quickStore = store;
      if (!this.quickStore.quickInputable) return;
      $(window).keydown(this.checkKeyevent);
      this.$store.commit("APP_PUSHSTORE", { store });
    },
    clearKeyevent() {
      if (!this.quickStore.quickInputable) return;
      this.$store.commit("APP_POPSTORE");
      $(window).unbind("keydown", this.checkKeyevent);
    },
    checkKeyevent(e) {
      if (e.ctrlKey && e.which == 13) {
        if (this.$store.state.base.quickInput.curStore === this.quickStore) {
          this.show = true;
        }
      }
    },
  },
};
</script>
<style lang="less">
.quick-input {
  display: flex;
  align-items: center;
  &.pso-dialog {
    .el-dialog {
      background: transparent;
      box-shadow: none;
      margin-top: -60px !important;
      .el-dialog__header {
        background: transparent;
        padding: 0;
        border: none;
        .el-dialog__headerbtn {
          i {
            color: #fff !important;
          }
        }
        .form-executor-header {
          .form-executor-title {
            background: transparent;
            color: #fff;
            font-size: 18px;
            padding: 0;
          }
        }
      }
      .pso-dialog-body {
        height: auto !important;
        .el-input {
          input {
            border: none;
          }
        }
      }
    }
  }
}
</style>
<template>
  <div class="pso-chat-input">
    <div class="pso-chat-input__body">
      <div class="pso-chat-input__avatar">
        <pso-avatar size="medium" :nick="store.curUser.user_nick"></pso-avatar>
      </div>
      <div class="pso-chat-input__input" ref="chartInputWrapper">
        <el-input
          type="textarea"
          autosize
          placeholder="按Ctrl+Enter快速发表评论"
          ref="chartInput"
          v-model="store.input"
          @input="handleInputChange"
          @focus="handleFocus"
          @keydown.native.enter="handleEnter"
          @keydown.native.enter.ctrl.exact="hancleClickSubmit"
        >
        </el-input>
      </div>
    </div>
    <div class="pso-chat-input__footer">
      <el-form class="pso-chat-input__file">
        <pso-form-attach ref="attach" :cpnt="attach" @value-change="handleAttachChange" :downloadable="false">
          <div class="pso-button"><i class="el-icon-paperclip"></i></div>
        </pso-form-attach>
      </el-form>
      <div class="pso-chat-input__ctrl">
        <div class="pso-button" @click="addAT"><i class="fa fa-at"></i></div>
        <el-button size="mini" type="primary" @click="hancleClickSubmit">发送</el-button>
      </div>
    </div>
    <transition name="el-zoom-in-bottom">
      <chat-user-popper v-show="store.opener.show" :opener="store.opener" @confirm="handleConfirmUser" ref="userPopper"> </chat-user-popper>
    </transition>
  </div>
</template>
<script>
import { Attach } from "../../mixin/form";
import ChatUserPopper from "./user-popper";

export default {
  components: { ChatUserPopper },
  mixins: [Attach],
  props: {
    store: Object,
  },
  data() {
    return {};
  },
  created() {
    this.createCpnt();
  },
  mounted() {
    this.store.inputEl = $(this.$refs.chartInputWrapper).find("textarea")[0];
  },
  methods: {
    handleInputChange(e) {
      this.store.analyzeInput(this.store.getCursorPosition());
    },
    handleAttachChange({ value }) {
      this.store.inputAttach = value;
    },
    async hancleClickSubmit() {
      await this.store.createMsg();
      this.$refs.attach.getImages();
    },
    handleConfirmUser(data) {
      this.store.insertUser(data);
      this.$refs.chartInput.focus();
    },
    handleEnter(e) {
      // e.ctrlKey
      if (this.$refs.userPopper.users.length !== 1) return;
      e.preventDefault();
      this.store.insertUser(this.$refs.userPopper.users[0]);
      this.store.analyzeInput(this.store.getCursorPosition());
    },
    handleFocus() {
      this.store.getCursorPosition();
    },
    addAT() {
      this.store.getCursorPosition();
      this.store.insert(this.store.cursor, 0, "@");
      this.$refs.chartInput.focus();
      setTimeout(() => {
        this.store.setCursorPosition(this.store.cursor + 1);
        this.handleInputChange();
      }, 100);
    },
  },
};
</script>
<template>
  <div class="pso-chat-input">
    <div class="pso-chat-input__body">
      <div class="pso-chat-input__avatar">
        <pso-avatar size="medium" :nick="store.curUser.user_nick"></pso-avatar>
      </div>
      <div class="pso-chat-input__input">
        <el-input type="textarea" autosize placeholder="测试中，暂未正式使用" v-model="store.input"> </el-input>
      </div>
    </div>
    <div class="pso-chat-input__footer">
      <div class="pso-chat-input__ctrl">
        <el-form>
          <pso-form-attach ref="attach" :cpnt="attach" @value-change="handleAttachChange" :downloadable="false">
            <div class="pso-button"><i class="el-icon-paperclip"></i></div>
          </pso-form-attach>
        </el-form>
      </div>
      <el-button size="mini" type="primary" @click="hancleClickSubmit">发送</el-button>
    </div>
  </div>
</template>
<script>
import { Attach } from "../../mixin/form";

export default {
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
  methods: {
    handleAttachChange({ value }) {
      this.store.inputAttach = value;
    },
    async hancleClickSubmit() {
      await this.store.createMsg();
      this.$refs.attach.getImages();
    },
  },
};
</script>
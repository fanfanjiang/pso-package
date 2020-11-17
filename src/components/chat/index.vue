<template>
  <div class="pso-chat">
    <div class="pso-chat__history" ref="history">
      <template v-for="(m, i) in store.messages">
        <chat-msg :key="i" :message="m" :store="store"></chat-msg>
      </template>
    </div>
    <div class="pso-chat__input">
      <chat-input :store="store"></chat-input>
    </div>
  </div>
</template>
<script>
import ChatMsg from "./message";
import ChatInput from "./input";
import ChatStore from "./store";

export default {
  components: { ChatMsg, ChatInput },
  props: {
    relatedId: String,
    extend: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      store: null,
    };
  },
  created() {
    this.store = new ChatStore({ curUser: this.$store.state.base.user, relatedId: this.relatedId, extend: this.extend, $vue: this });
    this.store.initialize();
  },
  mounted() {
    this.store.refHistory = this.$refs.history;
  },
};
</script> 
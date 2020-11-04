<template>
  <div class="pso-chat-users-wrapper" :style="wrapperStyle">
    <div class="pso-chat-users" ref="panel">
      <ul>
        <li v-for="(d, i) in users" :key="i" @click="addUser(d)">
          <pso-avatar :size="22" :nick="d.user_name"></pso-avatar>
          <span>{{ d.user_name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import addEventListener from "../../utils/dom/addEventListener";
export default {
  props: {
    opener: Object,
  },
  data() {
    this.listener = null;
    return {
      popperHeight: 200,
    };
  },
  computed: {
    users() {
      return this.opener.data.filter((d) =>
        this.opener.keywords ? d.user_name !== this.opener.keywords && d.user_name.indexOf(this.opener.keywords) !== -1 : true
      );
    },
    wrapperStyle() {
      return {
        top: `${-this.popperHeight + this.opener.offset.top}px`,
        left: `${this.opener.offset.left}px`,
      };
    },
  },
  watch: {
    "users.length"(length) {
      if (!length) {
        this.opener.show = false;
      } else if (this.opener.startIndex !== undefined) {
        this.opener.show = true;
      }
      this.checkPopperHeight();
    },
    "opener.show"(val) {
      if (val) {
        this.checkPopperHeight();
      }
    },
  },
  created() {
    this.listener = addEventListener(document, "click", (e) => {
      this.handleDocumentClick(e);
    });
  },
  destroyed() {
    if (this.listener) {
      this.listener.remove();
      this.listener = null;
    }
  },
  methods: {
    checkPopperHeight() {
      this.$nextTick(() => {
        this.popperHeight = $(".pso-chat-users-wrapper").height();
      });
    },
    handleDocumentClick(e) {
      if (this.$refs.panel.contains(e.target)) {
        return;
      }
      this.opener.show = false;
    },
    addUser(data) {
      this.$emit("confirm", data);
    },
  },
};
</script>
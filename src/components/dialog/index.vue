<template>
  <el-dialog
    :class="['pso-dialog', customclass, innerclass, cid]"
    :title="title"
    :visible="visible"
    :width="width"
    append-to-body
    :destroy-on-close="destroy"
    :before-close="checkClose"
    :close-on-press-escape="false"
    :close-on-click-modal="closeOnModal"
    :top="top"
    @open="$emit('open')"
    @close="$emit('close')"
    @closed="closed"
    @opened="opened"
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <div class="pso-dialog-body" :style="bodyStyle">
      <slot v-if="rendered"></slot>
    </div>
  </el-dialog>
</template>
<script>
import shortid from "shortid";
export default {
  props: {
    title: String,
    visible: Boolean,
    width: {
      type: String,
      default: "30%",
    },
    destroy: {
      type: Boolean,
      default: true,
    },
    customclass: {
      type: String,
      default: "",
    },
    top: {
      type: String,
      default: "4vh",
    },
    closeOnModal: {
      type: Boolean,
      default: false,
    },
    noheader: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rendered: false,
      startMask: false,
      cid: shortid.generate(),
      innerclass: "",
    };
  },
  computed: {
    bodyStyle() {
      return {
        height: `calc(100vh - ${this.noheader ? "0px" : "54px"} - ${this.top})`,
      };
    },
  },
  created() {
    if (this.noheader) {
      this.innerclass = "dialog-noheader";
    }
  },
  watch: {
    visible(val) {
      this.rendered = val ? true : this.destroy && false;
    },
  },
  methods: {
    checkClose(done) {
      this.startMask && done();
    },
    checkClick(e) {
      this.startMask = !$(e.target).parents(".pso-dialog-body").length && !$(e.target).is("input");
    },
    opened() {
      $(`.${this.cid}`).on("mousedown", this.checkClick);
      this.$emit("opened");
    },
    closed() {
      $(`.${this.cid}`).unbind("mousedown", this.checkClick);
    },
  },
};
</script>
<template>
  <el-dialog
    :class="['pso-dialog', customclass]"
    :title="title"
    :visible="visible"
    :width="width"
    append-to-body
    :destroy-on-close="destroy"
    :before-close="checkClose"
    :top="top"
    @open="$emit('open')"
    @close="$emit('close')"
    @closed="closed"
    @opened="opened"
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <div class="pso-dialog-body">
      <slot v-if="rendered"></slot>
    </div>
  </el-dialog>
</template>
<script>
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
  },
  data() {
    return {
      rendered: false,
      startMask: false,
    };
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
      this.startMask = !$(e.target).parents(".pso-dialog-body").length;
    },
    opened() {
      $(".pso-dialog").on("mousedown", this.checkClick);
      this.$emit('opened');
    },
    closed() {},
  },
};
</script>
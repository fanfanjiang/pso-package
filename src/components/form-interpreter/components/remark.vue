<template>
  <div ref="remark" class="pso-form-remark">
    <markdown-editor :editable="false" :proxy="cpnt.data" vfield="_defaultValue"></markdown-editor>
  </div>
</template>
<script>
import MarkdownEditor from "../../markdown-editor";
export default {
  components: { MarkdownEditor },
  props: {
    cpnt: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    this.$nextTick(() => {
      $(this.$refs.remark)
        .find(".markdown-body")
        .css({
          "min-width": "100%",
          "min-height": "100%",
          color: this.cpnt.data._color,
        })
        .find(".v-show-content")
        .css({
          padding: "10px",
        })
        .find("p:last-child")
        .css({
          margin: "0",
        });
    });
  },
};
</script>
<style lang="less" scoped>
.pso-form-remark {
  background: #fff;
  letter-spacing: 1.2px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  position: relative;
  z-index: 0;
}
</style>
<template>
  <mavon-editor
    v-model="proxy[vfield]"
    :boxShadow="false"
    previewBackground="#fff"
    :subfield="editable"
    :default-open="defaultOpen"
    :toolbars-flag="editable"
    :editable="editable"
    :toolbars="toolbars"
    :xss-options="xssOptions"
  />
</template>  
<script>
export default {
  props: {
    editable: {
      type: Boolean,
      default: true,
    },
    proxy: Object,
    vfield: {
      type: String,
      default: "_val",
    },
  },
  data() {
    this.toolbars = {
      bold: true, // 粗体
      italic: true, // 斜体
      header: true, // 标题
      underline: true, // 下划线
      strikethrough: true, // 中划线
      mark: true, // 标记
      superscript: true, // 上角标
      subscript: true, // 下角标
      quote: true, // 引用
      ol: true, // 有序列表
      ul: true, // 无序列表
      link: true, // 链接
      imagelink: false, // 图片链接
      code: true, // code
      table: true, // 表格
      fullscreen: true, // 全屏编辑
      readmodel: true, // 沉浸式阅读
      htmlcode: true, // 展示html源码
      help: true, // 帮助
      /* 1.3.5 */
      undo: true, // 上一步
      redo: true, // 下一步
      trash: true, // 清空
      save: false, // 保存（触发events中的save事件）
      /* 1.4.2 */
      navigation: true, // 导航目录
      /* 2.1.8 */
      alignleft: true, // 左对齐
      aligncenter: true, // 居中
      alignright: true, // 右对齐
      /* 2.2.1 */
      preview: true, // 预览
    };
    this.xssOptions = {
      whiteList: {
        a: ["href", "title", "target", "download"],
        img: ["src", "alt", "width", "height"],
        video: ["src", "type", "controls", "width", "height", "poster"],
        source: ["src", "type"],
        br: [],
        div: ["class"],
      },
      stripIgnoreTagBody: true,
    };
    return {};
  },
  computed: {
    defaultOpen() {
      return this.editable ? "edit" : "preview";
    },
  },
};
</script>
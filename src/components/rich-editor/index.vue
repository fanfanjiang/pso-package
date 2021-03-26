<template>
  <editor
    api-key="no-api-key"
    v-model="proxy[vfield]"
    :init="{
      language_url: '/static/app/libs/tinymce/langs/zh_CN.js',
      language: 'zh_CN',
      height: 300,
      menubar: false,
      plugins: [
        'advlist autolink lists link image charmap print',
        'searchreplace visualblocks code',
        'insertdatetime media table paste code wordcount',
      ],
      toolbar:
        'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | print | insertfile image media pageembed template link codesample | a11ycheck ltr rtl | showcomments addcomment',
    }"
  />
</template>
<script>
import Editor from "@tinymce/tinymce-vue";
export default {
  components: { Editor },
  props: {
    proxy: Object,
    vfield: {
      type: String,
      default: "_val",
    },
  },
};
</script>
<style lang="less">
.tox-tinymce-aux {
  z-index: 3000 !important;
}
.tox-notifications-container {
  display: none !important;
}
</style>
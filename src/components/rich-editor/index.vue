<template>
  <div ref="rich">
    <editor api-key="no-api-key" v-model="proxy[vfield]" :init="options" />
  </div>
</template>
<script>
import Editor from "@tinymce/tinymce-vue";
import { URLToFile } from "../../utils/blob";
import URLparser from "../../utils/url";

export default {
  components: { Editor },
  props: {
    proxy: Object,
    vfield: {
      type: String,
      default: "_val",
    },
  },
  data() {
    return {
      replacing: false,
    };
  },
  computed: {
    options() {
      return {
        language_url: "/static/app/libs/tinymce/langs/zh_CN.js",
        language: "zh_CN",
        height: 300,
        menubar: false,
        plugins: [
          "advlist autolink lists link image charmap print",
          "searchreplace visualblocks code",
          "insertdatetime media table paste code wordcount",
        ],
        toolbar: [
          "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent|numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons |print | insertfile image media pageembed template link codesample | a11ycheck ltr rtl | showcomments addcomment",
        ],
        images_upload_handler: this.uploadImg,
        urlconverter_callback: this.urlReplace,
        file_picker_types: "media",
        // file_picker_callback: function (cb, value, meta) {
        // },
      };
    },
  },
  methods: {
    async uploadImg(blob, success, failure) {
      const url = await this.uploadFile(blob.blob(), blob.filename());
      if (url) {
        return success(url);
      }
      failure("上传失败");
    },
    async uploadFile(file, fileName) {
      const ret = await this.API.upload({ file, fileName, api: "/api/upload" });
      if (ret.success && ret.data.length) {
        const file = await this.API.file({ data: { ids: ret.data[0].LeafId }, method: "get" });
        if (file.success) {
          return file.data[0].res_path;
        }
      }
    },
    urlReplace(url, node, on_save, name) {
      this.$nextTick(() => this.analyzeUrl(url));
      return url;
    },
    async analyzeUrl(url) {
      //检查url是否需要替换
      if (/\/matter\//g.test(url) || !url) return;

      const fileext = URLparser.parse("fileext", url);
      if (["mp4", "flv", "avi"].includes(fileext) || !fileext) return;

      this.$emit("replacing");
      const fileName = URLparser.parse("file", url);
      const file = await URLToFile(url, fileName);
      if (file) {
        const uploadURL = await this.uploadFile(file, fileName);
        if (uploadURL) {
          this.proxy[this.vfield] = this.proxy[this.vfield].replaceAll(url, uploadURL);
        }
      } else {
        this.$message({ type: "warning", message: `由于源资源网站限制，不能访问其资源，请自行下载后上传` });
      }
      this.$emit("replaced");
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
.tox-statusbar__branding {
  display: none !important;
}
</style>
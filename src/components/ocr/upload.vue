<template>
  <div v-loading="uploading" style="height: 100%">
    <el-upload ref="upload" :file-list="fileList" :on-change="beforeUpload" :before-remove="beforeRemove" :auto-upload="false" multiple>
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px" size="small" type="success" @click="onSubmit">上传</el-button>
    </el-upload>
  </div>
</template>
<script>
export default {
  props: {
    api: {
      type: String,
      default: "/api/upload",
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      fileList: [],
      uploading: false,
    };
  },
  methods: {
    async onSubmit() {
      this.uploading = true;
      const file = this.fileList.map((f) => f.raw);
      const ret = await this.API.upload({ file, data: this.data, api: this.api });
      this.uploading = false;
      if (ret.success) {
        this.$refs.upload.clearFiles();
        this.fileList = [];
      }
      this.$emit("success", ret);
    },
    beforeUpload(file) {
      this.fileList.push(file);
    },
    beforeRemove(file) {
      const index = _.find(this.fileList, { uid: file.uid });
      if (index !== -1) {
        this.fileList.splice(index, 1);
      }
    },
  },
};
</script>
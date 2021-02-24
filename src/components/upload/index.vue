<template>
  <div class="pso-upload">
    <div class="pso-upload__header">
      <div class="pso-upload__header-title">添加附件</div>
      <i class="pso-upload__header-cose el-icon-close" @click="$emit('close')"></i>
    </div>
    <div
      ref="uparea"
      class="pso-upload__body"
      @drop.prevent="dragingFile = false"
      @dragenter.prevent="dragenter"
      @dragleave.prevent="dragleave"
    >
      <el-upload
        v-if="upable"
        drag
        class="pso-upload__area"
        :data="data"
        :headers="uploadHeader"
        :action="uploadApi"
        :show-file-list="false"
        :on-success="onSuccess"
        :on-error="onError"
        :on-progress="onProgress"
        :before-upload="beforeUpload"
        :multiple="true"
      >
        <i class="el-icon-upload"></i>
        <div class="pso-upload__area-text">将文件拖到此处</div>
      </el-upload>
      <div class="pso-upload__list-wrapper" v-show="showFileList">
        <pso-file-list :files="upFileList" @delete="deleteFile"></pso-file-list>
      </div>
    </div>
    <div class="pso-upload__footer">
      <div class="pso-upload__footer-left" ref="upbtn">
        <el-upload
          v-if="upable"
          class="pso-upload__btn"
          :data="data"
          :headers="uploadHeader"
          :action="uploadApi"
          :show-file-list="false"
          :on-success="onSuccess"
          :on-error="onError"
          :on-progress="onProgress"
          :before-upload="beforeUpload"
          :multiple="true"
        >
          <el-button icon="el-icon-upload" size="small" type="text">本地</el-button>
        </el-upload>
        <pso-picker-resource @confirm="resourceChange" v-if="srcable">
          <el-button icon="el-icon-folder" size="small" type="text" :loading="fileDemanding">知识库</el-button>
        </pso-picker-resource>
      </div>
      <div class="pso-upload__footer-right" v-show="showFileList">
        <el-button class="pso-upload__footer-cancel" size="small" type="text" @click="$emit('close')">取消</el-button>
        <el-button class="pso-upload__footer-confirm" size="small" type="primary" @click="confirm">确认</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import Auth from "../../tool/auth";
import PsoFileList from "../file-list";
import { makeFiles } from "../../tool/file";
import { Resource } from "../../mixin/resource";

export default {
  mixins: [Resource],
  components: { PsoFileList },
  props: {
    api: {
      type: String,
      default: "/api/upload",
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    visible: {
      type: Boolean,
      default: false,
    },
    upable: {
      type: Boolean,
      default: true,
    },
    srcable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      upFileList: [],
      dragingFile: false,
      lastDragEnter: null,
    };
  },
  computed: {
    uploadApi() {
      return `${this.APIURL}${this.api}`;
    },
    uploadHeader() {
      const token = Auth.getToken();
      const headers = { timeout: 100000000 };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      return headers;
    },
    showFileList() {
      return !!this.upFileList.length && !this.dragingFile;
    },
  },
  watch: {
    visible(value) {
      if (value) {
        this.$nextTick(() => {
          if (this.__isMobile__) {
            [this.$refs.uparea, this.$refs.upbtn].forEach((el) => {
              $(el).find(".el-upload__input").attr("accept", "image/*");
            });
          }
        });
      }
    },
  },
  methods: {
    onSuccess(ret, file) {
      const _file = this.findFile(file.uid);
      if (!ret.success || !ret.data.length) {
        if (_file) this.deleteFile(file);
        return this.$message.error("上传失败");
      }
      if (_file) {
        _file.leaf_id = ret.data[0].LeafId;
        makeFiles({ files: [Object.assign(_file, ret.data[0])] });
      }
      this.$message({
        message: "上传成功",
        type: "success",
      });
    },
    onError(err, file, fileList) {
      this.$message.error("上传失败");
      this.deleteFile(file);
    },
    onProgress(event, file, fileList) {
      let _file = this.findFile(file.uid);
      if (_file) _file.percentage = parseInt(file.percentage);
    },
    findFile(fid, method = "find") {
      return _[method](this.upFileList, { fid });
    },
    beforeUpload(file) {
      this.upFileList.push({ fid: file.uid, name: file.name, percentage: 0 });
    },
    deleteFile(file) {
      let index = this.findFile(file.fid || file.uid, "findIndex");
      if (index !== -1) this.upFileList.splice(index, 1);
    },
    confirm() {
      this.$emit("confirm", _.cloneDeep(this.upFileList));
      this.upFileList = [];
    },
    dragenter(e) {
      this.dragingFile = true;
      this.lastDragEnter = e.target;
    },
    dragleave(e) {
      e.stopPropagation();
      if (e.target === this.lastDragEnter) {
        this.dragingFile = false;
      }
    },
    async resourceChange(data) {
      const resources = await this.demandFiles(data);
      if (resources.length) {
        this.upFileList = this.upFileList.concat(resources);
      }
    },
  },
};
</script>

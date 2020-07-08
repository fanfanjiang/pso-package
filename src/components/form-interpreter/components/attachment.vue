<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <div class="pso-form-upload">
      <el-popover
        v-if="storeEditable&&!cpnt.data._read"
        :visible-arrow="false"
        transition="el-zoom-in-top"
        popper-class="pso-upload-wrapper"
        placement="bottom-start"
        width="400"
        v-model="showUpload"
      >
        <pso-upload @close="showUpload=false" @confirm="confirm"></pso-upload>
        <template slot="reference">
          <slot>
            <el-button icon="el-icon-paperclip" plain size="small">上传附件</el-button>
          </slot>
        </template>
      </el-popover>
      <div class="pso-form-upload__files">
        <pso-file-list v-if="!loadingFile" :files="proxy" @delete="deleteFile"></pso-file-list>
        <pso-skeleton v-else :lines="1"></pso-skeleton>
      </div>
    </div>
  </el-form-item>
</template>
<script>
import PsoUpload from "../../upload/index.vue";
import PsoFileList from "../../file-list/index.vue";
import { makeFiles } from "../../../tool/file";
import cpntMixin from "../mixin";

export default {
  mixins: [cpntMixin],
  components: {
    PsoUpload,
    PsoFileList
  },
  data() {
    return {
      showUpload: false,
      loadingFile: false,
      fIndex: 0,
      proxy: []
    };
  },
  created() {
    if (this.cpnt.data._val) {
      this.getImages();
    }
  },
  watch: {
    proxy: {
      deep: true,
      handler(val) {
        if (val && val.length) {
          this.cpnt.data._val = _.map(val, "leaf_id").join(",");
        }
      }
    }
  },
  methods: {
    async getImages() {
      this.loadingFile = true;
      const ret = await this.API.file({ data: { ids: this.cpnt.data._val }, method: "get" });
      this.loadingFile = false;
      makeFiles({ files: ret.data, urlField: "res_path", nameField: "res_name" });
      this.proxy = ret.data;
    },
    confirm(fileList) {
      this.proxy = this.proxy.concat(fileList);
      if (this.proxy.length > this.cpnt.data._limit) {
        this.proxy.splice(0, this.proxy.length - this.cpnt.data._limit);
        this.$message({ message: "超过最大文件个数限制" });
      }
      this.showUpload = false;
    },
    deleteFile(file) {
      const index = _.findIndex(this.proxy, { fid: file.fid });
      if (index !== -1) {
        this.proxy.splice(index, 1);
        this.$emit("delete", file);
      }
    }
  }
};
</script>
<style lang="less">
@deep: ~">>>";
.pso-form-upload {
  position: relative;
  .pso-form-upload__trigger {
    cursor: pointer;
    user-select: none;
  }
  .pso-form-upload__files {
    margin-top: 10px;
  }
}
.pso-upload-wrapper {
  padding: 0;
  margin-bottom: 0 !important;
}
</style>

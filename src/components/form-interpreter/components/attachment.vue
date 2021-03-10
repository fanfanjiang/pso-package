<template>
  <pso-label :cpnt="cpnt">
    <div class="pso-form-upload">
      <div class="pso-form-upload__files" :style="showStyle" v-if="preview && proxy.length && !cpnt.data._hideShowBox">
        <pso-file-list
          v-if="!loadingFile"
          :files="proxy"
          @delete="deleteFile"
          :remove="cpntEditable"
          :width="cpnt.data._showwidth"
          :height="cpnt.data._showheight"
          :downloadable="downloadable"
        ></pso-file-list>
        <pso-skeleton v-else :lines="1"></pso-skeleton>
      </div>
      <el-popover
        v-if="cpntEditable && checkable(1)"
        :visible-arrow="false"
        transition="el-zoom-in-top"
        popper-class="pso-upload-wrapper pso-popover-fs"
        placement="bottom-start"
        :width="popWidth"
        v-model="showUpload"
      >
        <pso-upload
          @close="showUpload = false"
          @confirm="confirm"
          @success="$emit('success', $event)"
          :api="api"
          :data="data"
          :visible="showUpload"
          :upable="checkable(1)"
          :srcable="checkable(2)"
        ></pso-upload>
        <template slot="reference">
          <slot>
            <el-button icon="el-icon-paperclip" plain size="small">上传附件</el-button>
          </slot>
        </template>
      </el-popover>
      <pso-picker-resource v-if="cpntEditable && checkable(2) && !checkable(1)" @confirm="resourceChange">
        <el-button icon="el-icon-paperclip" plain size="small" :loading="fileDemanding">选择资源</el-button>
      </pso-picker-resource>
    </div>
  </pso-label>
</template>
<script>
import PsoUpload from "../../upload/index.vue";
import PsoFileList from "../../file-list/index.vue";
import { makeFiles } from "../../../tool/file";
import cpntMixin from "../mixin";
import { Resource } from "../../../mixin/resource";

export default {
  mixins: [cpntMixin, Resource],
  components: {
    PsoUpload,
    PsoFileList,
  },
  props: {
    api: {
      type: String,
      default: "/api/upload",
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    preview: {
      type: Boolean,
      default: true,
    },
    downloadable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showUpload: false,
      loadingFile: false,
      fIndex: 0,
      proxy: [],
      popWidth: 400,
    };
  },
  computed: {
    showStyle() {
      const style = {};
      if (this.cpnt.data._showwidth) {
        style.width = this.cpnt.data._showwidth;
      }
      if (this.cpnt.data._showheight) {
        style.height = this.cpnt.data._showheight;
      }
      return style;
    },
  },
  created() {
    this.cpnt.data._limit = 100;
    if (this.cpnt.data._val) {
      this.getImages(this.cpnt.data._val);
    }
  },
  mounted() {
    if (this.__isMobile__) {
      this.popWidth = $(document).width();
    }
  },
  watch: {
    proxy: {
      deep: true,
      handler(val) {
        if (val && val.length) {
          this.cpnt.data._val = _.map(val, "leaf_id").join(",");
        } else {
          this.cpnt.data._val = "";
        }
      },
    },
  },
  methods: {
    async setDataByIds(ids) {
      this.getImages(ids);
    },
    async getImages(ids) {
      //2020.12.04 bug修复
      if (Array.isArray(ids)) {
        ids = ids.length ? ids.join(",") : "";
      }
      if (ids) {
        this.loadingFile = true;
        const ret = await this.API.file({ data: { ids }, method: "get" });
        this.loadingFile = false;
        makeFiles({ files: ret.data, urlField: "res_path", nameField: "res_name" });
        this.proxy = ret.data;
      } else {
        this.proxy = [];
      }
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
      const index = _.findIndex(this.proxy, { res_id: file.res_id });
      if (index !== -1) {
        this.proxy.splice(index, 1);
        this.$emit("delete", file);
      }
    },
    checkable(val) {
      return this.cpnt.data._source && this.cpnt.data._source.length ? this.cpnt.data._source.includes(val) : true;
    },
    async resourceChange(data) {
      const resources = await this.demandFiles(data);
      if (resources.length) {
        this.confirm(resources);
      }
    },
    deleteCpntValue(data) {
      this.deleteFile(data);
    },
  },
};
</script>


<template>
  <div class="pso-upload__list">
    <div class="pso-upload__list-item" :style="showStyle" v-for="(file, index) in files" :key="file.fid">
      <div class="pso-upload__list-item-fix">
        <div class="pso-upload__list-item__progress" v-if="file.percentage !== 100">
          <el-progress :width="80" type="circle" :percentage="file.percentage"></el-progress>
          <div class="pso-upload__list-progress__name">{{ file.name }}</div>
        </div>
        <template v-else>
          <div class="pso-upload__list-info">
            <div class="pso-upload__list-info__bg" v-bind:style="file.style"></div>
            <div class="pso-upload__list-info__name" v-if="!file.isImg">{{ file.name }}</div>
          </div>
          <div class="pso-upload__list-panel">
            <span class="pso-upload__list-panel__item" v-if="check" @click.stop="goShowViewer({ index, file })">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span class="pso-upload__list-panel__item" v-if="downloadable" @click.stop="download(file)">
              <i class="el-icon-download"></i>
            </span>
            <span class="pso-upload__list-panel__item" v-if="remove" @click.stop="$emit('delete', file)">
              <i class="el-icon-delete"></i>
            </span>
          </div>
        </template>
      </div>
    </div>
    <transition name="el-fade-in">
      <file-viewer :fIndex="fIndex" :fileList="files" v-if="showViewer" @close="showViewer = false" @download="download"></file-viewer>
    </transition>
  </div>
</template>
<script>
import FileViewer from "../file-viewer";
export default {
  components: { FileViewer },
  props: {
    files: Array,
    remove: {
      type: Boolean,
      default: true,
    },
    downloadable: {
      type: Boolean,
      default: true,
    },
    check: {
      type: Boolean,
      default: true,
    },
    width: String,
    height: String,
  },
  data() {
    return {
      showViewer: false,
      fIndex: 0,
    };
  },
  computed: {
    showStyle() {
      const style = {};
      if (this.width) {
        style.width = this.width;
      }
      if (this.height) {
        style.height = this.height;
      }
      return style;
    },
  },
  methods: {
    goShowViewer(params) {
      this.fIndex = params.index;
      this.showViewer = true;
      this.$emit("check", params);
    },
    download(file) {
      window.open(file.url);
      // const eleLink = document.createElement("a");
      // eleLink.href = file.url;
      // eleLink.download = file.filename;
      // eleLink.style.display = "none";
      // document.body.appendChild(eleLink);
      // eleLink.click();
      // document.body.removeChild(eleLink);
    },
  },
};
</script>
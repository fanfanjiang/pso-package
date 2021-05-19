<template>
  <div ref="view" class="pso-file-viewer" @click.stop>
    <div ref="header" class="pso-file-viewer__header">
      <div class="pso-file-viewer__header-title">{{ currentFile.name }}</div>
      <span class="pso-file-viewer__header-number">{{ fIndex + 1 }} / {{ files.length }}</span>
      <div class="pso-file-viewer__fun">
        <el-tooltip popper-class="pso-file-viewer__fun-tip" effect="dark" content="下载" placement="bottom">
          <i class="el-icon-download" @click.stop="$emit('download', currentFile)"></i>
        </el-tooltip>
        <el-tooltip popper-class="pso-file-viewer__fun-tip" effect="dark" content="关闭" placement="bottom">
          <i class="el-icon-close" @click.stop="$emit('close')"></i>
        </el-tooltip>
      </div>
    </div>
    <div class="pso-file-viewer__body">
      <div class="pso-file-viewer__body-menu">
        <div
          class="pso-file-viewer__menu-item"
          v-for="(file, i) in files"
          :key="i"
          :class="{ active: fIndex === i }"
          @click="changeIndex(i)"
        >
          <img :src="file.icon" alt />
          <span>{{ file.name }}</span>
        </div>
      </div>
      <div class="pso-file-viewer__body-carousel">
        <el-carousel
          ref="carousel"
          :height="carouselHeight"
          indicator-position="none"
          :autoplay="false"
          @change="changeIndex"
          :initial-index="fIndex"
        >
          <el-carousel-item v-for="(file, index) in files" :key="index">
            <component v-if="index === fIndex || isLoaded(index)" v-bind:is="fileCpnt(file)" :file="file"></component>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>
<script>
import PsoFileImage from "./image";
import PsoFileOffice from "./office";
import PsoFilePdf from "./pdf";
import PsoFileVideo from "./video";

export default {
  components: { PsoFileImage, PsoFileOffice, PsoFilePdf, PsoFileVideo },
  props: {
    fileList: {
      type: Array,
      default: () => [],
    },
    fIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      files: this.fileList,
      carouselHeight: "600px",
    };
  },
  computed: {
    currentFile() {
      return this.files[this.fIndex];
    },
  },
  created() {
    this.files.forEach((f) => delete f.loaded);
    this.changeIndex(this.fIndex);
  },
  mounted() {
    document.body.appendChild(this.$refs.view);
    $(document.body).css("overflow", "hidden");
    this.carouselHeight = `${$(this.$refs.view).height() - $(this.$refs.header).height()}px`;
  },
  beforeDestroy() {
    $(document.body).css("overflow", "auto");
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  },
  methods: {
    fileCpnt(file) {
      let url = file.url;
      let fileType = "office";
      if (file.isSrcImg || /\S+\.(png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF|bmp|BMP)$/.test(url)) {
        fileType = "image";
      } else if (/\S+\.(xls|xlsx|docx|doc|ppt)$/.test(url)) {
        fileType = "office";
      } else if (/\S+\.(pdf)$/.test(url)) {
        fileType = "pdf";
      } else if (/\S+\.(mp4|mkv)$/.test(url)) {
        fileType = "video";
      }
      return `pso-file-${fileType}`;
    },
    changeIndex(index) {
      this.fIndex = index;
      if (this.$refs.carousel) this.$refs.carousel.setActiveItem(index);
      this.files[index].loaded = true;
    },
    isLoaded(index) {
      return this.files[index].loaded === true;
    },
  },
};
</script>

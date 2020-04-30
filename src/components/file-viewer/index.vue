<template>
  <div ref="view" class="pso-file-viewer" @click.stop>
    <div ref="header" class="pso-file-viewer__header">
      <div class="pso-file-viewer__header-title">{{currentFile.name}}</div>
      <span class="pso-file-viewer__header-number">{{fIndex+1}} / {{files.length}}</span>
      <div class="pso-file-viewer__fun">
        <el-tooltip
          popper-class="pso-file-viewer__fun-tip"
          effect="dark"
          content="下载"
          placement="bottom"
        >
          <i class="el-icon-download"></i>
        </el-tooltip>
        <el-tooltip
          popper-class="pso-file-viewer__fun-tip"
          effect="dark"
          content="分享"
          placement="bottom"
        >
          <i class="el-icon-share"></i>
        </el-tooltip>
        <el-tooltip
          popper-class="pso-file-viewer__fun-tip"
          effect="dark"
          content="关闭"
          placement="bottom"
        >
          <i class="el-icon-close" @click.stop="$emit('close')"></i>
        </el-tooltip>
      </div>
    </div>
    <div class="pso-file-viewer__body">
      <div class="pso-file-viewer__body-menu" v-bar>
        <div>
          <div class="pso-file-viewer__menu-wrapper">
            <div
              :class="{'pso-file-viewer__menu-item':true,'active':fIndex===index}"
              v-for="(file,index) in files"
              :key="index"
              @click="changeIndex(index)"
            >
              <img :src="file.icon" alt />
              <span>{{file.name}}</span>
            </div>
          </div>
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
          <el-carousel-item v-for="(file,index) in files" :key="index">
            <component
              v-if="index===fIndex||isLoaded(index)"
              v-bind:is="fileCpnt(file)"
              :file="file"
            ></component>
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
      default: () => []
    },
    fIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      files: this.fileList,
      carouselHeight: "600px"
    };
  },
  computed: {
    currentFile() {
      return this.files[this.fIndex];
    }
  },
  created() {
    this.files.forEach(f => delete f.loaded);
    this.changeIndex(this.fIndex);
  },
  mounted() {
    document.body.append(this.$refs.view);
    $(document.body).css("overflow", "hidden");
    this.carouselHeight = `${$(this.$refs.view).height() -
      $(this.$refs.header).height()}px`;
  },
  beforeDestroy() {
    $(document.body).css("overflow", "auto");
  },
  methods: {
    fileCpnt(file) {
      let url = file.url;
      let fileType = "office";
      if (/\S+\.(png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF|bmp|BMP)$/.test(url)) {
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
    }
  }
};
</script>
<style lang="less">
.pso-file-viewer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100vh;
  z-index: 9999;
  color: #fff;

  .pso-file-viewer__header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background-color: rgba(36, 35, 35, 0.9);
    position: relative;
    .pso-file-viewer__header-number {
      position: absolute;
      left: 50%;
    }
    .pso-file-viewer__header-title {
      color: #fff;
    }
    .pso-file-viewer__fun {
      > i {
        font-size: 20px;
        cursor: pointer;
        & + i {
          margin-left: 20px;
        }
      }
    }
  }
  .pso-file-viewer__body {
    height: calc(100% - 50px);
    background-color: rgba(36, 35, 35, 0.85);
    display: flex;
    .pso-file-viewer__body-menu {
      width: 100px;
      background-color: rgba(36, 35, 35, 0.34);
      .pso-file-viewer__menu-wrapper {
        padding: 10px;
      }
      .pso-file-viewer__menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 80px;
        width: 80px;
        overflow: hidden;
        cursor: pointer;
        &.active {
          border: 3px solid #409eff;
        }
        & + .pso-file-viewer__menu-item {
          margin-top: 10px;
        }
        > img {
          height: 44px;
          width: 44px;
        }
        > span {
          margin-top: 3px;
          font-size: 12px;
          line-height: 16px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          width: 90%;
          text-align: center;
        }
      }
    }
    .pso-file-viewer__body-carousel {
      flex: 1;
      width: 100%;
      height: 100%;
    }
  }
}
.pso-file-viewer__fun-tip {
  z-index: 99999 !important;
}
</style>
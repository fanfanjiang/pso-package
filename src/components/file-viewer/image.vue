<template>
  <div class="pso-view-image" v-loading="loading">
    <div ref="stage" class="pso-view-image__stage">
      <img ref="target" :src="file.url" :style="imgStyle" />
    </div>
    <div class="pso-view-image__controller">
      <el-tooltip
        popper-class="pso-file-viewer__fun-tip"
        effect="dark"
        content="原图"
        placement="top"
      >
        <i class="el-icon-full-screen" @click="setOriginImg"></i>
      </el-tooltip>
      <el-tooltip
        popper-class="pso-file-viewer__fun-tip"
        effect="dark"
        content="缩略图"
        placement="top"
      >
        <i class="el-icon-picture-outline" @click="setThumbnail"></i>
      </el-tooltip>
      <el-tooltip
        popper-class="pso-file-viewer__fun-tip"
        effect="dark"
        content="放大"
        placement="top"
      >
        <i class="el-icon-zoom-in" @click="plus"></i>
      </el-tooltip>
      <el-tooltip
        popper-class="pso-file-viewer__fun-tip"
        effect="dark"
        content="缩小"
        placement="top"
      >
        <i class="el-icon-zoom-out" @click="minus"></i>
      </el-tooltip>
      <el-tooltip
        popper-class="pso-file-viewer__fun-tip"
        effect="dark"
        content="旋转"
        placement="top"
      >
        <i class="el-icon-refresh-right" @click="rotate"></i>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import FreeDrag from "../../mixin/free-drag";
export default {
  props: ["file"],
  mixins: [FreeDrag()],
  data() {
    return {
      loading: true,
      scale: 1,
      imgHeight: "",
      imgWidth: "",
      step: 0.2,
      thumbW: "",
      thumbH: "",
      orgW: "",
      orgH: "",
      stageW: "",
      stageH: "",
      radio: 1,
      deg: 0
    };
  },
  computed: {
    imgStyle() {
      return {
        transform: `scale(${this.scale}) rotate(${this.deg}deg)`,
        height: this.imgHeight,
        width: this.imgWidth
      };
    }
  },
  mounted() {
    $(this.$refs.target).on("load", e => {
      this.stageW = $(this.$refs.stage).width();
      this.stageH = $(this.$refs.stage).height();
      this.orgW = $(this.$refs.target).width();
      this.orgH = $(this.$refs.target).height();
      this.radio = this.orgW / this.orgH;

      this.thumbH = this.stageH - 40;
      this.thumbW = this.thumbH * this.radio;

      if (this.thumbW > this.stageW - 100) {
        this.thumbW = this.stageW;
        this.thumbH = this.thumbW / this.radio;
      }
      this.setThumbnail();
      this.loading = false;
    });
  },
  methods: {
    plus() {
      this.scale += this.step;
    },
    minus() {
      if (this.scale <= this.step + 0.01) return;
      this.scale -= this.step;
    },
    rotate() {
      this.deg += 90;
    },
    setOriginImg() {
      let image = new Image();
      image.src = this.file.url;
      $(image).on("load", e => {
        this.imgWidth = `${image.width}px`;
        this.imgHeight = `${image.height}px`;
        this.setPosition();
      });
    },
    setThumbnail() {
      this.imgHeight = `${this.thumbH}px`;
      this.imgWidth = `${this.thumbW}px`;
      this.setPosition();
    },
    setPosition() {
      this.$nextTick(() => {
        this.scale = 1;
        this.deg = 0;

        $(this.$refs.target).css(
          "left",
          `${(this.stageW - parseInt(this.imgWidth.replace("px", ""))) / 2}px`
        );
        $(this.$refs.target).css(
          "top",
          `${(this.stageH - parseInt(this.imgHeight.replace("px", ""))) / 2}px`
        );
      });
    }
  }
};
</script>
<style lang="less" scoped>
.pso-view-image {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .pso-view-image__stage {
    flex: 1;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    > img {
      position: absolute;
      margin: auto;
      transition: transform 0.2s ease-in-out, width 0.2s ease-in-out,
        height 0.2s ease-in-out;
      cursor: grab;
    }
  }
  .pso-view-image__controller {
    position: relative;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    i {
      font-size: 24px;
      cursor: pointer;
      & + i {
        margin-left: 40px;
      }
    }
  }
}
</style>
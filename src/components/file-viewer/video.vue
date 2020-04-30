<template>
  <div class="pso-file-video">
    <video-player
      class="video-player-box"
      ref="videoPlayer"
      :options="playerOptions"
      :playsinline="true"
    ></video-player>
  </div>
</template>
<script>
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
export default {
  props: ["file"],
  components: {
    videoPlayer
  },
  data() {
    return {
      playerOptions: {
        language: "cn",
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: "video/mp4",
            src: this.file.url
          }
        ]
      }
    };
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/variable";

.pso-file-video {
  height: 100%;
  width: 100%;
  .video-player-box {
    height: 100% !important;
    width: 100% !important;
    @{deep} .video-js {
      height: 100% !important;
      width: 100% !important;
    }
  }
}
</style>
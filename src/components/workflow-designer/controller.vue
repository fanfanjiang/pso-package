<template>
  <div class="pso-wf-controller">
    <div
      class="pso-wf-controller_download"
      @click="wfDesigner.displaySmall=!wfDesigner.displaySmall"
    >
      <i v-if="wfDesigner.displaySmall" class="el-icon-full-screen"></i>
      <i v-else class="el-icon-crop"></i>
    </div>
    <div class="pso-wf-controller_download" @click="$emit('downloadStage')">
      <i class="el-icon-download"></i>
    </div>
    <el-slider
      v-model="wfDesigner.stageScale"
      :max="1"
      :min="0.1"
      :step="0.1"
      vertical
      height="100px"
    ></el-slider>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { WF_STAGE_SET } from "../../store/mutation-types";
import html2canvas from "html2canvas";

export default {
  props: {
    displaySmall: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(["wfDesigner"]),
    scaleText() {
      return parseInt(this.wfDesigner.stageScale * 100) + "%";
    }
  },
  created() {
    this.wfDesigner.displaySmall = this.displaySmall;
  },
  methods: {
    ...mapMutations([WF_STAGE_SET]),
    plus() {
      this[WF_STAGE_SET](this.wfDesigner.stageScale + 0.1);
    },
    minus() {
      if (this.wfDesigner.stageScale < 0.2) return;
      this[WF_STAGE_SET](this.wfDesigner.stageScale - 0.1);
    },
    download(node) {
      html2canvas(node).then(canvas => {
        let dataURL = canvas.toDataURL("image/png");
        var eleLink = document.createElement("a");
        eleLink.href = dataURL;
        eleLink.download = "流程图";
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.pso-wf-controller {
  display: flex;
  align-items: center;
  flex-direction: column;
  .pso-wf-controller_download,
  .pso-wf-controller_body-left,
  .pso-wf-controller_body-right {
    height: 30px;
    width: 30px;
    line-height: 30px;
    background-color: #fff;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0 1px 4px 0 rgba(25, 30, 40, 0.2);
    user-select: none;
    margin-bottom: 20px;
    i {
      font-size: 16px;
    }
  }
  .pso-wf-controller_body {
    display: flex;
    margin-left: 15px;
    align-items: center;
    user-select: none;

    .pso-wf-controller_body-info {
      margin: 0 10px;
      font-size: 14px;
      color: #999;
    }
  }
}
</style>
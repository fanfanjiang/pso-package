<template>
  <el-popover
    :visible-arrow="false"
    transition="el-zoom-in-top"
    placement="top-start"
    width="424"
    @after-enter="handlerShowed"
    v-model="show"
  >
    <div class="pso-signature-pad">
      <div class="pso-signature-pad__header">
        <div class="pso-signature__controller">
          <div class="pso-signature__controller-picker">
            <el-color-picker v-model="color" size="mini" @active-change="colorChangeHandler"></el-color-picker>
          </div>
          <el-button icon="el-icon-refresh-left" size="mini" circle @click="undo"></el-button>
          <el-button icon="el-icon-refresh" size="mini" circle @click="clear"></el-button>
        </div>
        <div class="pso-signature__confirm">
          <el-button @click="show=false" size="mini">取 消</el-button>
          <el-button type="primary" @click="save" size="mini">确 定</el-button>
        </div>
      </div>
      <div class="pso-signature-pad__body" ref="canvasWrapper">
        <canvas ref="canvas"></canvas>
      </div>
    </div>
    <template slot="reference">
      <slot>
        <el-button icon="el-icon-edit" plain size="small">添加签名</el-button>
      </slot>
    </template>
  </el-popover>
</template>
<script>
import SignaturePad from "signature_pad";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      opened: false,
      signaturePad: null,
      color: "rgb(0, 0, 0)"
    };
  },
  computed: {
    canvasStyle() {
      return {};
    }
  },
  mounted() {},
  methods: {
    handlerShowed() {
      this.initPad();
    },
    initPad() {
      if (!this.signaturePad) {
        const $canvasWrapper = $(this.$refs.canvasWrapper);
        this.$refs.canvas.width = $canvasWrapper.width();
        this.$refs.canvas.height = $canvasWrapper.height();
        this.signaturePad = new SignaturePad(this.$refs.canvas, {
          ackgroundColor: "rgba(255,255,255)",
          penColor: this.color
        });
      }
    },
    colorChangeHandler(color) {
      this.setColor(color);
    },
    setColor(color) {
      this.signaturePad.penColor = color;
    },
    clear() {
      this.signaturePad.clear();
    },
    undo() {
      const data = this.signaturePad.toData();
      if (data && data.length) {
        data.pop();
        this.signaturePad.fromData(data);
      }
    },
    save() {
      const data = this.signaturePad.toData();
      this.$emit("save", data && data.length ? this.signaturePad.toDataURL() : "");
      this.clear();
      this.show = false;
    }
  }
};
</script>
<style lang="less" scoped>
.pso-signature-pad {
  .pso-signature-pad__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .pso-signature-pad__body {
    height: 280px;
  }
  .pso-signature__controller {
    display: flex;
    align-items: center;
    .pso-signature__controller-picker {
      margin-right: 10px;
      font-size: 0;
    }
  }
}
</style>
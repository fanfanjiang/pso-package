<template>
  <el-drawer
    :class="['pso-draw-wrapper',customclass]"
    :visible="visible"
    :direction="direction"
    :show-close="false"
    :append-to-body="true"
    :modal="modal"
    :size="size"
    :before-close="checkClose"
    :destroy-on-close="destroy"
    @open="$emit('open')"
    @close="$emit('close')"
    @closed="closed"
    @opened="opened"
    ref="drawer"
  >
    <div ref="psoDrawer" class="pso-drawer">
      <div class="pso-drawer-header">
        <div class="pso-drawer-title">
          <i v-if="icon" :class="[icon,'pso-drawer-title__icon']"></i>
          <span>{{title}}</span>
          <el-tooltip
            v-if="tip"
            popper-class="pso-drawer-tip"
            effect="dark"
            :content="tip"
            placement="bottom"
          >
            <slot name="tip"></slot>
          </el-tooltip>
        </div>
        <i @click="$emit('close')" class="pso-drawer-close el-icon-close"></i>
      </div>
      <div class="pso-drawer-body__wrapper">
        <slot v-if="rendered" name="whole">
          <div class="pso-drawer-body" :style="bodyStyle" v-bar>
            <div>
              <slot v-if="rendered"></slot>
            </div>
          </div>
        </slot>
      </div>
      <div class="pso-drawer-footer" ref="footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </el-drawer>
</template>
<script>
export default {
  props: {
    visible: Boolean,
    direction: {
      type: String,
      default: "rtl"
    },
    size: {
      type: String,
      default: "30%"
    },
    title: String,
    icon: {
      type: String,
      default: ""
    },
    tip: {
      type: String,
      default: ""
    },
    customclass: {
      type: String,
      default: ""
    },
    modal: {
      type: Boolean,
      default: true
    },
    destroy: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      bodyBottom: 0,
      startMask: false,
      rendered: true
    };
  },
  watch: {
    visible(val) {
      //这里做了销毁组件的处理
      this.rendered = val ? true : this.destroy && false;
    }
  },
  computed: {
    bodyStyle() {
      return {
        bottom: `${this.bodyBottom}px`
      };
    }
  },
  methods: {
    checkClose(done) {
      this.startMask && done();
    },
    checkClick(e) {
      this.startMask = !$(e.target).parents(".pso-drawer").length;
    },
    opened() {
      this.bodyBottom = $(this.$refs.footer).height();
      $(".pso-draw-wrapper").on("mousedown", this.checkClick);
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/less/variable";
@import "../../assets/less/mixins/gradients.less";
.pso-drawer {
  height: 100vh;
  position: relative;
  .pso-drawer-header {
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    #gradient.horizontal(@main-color, #f56c6c);
    height: 50px;
    padding: 0 15px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 0;
    .pso-drawer-title__icon {
      margin-right: 6px;
    }
    .pso-drawer-close {
      font-size: 22px;
      cursor: pointer;
      transition: all 0.2s ease-in;

      &:hover {
        transform: rotate(90deg);
        transition: all 0.2s ease-in;
      }
    }
  }
  .pso-drawer-body__wrapper {
    position: absolute !important;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
  .pso-drawer-body {
    position: absolute !important;
    background-color: #f8f8f8;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
  .pso-drawer-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12);
    z-index: 2;
  }
}
@{deep} {
  .el-drawer__header {
    display: none !important;
  }
  .el-divider__text {
    background-color: #f8f8f8;
  }
}
</style>
<template>
  <div class="passport">
    <div class="passport-header">
      <div class="pso-container">
        <div class="pso-header-l">
          <div class="passport-appinfo">
            <img class="passport-appinfo-logo" :src="appConfig.logo" />
            <span class="passport-appinfo-title">{{ appConfig.name }}</span>
          </div>
          <slot name="left"></slot>
        </div>
        <div class="pso-header-r">
          <slot name="right"></slot>
          <div class="passport-appswitch" v-if="appswitch && appConfig.sitesTree && appConfig.sitesTree.length">
            <div class="passport-appswitch-body">
              <span>{{ appName }}</span>
              <i class="passport-appswitch-trigger el-icon-menu" @click="showSwitch = !showSwitch"></i>
            </div>
            <transition name="el-zoom-in-top">
              <pso-appswitch v-if="showSwitch" :sites="appConfig.sitesTree" @change="appChangeHandler"></pso-appswitch>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <div class="passport-body">
      <slot></slot>
    </div>
    <div class="passport-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
import { ConfigMixin } from "../../mixin/passport";
export default {
  mixins: [ConfigMixin],
  props: {
    appswitch: {
      type: Boolean,
      default: true,
    },
    outerAppid: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      defAppid: "",
      showSwitch: false,
    };
  },
  created() {
    this.defAppid = this.outerAppid;
    this.initializeCfg(false);
  },
  methods: {
    appChangeHandler(site) {
      if (this.appswitch) {
        this.selectSite(site);
        this.showSwitch = false;
        this.defAppid = "";
      }
      this.$emit("change", site);
    },
  },
};
</script>

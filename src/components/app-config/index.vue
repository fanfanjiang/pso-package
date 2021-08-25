<template>
  <div class="pso-view pso-view__expand" v-loading="initializing">
    <div class="pso-view-extend">
      <div class="pso-tabs">
        <div class="pso-tabs-header">
          <div class="pso-tabs-title">
            <i class="el-icon-s-custom"></i>
            <span>系统配置项</span>
          </div>
        </div>
        <el-tabs tab-position="left" v-model="curTab" @tab-click="clickTabHandler">
          <el-tab-pane v-for="(n, i) in CONFIG_TYPE" :label="n.n" :name="n.id" :key="i"></el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="pso-view-body" style="padding: 0" v-if="curNode">
      <syscfg-list :cfg-id="curNode.id"></syscfg-list>
    </div>
  </div>
</template>
<script>
import { CONFIG_TYPE } from "../../const/app";
import SyscfgList from "./list";

export default {
  components: { SyscfgList },
  data() {
    return {
      initializing: false,
      CONFIG_TYPE: CONFIG_TYPE,
      curTab: "",
      curNode: null,
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      this.initializing = true;
      this.curTab = CONFIG_TYPE[0].id + "";
      this.clickTabHandler({ name: CONFIG_TYPE[0].id });
      this.initializing = false;
    },
    async clickTabHandler({ name }) {
      const tab = _.find(CONFIG_TYPE, { id: parseInt(name) });
      if (tab) {
        this.curNode = tab;
      }
    },
  },
};
</script>

<template>
  <div class="pso-frtmgt" v-if="store">
    <div class="pso-frtmgt-l" :style="leftStyle">
      <main-view ref="main" :store="store" @rowclick="mainClickHandler"></main-view>
    </div>
    <div class="pso-frtmgt-r" v-if="store.curInstance">
      <div class="pso-view-withtop">
        <div class="pso-view-top">
          <button-tabs v-model="curTab" :data="TABS"></button-tabs>
        </div>
        <div style="margin-top: 20px">
          <main-designer v-show="curTab === 0" ref="designer" :store="store" @save="saveHandler" @save-pub="savePubHandler"></main-designer>
          <sub-view v-if="curTab === 1" :store="store"></sub-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MainView from "./main";
import MainDesigner from "./main-designer";
import SubView from "./sub";
import FTRStore from "./store";
import ButtonTabs from "../button-tabs";
export default {
  components: { MainView, MainDesigner, SubView, ButtonTabs },
  data() {
    this.TABS = [{ label: "详情" }, { label: "子模块" }];
    return {
      store: null,
      curTab: 0,
    };
  },
  computed: {
    leftStyle() {
      return {
        width: `calc(100% - ${this.store.curInstance ? "800px" : "0px"})`,
      };
    },
  },
  created() {
    this.store = new FTRStore({ $vue: this });
  },
  methods: {
    mainClickHandler(data) {
      this.store.setInstance(data);
      this.$nextTick(() => {
        this.$refs.designer.extandData(data);
      });
    },
    saveHandler(data, pub = false) {
      this.store.modify({ ...data, optype: 1 }, pub);
    },
    savePubHandler(data) {
      this.saveHandler(data, true);
    },
  },
};
</script>
<style lang="less">
.pso-frtmgt {
  height: 100%;
  display: flex;
  .pso-frtmgt-l {
    background: #fff;
    height: 100%;
    overflow: auto;
  }
  .pso-frtmgt-r {
    width: 800px;
    padding: 10px 10px 10px 20px;
    flex-shrink: 0;
    height: 100%;
    overflow: auto;
  }
  .pso-view-top {
    padding: 0 !important;
  }
}
</style>
<template>
  <div class="grid-designer" v-loading="initializing">
    <template v-if="!initializing">
      <div class="grid-designer__body">
        <div class="grid-designer__stage">
          <div class="grid-designer__header">
            <div class="grid-designer__header-l">
              <i class="el-icon-data-analysis"></i>
              <span>模板</span>
            </div>
            <div class="grid-designer__header-r">
              <el-popover v-model="showMenu" ref="popover" placement="bottom-start" trigger="click" popper-class="grid-designer-menu">
                <el-cascader-panel
                  ref="cascader"
                  size="mini"
                  clearable
                  v-model="selectedCpnt"
                  :props="cascaderProps"
                  :options="MENU"
                  @expand-change="menuChange"
                  @change="selectCpnt"
                ></el-cascader-panel>
                <el-button slot="reference" type="text" :loading="store.creating">添加模块</el-button>
              </el-popover>
              <el-button style="margin-left: 10px" type="text" @click="importModule">导入模块</el-button>
            </div>
          </div>
          <div class="grid-designer__stage-body" style="overflow: auto">
            <grid-layout
              :layout="store.layout"
              :col-num="24"
              :row-height="10"
              :is-draggable="true"
              :is-resizable="true"
              :is-mirrored="false"
              :vertical-compact="true"
              auto-size
              :margin="[20, 20]"
              :use-css-transforms="true"
            >
              <grid-item v-for="(d, i) in store.data" :x="d.data.x" :y="d.data.y" :w="d.data.w" :h="d.data.h" :i="d.data.i" :key="i">
                <div
                  :class="{ 'grid-designer-item__active': store.curCpnt && d.i === store.curCpnt.i }"
                  class="grid-designer-item"
                  @click.stop="editCpnt(d)"
                >
                  {{ d.data.w }}
                  {{ d.data.h }}
                  <span>{{ d.data.n }}</span>
                  <i class="delete el-icon-delete-solid" @click.stop="delCpnt(d.i)"></i>
                </div>
              </grid-item>
            </grid-layout>
          </div>
        </div>
        <div class="grid-designer__panel" v-if="store.curCpnt">
          <component v-bind:is="currentEL" :cpnt="store.curCpnt"></component>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { GridLayout, GridItem } from "vue-grid-layout";
import shortid from "shortid";

import GridStore from "./store";
import { CPNT, MENU } from "./const";

const componentsMap = {};
const requireComponent = require.context("./panels", true);
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName);
  const componentName = _.upperFirst(
    _.camelCase(
      fileName
        .split("/")
        .pop()
        .replace(/\.\w+$/, "")
    )
  );
  componentsMap[`GridPanel${componentName}`] = componentConfig.default;
});
export default {
  components: componentsMap,
  props: {
    code: String,
    type: "",
  },
  data() {
    this.MENU = MENU;
    this.cascaderProps = {
      label: "name",
      value: "id",
      emitPath: false,
    };
    return {
      initializing: true,
      showMenu: false,
      store: null,
      selectedCpnt: "",
    };
  },
  computed: {
    currentEL() {
      if (this.store && this.store.curCpnt) {
        return `grid-panel-${this.store.curCpnt.__cpnt__.id}`;
      }
      return "";
    },
  },
  async created() {
    this.initializing = true;
    await this.initialize();
    this.initializing = false;
  },
  methods: {
    async initialize() {
      this.store = new GridStore({ code: this.code, $vue: this });
      if (this.code) {
        await this.store.initialize();
      }
    },
    menuChange() {
      if (this.$refs.popover) {
        this.$nextTick(() => {
          this.$refs.popover.updatePopper();
        });
      }
    },
    async selectCpnt(id) {
      if (!id) {
        return;
      }
      this.$refs.cascader.activePath = [];
      this.$refs.cascader.calculateCheckedNodePaths();
      this.selectedCpnt = [];
      this.showMenu = false;
      await this.store.createCpnt({ id });
    },
    editCpnt(data) {
      this.store.setCurCpnt(data);
    },
    delCpnt(i) {
      this.store.delCpnt(i);
    },
    importModule() {},
  },
};
</script>

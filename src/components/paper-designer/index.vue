<template>
  <div class="grid-designer paper-designer" v-loading="initializing">
    <template v-if="!initializing">
      <div class="grid-designer__body">
        <div class="grid-designer__stage">
          <div class="grid-designer__header">
            <div class="grid-designer__header-l">
              <i class="el-icon-document-checked"></i>
              <span>试卷</span>
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
                <el-button slot="reference" type="text" :loading="store.creating">添加题目</el-button>
              </el-popover>
              <el-button style="margin-left: 10px" type="text" @click="importModule">导入题目</el-button>
            </div>
          </div>
          <div class="grid-designer__stage-body">
            <div class="grid-designer__stage-body-l">
              <paper-base :store="store"></paper-base>
              <paper-nav :store="store" @edit="editCpnt" @del="delCpnt"></paper-nav>
            </div>
            <div class="grid-designer__stage-body-r">

            </div>
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
import PaperStore from "./store";
import { CPNT } from "./const";
import PaperBase from "./base";
import PaperNav from "./nav";

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
  componentsMap[`PaperPanel${componentName}`] = componentConfig.default;
});
export default {
  components: { ...componentsMap, PaperBase, PaperNav },
  props: {
    code: String,
    type: "",
  },
  data() {
    this.MENU = Object.values(CPNT);
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
        return `Paper-panel-${this.store.curCpnt.__cpnt__.id}`;
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
      this.store = new PaperStore({ code: this.code, $vue: this });
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

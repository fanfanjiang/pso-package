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
              <el-tooltip :visible-arrow="false" effect="dark" content="刷新" placement="top-start">
                <el-button size="mini" icon="el-icon-refresh" circle @click="refresh"></el-button>
              </el-tooltip>
              <el-tooltip :visible-arrow="false" effect="dark" content="保存" placement="top-start">
                <el-button
                  circle
                  size="mini"
                  icon="el-icon-upload2"
                  :loading="savingPaper"
                  :disabled="savingPaper"
                  @click="savePaper"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
          <div class="grid-designer__stage-body">
            <div class="grid-designer__stage-body-l">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="考试设置" name="1">
                  <paper-base :store="store"></paper-base>
                </el-collapse-item>
                <el-collapse-item title="题目" name="2">
                  <paper-nav :store="store" @edit="editCpnt" @del="delCpnt"></paper-nav>
                </el-collapse-item>
                <el-collapse-item title="预览" name="3">
                  <div v-if="interStore">
                    <div v-for="(s, k, i) in interStore.previewScore" :key="i">
                      <span>{{ s.name }}： </span>
                      <span>{{ s.score }}</span>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div class="grid-designer__stage-body-r">
              <div class="paper-designer-interpreter">
                <pso-paper-interpreter
                  v-if="!refreshing"
                  ref="interpreter"
                  :params="paperParams"
                  mode="preview"
                  @initialized="initedHandler"
                ></pso-paper-interpreter>
              </div>
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
      refreshing: false,
      savingPaper: false,
      activeNames: ["1", "2", "3"],
      interStore: null,
    };
  },
  computed: {
    currentEL() {
      if (this.store && this.store.curCpnt) {
        return `Paper-panel-${this.store.curCpnt.__cpnt__.id}`;
      }
      return "";
    },
    paperParams() {
      return {
        plug_code: this.store.code,
        mode: "preview",
        size: "mini",
      };
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
    initedHandler(interStore) {
      this.interStore = interStore;
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
      const entity = await this.store.createCpnt({ id });
      if (entity) {
        this.editCpnt(entity);
        this.refresh();
      }
    },
    editCpnt(data) {
      this.store.setCurCpnt(data);
      this.$refs.interpreter.scroll(data.urine.child_id);
    },
    async delCpnt(i) {
      await this.store.delCpnt(i);
      this.refresh();
    },
    importModule() {},
    refresh() {
      this.refreshing = true;
      this.$nextTick(() => {
        this.refreshing = false;
      });
    },
    async savePaper() {
      this.savingPaper = true;
      await this.store.savePaperConfig();
      this.refresh();
      this.savingPaper = false;
    },
  },
};
</script>

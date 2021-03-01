<template>
  <div :class="customClass" v-loading="store && store.initializing">
    <template v-if="store && !store.initializing">
      <div v-if="!store.start && !store.completed" class="paper-interpreter-starter">
        <div class="paper-interpreter-starter__title">{{ store.pluginCfg.tp_name }}</div>
        <div>
          <el-button :size="store.size" type="primary" round @click="startTest">开始答题</el-button>
        </div>
      </div>
      <div v-if="store.completed" class="paper-interpreter-starter completed">
        <div class="paper-interpreter-starter__title">你已完成答题</div>
        <i class="el-icon-trophy"></i>
      </div>
      <div v-if="store.showScoreboard" class="paper-interpreter-board">
        <scoreboard :store="store"></scoreboard>
      </div>
      <transition name="el-fade-in">
        <div class="paper-interpreter-body" v-show="store.start" ref="wrapper">
          <div class="paper-interpreter-content">
            <div class="paper-interpreter-info" v-if="!store.previewMode">
              {{ store.pluginCfg.tp_name }}
            </div>
            <div class="paper-interpreter-base">
              <el-form :size="store.size" label-position="left" label-width="100px">
                <el-form-item v-if="store.paperConfig.nameRequired" label="姓名" required>
                  <el-input :size="store.size" :readonly="!store.paperEditable" v-model.trim="store.base.name" clearable></el-input>
                </el-form-item>
                <el-form-item v-if="store.paperConfig.IDRequired" label="身份证" required>
                  <el-input :size="store.size" :readonly="!store.paperEditable" v-model.trim="store.base.id" clearable></el-input>
                </el-form-item>
                <el-form-item v-if="store.paperConfig.phoneRequired" label="手机" required>
                  <el-input :size="store.size" :readonly="!store.paperEditable" v-model.trim="store.base.phone" clearable></el-input>
                </el-form-item>
                <el-form-item v-if="store.paperConfig.addressRequired" label="地址" required>
                  <el-input :size="store.size" :readonly="!store.paperEditable" v-model.trim="store.base.address" clearable></el-input>
                </el-form-item>
              </el-form>
            </div>
            <template v-if="store.data.length">
              <div class="paper-interpreter-item" v-for="(d, i) in store.data" :key="i" :ref="'q' + d.urine.child_id">
                <div class="paper-interpreter-item__header">
                  <span>{{ d.urine.child_name }}</span>
                  <span
                    >(共
                    <span>{{ d.questions && d.questions.length }}</span>
                    题，每题
                    <span>{{ d.data.score }}</span>
                    分，合计
                    <span>{{ ((d.questions && d.questions.length) || 0) * d.data.score }}</span>
                    分)
                  </span>
                </div>
                <component v-bind:is="getCpntEl(d.data.id)" :cpnt="d"></component>
              </div>
            </template>
            <pso-empty v-else text="暂无试题"></pso-empty>
          </div>
        </div>
      </transition>
      <transition name="el-fade-in">
        <div class="paper-interpreter-ctrl" v-if="store.editMode && store.start && !store.completed">
          <el-popconfirm title="你确定要提交吗？" @confirm="completePaper">
            <el-button slot="reference" type="primary" round :size="store.size" :loading="store.completing" :disabled="store.completing">
              提交
            </el-button>
          </el-popconfirm>
          <el-backtop target=".paper-interpreter-body" :visibility-height="500"></el-backtop>
        </div>
      </transition>
      <div class="paper-interpreter-ctrl" v-if="store.gradeMode">
        <el-popconfirm title="你确定要提交吗？" @confirm="gradePaper">
          <el-button slot="reference" type="primary" round :size="store.size" :loading="store.grading" :disabled="store.grading">
            完成阅卷
          </el-button>
        </el-popconfirm>
        <el-backtop target=".paper-interpreter-body" :visibility-height="500"></el-backtop>
      </div>
    </template>
  </div>
</template>
<script>
import Store from "./store";
import { aniscrollTo } from "../../utils/scroll-to";
import Scoreboard from "./scoreboard";

const componentsMap = {};
const requireComponent = require.context("./cpnts", true);
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
  componentsMap[`PaperCpnt${componentName}`] = componentConfig.default;
});

const EXCULDED = ["plug_code", "size", "appid", "paperId"];

export default {
  components: { ...componentsMap, Scoreboard },
  props: {
    params: Object,
    mode: {
      type: String,
      default: "edit",
    },
  },
  data() {
    return {
      store: null,
    };
  },
  computed: {
    customClass() {
      return {
        "paper-interpreter-medium": this.store.size === "medium",
        "paper-interpreter-mini": this.store.size === "mini",
        "paper-interpreter-preview": this.store.mode === "preview",
        "paper-interpreter": true,
      };
    },
  },
  watch: {
    "params.plug_code": {
      immediate: true,
      handler(value) {
        value && this.initialize();
      },
    },
  },
  methods: {
    async initialize() {
      const { plug_code: code, size = "medium", appid, paperId = "" } = this.params;
      const extension = {};
      for (let q in this.$router.currentRoute.query) {
        if (EXCULDED.indexOf(q) === -1) {
          extension[q] = this.$router.currentRoute.query[q];
        }
      }
      this.store = new Store({ $vue: this, code, size, mode: this.mode, appid, paperId, extension });
      await this.store.initialize();
      this.$emit("initialized", this.store);
    },
    getCpntEl(id) {
      return `paper-cpnt-${id}`;
    },
    scroll(id) {
      if (this.$refs[`wrapper`] && $(this.$refs[`q${id}`]).get(0)) {
        aniscrollTo(this.$refs[`wrapper`], $(this.$refs[`q${id}`]).get(0));
      }
    },
    startTest() {
      this.store.startTest();
    },
    completePaper() {
      this.store.completePaper();
    },
    gradePaper() {
      this.store.gradePaper();
    },
  },
};
</script>
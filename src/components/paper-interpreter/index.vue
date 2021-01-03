<template>
  <div :class="customClass" v-loading="store && store.initializing">
    <template v-if="store && !store.initializing">
      <div v-if="!store.start" class="paper-interpreter-starter">
        <div class="paper-interpreter-starter__title">{{ store.pluginCfg.tp_name }}</div>
        <div>
          <el-button :size="store.size" type="primary" round @click="startTest">开始答题</el-button>
        </div>
      </div>
      <transition name="el-fade-in">
        <div class="paper-interpreter-body" v-show="store.start" ref="wrapper">
          <div class="paper-interpreter-content">
            <div class="paper-interpreter-info" v-if="store.mode !== 'preview'">
              {{ store.pluginCfg.tp_name }}
            </div>
            <div class="paper-interpreter-base">
              <el-form :size="store.size" label-position="left" label-width="100px">
                <el-form-item v-if="store.paperConfig.nameRequired" label="姓名" required>
                  <el-input :size="store.size" v-model.trim="store.base.name" clearable></el-input>
                </el-form-item>
                <el-form-item v-if="store.paperConfig.IDRequired" label="身份证" required>
                  <el-input :size="store.size" v-model.trim="store.base.id" clearable></el-input>
                </el-form-item>
                <el-form-item v-if="store.paperConfig.phoneRequired" label="手机" required>
                  <el-input :size="store.size" v-model.trim="store.base.phone" clearable></el-input>
                </el-form-item>
                <el-form-item v-if="store.paperConfig.addressRequired" label="地址" required>
                  <el-input :size="store.size" v-model.trim="store.base.address" clearable></el-input>
                </el-form-item>
              </el-form>
            </div>
            <template v-if="store.data.length">
              <div class="paper-interpreter-item" v-for="(d, i) in store.data" :key="i" :ref="'q' + d.urine.child_id">
                <div class="paper-interpreter-item__header">
                  <span>{{ d.urine.child_name }}</span>
                  <span>
                    (共{{ d.questions && d.questions.length }}题，合计{{ ((d.questions && d.questions.length) || 0) * d.data.score }}分)
                  </span>
                </div>
                <component v-bind:is="getCpntEl(d.data.id)" :cpnt="d"></component>
              </div>
            </template>
            <pso-empty text="暂无试题"></pso-empty>
          </div>
        </div>
      </transition>
      <transition name="el-fade-in">
        <div class="paper-interpreter-ctrl" v-if="store.mode !== 'preview' && store.start">
          <el-popconfirm title="你确定要提交吗？" @confirm="completeTest">
            <el-button slot="reference" :size="store.size" type="primary" round>提交</el-button>
          </el-popconfirm>
          <el-backtop target=".paper-interpreter-body" :visibility-height="500"></el-backtop>
        </div>
      </transition>
    </template>
  </div>
</template>
<script>
import Store from "./store";
import { aniscrollTo } from "../../utils/scroll-to";

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

export default {
  components: { ...componentsMap },
  props: {
    params: Object,
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
      const { plug_code: code, size = "medium", mode = "edit", appid } = this.params;
      this.store = new Store({ $vue: this, code, size, mode, appid });
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
    completeTest() {},
  },
};
</script>
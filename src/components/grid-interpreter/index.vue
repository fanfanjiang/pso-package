<template>
  <div class="grid-interpreter" v-loading="initializing">
    <div class="grid-interpreter-body">
      <grid-layout
        :layout="store.layout"
        :col-num="24"
        :row-height="10"
        :is-draggable="false"
        :is-resizable="false"
        :is-mirrored="false"
        :vertical-compact="true"
        auto-size
        :margin="[20, 20]"
        :use-css-transforms="true"
      >
        <grid-item v-for="(d, i) in store.data" :x="d.data.x" :y="d.data.y" :w="d.data.w" :h="d.data.h" :i="d.data.i" :key="i">
          <component v-bind:is="getCpntEl(d.data.id)" :cpnt="d"></component>
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>
<script>
import { GridLayout, GridItem } from "vue-grid-layout";
import GridStore from "../grid-designer/store";

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
  componentsMap[`GridCpnt${componentName}`] = componentConfig.default;
});
export default {
  components: { ...componentsMap, GridLayout, GridItem },
  props: {
    params: Object,
  },
  data() {
    return {
      initializing: true,
      store: null,
    };
  },
  async created() {
    this.initializing = true;
    await this.initialize();
    this.initializing = false;
  },
  methods: {
    async initialize() {
      this.store = new GridStore({ code: this.params.plug_code, $vue: this });
      await this.store.initialize();
    },
    getCpntEl(id) {
      return `grid-cpnt-${id}`;
    },
  },
};
</script>
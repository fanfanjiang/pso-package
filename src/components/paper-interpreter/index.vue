<template>
  <div class="paper-interpreter">
    <div class="paper-interpreter-body">
      <div class="paper-interpreter-item" v-for="(d, i) in store.data" :key="i">
        <component v-bind:is="getCpntEl(d.data.id)" :cpnt="d"></component>
      </div>
    </div>
  </div>
</template>
<script>
import Store from "./store";

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
  components: { ...componentsMap },
  props: {
    params: Object,
  },
  methods: {
    async initialize() { 
      this.store = new Store({ code: this.params.plug_code, $vue: this });
      await this.store.initialize();
    },
    getCpntEl(id) {
      return `grid-cpnt-${id}`;
    },
  },
};
</script>
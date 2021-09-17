<template>
  <component v-bind:is="cpntEl" :instance="instance" :store="store"></component>
</template>
<script>
const componentsMap = {};
const requireComponent = require.context("./practice", true);
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
  componentsMap[`PracticeCpnt${componentName}`] = componentConfig.default;
});
export default {
  components: componentsMap,
  props: {
    instance: {
      type: Object, 
      default: () => ({}),
    },
    store: Object,
  },
  computed: {
    cpntEl() {
      return `practice-cpnt-${this.instance.cid}`;
    },
  },
};
</script>


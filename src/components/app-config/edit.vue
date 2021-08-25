<template>
  <component v-bind:is="currentCpnt" :data="data"></component>
</template>
<script>
import { CONFIG_TYPE } from "../../const/app";
const componentsMap = {};
const requireComponent = require.context("./item", true);
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
  componentsMap[`PsoCfgitem${componentName}`] = componentConfig.default;
});
export default {
  components: componentsMap,
  props: {
    id: Number,
    data: Object,
  },
  computed: {
    configCpnt() {
      return _.find(CONFIG_TYPE, { id: this.id }).cpnt;
    },
    currentCpnt() {
      return `pso-cfgitem-${this.configCpnt}`;
    },
  },
};
</script>

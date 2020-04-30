<template>
  <div class="actor-panel">
    <template v-for="cpnt in store.cpntsMap">
      <component
        v-show="store.fid===cpnt.fid"
        :key="cpnt.fid"
        v-bind:is="currentEL(cpnt)"
        :cpnt="cpnt"
      ></component>
    </template>
  </div>
</template>  
<script>
const componentsMap = {};
const requireComponent = require.context("./panels", true);
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);
  const componentName = _.upperFirst(
    _.camelCase(
      fileName
        .split("/")
        .pop()
        .replace(/\.\w+$/, "")
    )
  );
  componentsMap[`PsoPanel${componentName}`] = componentConfig.default;
});
export default {
  components: componentsMap,
  props: ["store"],
  methods: {
    currentEL(cpnt) {
      return `pso-panel-${cpnt.componentid}`;
    }
  }
};
</script>
<style lang="less" scoped>
.actor-panel {
  min-height: 100%;
  padding: 15px;
}
</style>
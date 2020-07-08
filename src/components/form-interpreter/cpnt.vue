<template>
  <component
    v-bind:is="currentCpnt"
    @value-change="$emit('value-change',$event)"
    v-show="displayable(cpnt)"
    :cpnt="cpnt"
    :key="cpnt.fid"
  >
    <template v-for="cpntItem in cpnt.childComponents">
      <pso-form-component
        @value-change="$emit('value-change',$event)"
        v-show="displayable(cpntItem)"
        :key="cpntItem.fid"
        :cpnt="cpntItem"
      ></pso-form-component>
    </template>
  </component>
</template>
<script>
const componentsMap = {};
const requireComponent = require.context("./components", true);
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
  componentsMap[`PsoForm${componentName}`] = componentConfig.default;
});

export default {
  name: "PsoFormComponent",
  components: componentsMap,
  props: ["cpnt", "forceShow"],
  computed: {
    currentCpnt() {
      return `pso-form-${this.cpnt.componentid}`;
    }
  },
  methods: {
    displayable(cpnt) {
      if (this.forceShow) return true;

      const show = cpnt.data._hideForever ? false : !cpnt.store.instance_id ? cpnt.data._hideOnNew !== true : true;

      //显示规则判断
      let showInRules = true;
      if (typeof cpnt.data.showInRules !== "undefined") {
        showInRules = !!cpnt.data.showInRules;
      }

      //字段权限判断
      let showInAuth = true;
      if (!_.isNull(cpnt.data.__auth__)) {
        showInAuth = (cpnt.data.__auth__ & 8) === 8;
      }

      return show && showInRules && showInAuth;
    }
  }
};
</script>
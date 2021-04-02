<template>
  <pso-grid-wrapper ref="wrapper" :cpnt="cpnt" @checkmore="checkmore">
    <template #header>
      <button-tabs v-model="curTab" :data="tabs" :indexed="false" :color="cpnt.data.headerTextColor"></button-tabs>
    </template>
    <component v-if="cpntEL" v-bind:is="cpntEL" :cpnt="subCpnt"></component>
  </pso-grid-wrapper>
</template>
<script>
import { BaseMixin } from "../mixin";
import ButtonTabs from "../../button-tabs";
import Store from "../../grid-designer/store";

const componentsMap = {};
const requireComponent = require.context("./", true);
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
  if (componentName !== "Tab") {
    componentsMap[`GridCpnt${componentName}`] = componentConfig.default;
  }
});

export default {
  components: { ButtonTabs, ...componentsMap },
  mixins: [BaseMixin],
  data() {
    this.tabs = [];
    return {
      initializing: true,
      curTab: 0,
      store: null,
    };
  },
  computed: {
    cpntEL() {
      if (this.subCpnt) {
        return `grid-cpnt-${this.subCpnt.data.id}`;
      }
    },
    subCpnt() {
      if (this.store) {
        const cpnt = _.find(this.store.data, { child_id: this.curTab });
        if (cpnt) {
          cpnt.data.headerHidden = true;
          return cpnt;
        }
      }
    },
  },
  created() {
    if (!this.cpnt.data.tabs.length) return;
    this.tabs = this.cpnt.data.tabs.map((d) => ({ label: d.n, icon: d.icon, id: d.v }));
    this.curTab = this.tabs[0].id;
    this.fetch();
  },
  methods: {
    async fetch() {
      this.store = new Store({ $vue: this });
      await this.store.fetchPluginModules({ child_id: { type: 4, value: _.map(this.tabs, "id").join(",") } });
    },
  },
};
</script>

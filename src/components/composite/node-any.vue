<template>
  <div class="pso-view pso-view__expand">
    <template>
      <div class="pso-view-extend">
        <div class="pso-badges">
          <div class="pso-badges-item"></div>
        </div>
      </div>
      <div class="pso-view-body"></div>
    </template>
  </div>
</template>
<script>
import { TagMixin } from "../../mixin/composite";
export default {
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      initializing: false,
      curNode: null,
      curTag: null,
      tpCfg: null,
      cpntParams: {}, //组件参数
    };
  },
  computed: {
    treeOptions() {
      return {
        dimen: 5,
        data_type: this.params.data_type,
      };
    },
    currentCpnt() {
      if (this.tpCfg && this.tpCfg.tp_component) {
        return this.tpCfg.tp_component;
      } else {
        return "";
      }
    },
  },
  methods: {
    async initialize() {
      const nodes = (await this.API.trees({ data: { rootable: true, lazy: false, ...this.treeOptions } })).data.tagtree;

      for (let node of nodes) {
        await this.API.tag({ data: { tag_code } });
      }
    },
  },
};
</script>
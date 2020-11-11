<template>
  <div class="pso-lay-ttable-wrapper">
    <div class="pso-lay-ttable">
      <div class="pso-lay-ttable__l" v-bar>
        <div>
          <pso-tree-common
            ref="tree"
            :request-options="treeOptions"
            :edit-mode="false"
            :draggable="false"
            @node-click="nodeClickHandler"
          ></pso-tree-common>
        </div>
      </div>
      <div class="pso-lay-ttable__r">
        <div class="pso-lay-ttable__content">
          <pso-form-view v-bind="options" v-if="curForm"></pso-form-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["params"],
  data() {
    return {
      initializing: true,
      curNode: {},
      curForm: null,
    };
  },
  computed: {
    treeOptions() {
      return {
        data_type: this.params.data_type,
        dimen: 7,
      };
    },
    options() {
      return { cfgId: this.curForm.data_code, ...this.params };
    },
  },
  methods: {
    async nodeClickHandler(node) {
      if (!node.is_leaf) return;
      this.curForm = null;
      const cfgRet = await this.API.workflowcfg({ data: { node_id: node.node_name, auth: 1, extendForm: 1 } });
      this.curNode = node;
      this.curForm = cfgRet.data.formCfg;
    },
  },
};
</script>

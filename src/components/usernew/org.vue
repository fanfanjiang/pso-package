<template>
  <div class="Lay-setting" v-loading="initializing">
    <div class="header">
      <el-tabs v-model="curTab">
        <el-tab-pane v-for="(d, i) in tabs" :key="i" :label="d.node_display" :name="d.node_name"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="body">
      <div style="padding: 0" v-if="!initializing">
        <org-view v-if="curTab" v-bind="options" @refresh="initialize"></org-view>
      </div>
    </div>
  </div>
</template>
<script> 
import OrgView from "./org-view";
import { listToTree } from "../../utils/util";

export default {
  components: { OrgView },
  props: {
    params: {
      type: Object,
      default: () => ({ data_type: "" }),
    },
  },
  data() {
    return {
      curTab: "",
      tabs: [],
      initializing: true,
    };
  },
  computed: {
    options() {
      return {
        nodeid: this.curTab,
      };
    },
  },
  async created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      this.initializing = true;
      const trees = (await this.API.trees({ data: { dimen: 2 } })).data.tagtree;

      this.tabs = listToTree({ list: trees, pid: "node_pid", id: "node_id" });
      if (this.tabs.length) {
        this.curTab = this.tabs.length ? this.tabs[0].node_name : "";
      }
      this.initializing = false;
    },
  },
};
</script>
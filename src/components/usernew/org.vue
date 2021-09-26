<template>
  <div class="Lay-setting" v-loading="initializing">
    <div class="header">
      <el-tabs v-model="curTab">
        <el-tab-pane v-for="(d, i) in tabs" :key="i" :label="d.node_display" :name="d.node_name"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="body">
      <div style="padding: 0">
        <org-view v-if="curTab" v-bind="options"></org-view>
      </div>
    </div>
  </div>
</template>
<script>
import OrgView from "./org-view";

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
    datatype() {
      return this.params.data_type;
    },
    options() {
      return {
        nodeid: this.curTab,
        datatype: this.datatype,
      };
    },
  },
  async created() {
    this.initializing = true;
    this.tabs = (await this.API.trees({ data: { dimen: 2 } })).data.tagtree;
    this.initializing = false;

    if (ret.success) {
      this.tabs = ret.data;
      this.curTab = this.tabs.length ? this.tabs[0].node_name : "";
    }
  },
};
</script>
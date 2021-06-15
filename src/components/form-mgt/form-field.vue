<template>
  <div class="pso-view-withtop" style="padding-top: 20px">
    <div class="pso-view-top" style="padding: 0" v-if="!loadingBar">
      <great-panel padding="0" color="#fff">
        <template #header>
          <i class="el-icon-edit-outline"></i>
          <span>字段权限设置，默认拥有全部字段权限</span>
        </template>
      </great-panel>
    </div>
    <div :class="viewClass">
      <div class="pso-view-extend">
        <div class="pso-tabs">
          <el-tabs tab-position="left" v-model="curTab" @tab-click="handleTabClick">
            <el-tab-pane v-for="(d, i) in data" :label="d.field_display" :name="d.field_name" :key="i"> </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="pso-view-body" style="padding: 0 0 0 15px">
        <pso-field-auth v-if="curNode" :field="curNode" :code="code"></pso-field-auth>
      </div>
    </div>
  </div>
</template>
<script>
import PsoFieldAuth from "./field-auth";
import { MgtMixin } from "../../mixin/view";
import GreatPanel from "../great-panel";

export default {
  mixins: [MgtMixin],
  props: ["data", "code"],
  components: { GreatPanel, PsoFieldAuth },
  data() {
    return {
      curNode: null,
      curTab: "",
    };
  },
  created() {
    if (this.data.length) {
      this.handleTabClick({ name: this.data[0].field_name });
    }
  },
  methods: {
    handleTabClick({ name }) {
      const tab = _.find(this.data, { field_name: name });
      if (tab) {
        this.curNode = tab;
        this.curTab = name;
      }
    },
    getName({ field_display, field_name }) {
      return `${field_display}(${field_name})`;
    },
  },
};
</script>
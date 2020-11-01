<template>
  <div class="pso-page">
    <div class="pso-page-body">
      <div class="pso-page__tree narrow">
        <div class="tag-list">
          <el-tabs tab-position="left" @tab-click="handleTabClick" v-model="curTab">
            <el-tab-pane :label="getName(item)" :name="item.field_name" :key="item.field_name" v-for="item in data"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="pso-page-body__content">
        <div class="pso-page-body__wrapper">
          <div class="pso-page-body__tabbody" v-if="curNode">
            <pso-field-auth :field="curNode" :code="code"></pso-field-auth>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PsoFieldAuth from "./field-auth";

export default {
  props: ["data", "code"],
  components: { PsoFieldAuth },
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
      }
    },
    getName({ field_display, field_name }) {
      return `${field_display}(${field_name})`;
    },
  },
};
</script>
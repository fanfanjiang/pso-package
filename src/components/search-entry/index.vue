<template>
  <div class="pso-search-entry">
    <el-tooltip effect="dark" content="搜索" placement="bottom-end">
      <i class="pso-search-entry-trigger el-icon-search" @click="show = true"></i>
    </el-tooltip>
    <pso-dialog customclass="pso-search-entry-panel" :visible="show" width="80%" @close="show = false" @opened="focusInput">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <div class="pso-search-entry-input">
              <el-input ref="searchInput" size="medium" clearable v-model="keywords" placeholder="搜索" prefix-icon="el-icon-search"> </el-input>
            </div>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-search-result">
        <div class="pso-search-result__header">
          <el-tabs v-model="curTab" @tab-click="makeSearch">
            <el-tab-pane label="功能" name="func"></el-tab-pane>
            <el-tab-pane label="数据" name="data"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="pso-search-result__body">
          <search-function ref="func" v-show="curTab === 'func'"></search-function>
          <pso-ftr ref="data" v-show="curTab === 'data'" :params="{ q: keywords }" :inputable="false"></pso-ftr>
        </div>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import SearchFunction from "./search-function";
export default {
  components: { SearchFunction },
  data() {
    return {
      show: false,
      keywords: "",
      curTab: "func",
    };
  },
  watch: {
    keywords() {
      this.makeSearch();
    },
  },
  methods: {
    focusInput() {
      this.$refs.searchInput.focus();
      this.makeSearch();
    },
    makeSearch() {
      this.$refs[this.curTab].setKeywords(this.keywords);
    },
  },
};
</script>
<template>
  <div class="view-table-fun">
    <template v-if="store.defCondition.length">
      <el-button type="text" icon="fa fa-filter" @click="store.showFilter = !store.showFilter">筛选</el-button>
      <el-divider direction="vertical"></el-divider>
    </template>
    <el-popover v-model="showFidSet" placement="bottom-start" width="300" trigger="click">
      <div class="pso-switch-panel">
        <template v-for="(f, i) of store.fields">
          <div class="pso-switch-panel__item" v-if="f.display" :key="i">
            <el-switch v-model="f.show" :inactive-text="f.display" active-value="1" inactive-value="0"></el-switch>
          </div>
        </template>
      </div>
      <el-button type="text" icon="el-icon-setting" slot="reference">列表</el-button>
    </el-popover>
    <el-divider direction="vertical"></el-divider>
    <el-input
      ref="keywords"
      placeholder="搜索"
      prefix-icon="el-icon-search"
      size="mini"
      clearable
      v-show="showKeywords"
      v-model="store.keywords"
      @blur="onKeywordsBlur"
      @clear="showKeywords = false"
      @change="store.deFetch"
    ></el-input>
    <el-button v-show="!showKeywords" type="text" icon="el-icon-search" @click="onClickSearch">搜索</el-button>
    <el-divider direction="vertical"></el-divider>
    <el-button type="text" icon="el-icon-refresh" @click="store.deFetch">刷新</el-button>
    <template v-if="fileList.length">
      <el-divider direction="vertical"></el-divider>
      <el-popover placement="bottom-start" width="300" trigger="click">
        <pso-file-list :files="fileList" :remove="false"></pso-file-list>
        <el-button type="text" icon="el-icon-setting" slot="reference">文件</el-button>
      </el-popover>
    </template>
  </div>
</template>
<script>
import { makeFiles } from "../../tool/file";
export default {
  props: {
    store: Object,
    files: String,
  },
  data() {
    return {
      showFidSet: false,
      showKeywords: false,
      fileList: [],
    };
  },
  async created() {
    if (this.files) {
      const ret = await this.API.file({ data: { ids: this.files }, method: "get" });
      makeFiles({ files: ret.data, urlField: "res_path", nameField: "res_name" });
      this.fileList = ret.data;
    }
  },
  methods: {
    onKeywordsBlur() {
      this.showKeywords = this.store.keywords !== "";
    },
    onClickSearch() {
      this.showKeywords = true;
      this.$nextTick(() => {
        this.$refs.keywords.focus();
      });
    },
  },
};
</script>
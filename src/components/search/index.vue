<template>
  <div class="pso-search">
    <el-input
      ref="keywords"
      placeholder="搜索"
      prefix-icon="el-icon-search"
      size="mini"
      clearable
      v-show="showKeywords"
      v-model="keywords"
      @blur="onKeywordsBlur" 
      @clear="showKeywords = false"
    ></el-input>
    <el-button v-show="!showKeywords" type="text" icon="el-icon-search" @click="onClickSearch">
      <template v-if="!__isMobile__">{{ text }}</template>
    </el-button>
  </div>
</template>
<script>
export default {
  props: {
    value: String,
    text: {
      type: String,
      default: "搜索",
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      showKeywords: false,
      keywords: "",
    };
  },
  watch: {
    keywords(val) {
      this.$emit("change", val);
    },
  },
  methods: {
    onKeywordsBlur() {
      this.showKeywords = this.keywords !== "";
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
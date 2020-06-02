<template>
  <div class="pso-page">
    <div class="pso-page-body">
      <div class="pso-page__tree narrow" v-bar>
        <div style="padding-top:40px">
          <div class="pso-page__tree-header">
            <el-tabs v-model="curTab">
              <el-tab-pane label="分类" name="tree"></el-tab-pane>
              <el-tab-pane label="标签" name="tag"></el-tab-pane>
            </el-tabs>
          </div>
          <pso-tree-common
            v-show="curTab==='tree'"
            :request-options="treeOptions"
            :edit-mode="false"
            @node-click="nodeClickHandler"
          ></pso-tree-common>
          <div class="tag-list">
            <el-tabs
              v-loading="loading"
              tab-position="left"
              style="height:100%;"
              v-show="curTab==='tag'"
              @tab-click="handleTagClick"
            >
              <el-tab-pane
                :name="tag.tag_no"
                :label="tag.tag_name"
                v-for="tag in tags"
                :key="tag.tag_no"
              ></el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <div class="pso-page-body__content">
        <component v-if="currentCpnt" v-bind:is="currentCpnt" :params="params"></component>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => {
        data_type: "";
      }
    }
  },
  data() {
    return {
      loading: false,
      curNode: null,
      curTag: null,
      curTab: "tree",
      tags: []
    };
  },
  computed: {
    treeOptions() {
      return {
        dimen: 5,
        data_type: this.params.data_type
      };
    },
    currentCpnt() {
      if (this.curTag && this.curTag.tp_content) {
        return this.curTag.tp_content;
      } else {
        return "";
      }
    }
  },
  methods: {
    async nodeClickHandler(node) {
      if (node.is_leaf) {
        this.curNode = node;
        this.fetchTags();
        this.curTab = "tag";
      }
    },
    async fetchTags() {
      this.loading = true;
      const ret = await this.API.tag({ data: { tag_code: this.curNode.node_id } });
      if (ret.success) {
        this.tags = ret.data;
        this.curTag = this.tags[0];
      }
      this.loading = false;
    }, 
    handleTagClick(tag) {
      this.curTag = _.find(this.tags, { tag_no: tag.name });
    }
  }
};
</script>

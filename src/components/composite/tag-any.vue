<template>
  <div class="pso-page">
    <div class="pso-page-body" style="padding: 0 0 0 10px">
      <div class="pso-page__tree narrow">
        <div style="padding-top: 40px">
          <div class="pso-page__tree-header">
            <el-tabs v-model="curTab">
              <el-tab-pane label="目录" name="tree"></el-tab-pane>
              <el-tab-pane label="分类" name="tag"></el-tab-pane>
            </el-tabs>
          </div>
          <pso-tree-common
            v-show="curTab === 'tree'"
            :request-options="treeOptions"
            :edit-mode="false"
            @node-click="nodeClickHandler"
          ></pso-tree-common>
          <div class="tag-list">
            <el-tabs
              v-loading="loading"
              tab-position="left"
              style="height: 100%"
              v-show="curTab === 'tag'"
              v-model="curTagTab"
              @tab-click="handleTagClick"
            >
              <el-tab-pane :name="tag.tag_no" :label="tag.tag_name" v-for="tag in tags" :key="tag.tag_no"></el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <div class="pso-page-body__content" v-loading="initializing">
        <component
          v-if="currentCpnt && !initializing"
          v-bind:is="currentCpnt"
          v-bind="cpntParams"
          :params="{ ...cpntParams, opable: true }"
        ></component>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    params: {
      type: Object,
    },
  },
  data() {
    return {
      initializing: false,
      loading: false,
      curNode: null,
      curTag: null,
      curTab: "tree",
      tags: [],
      cpntParams: {},
      tpCfg: null,
      curTagTab: "",
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
    async nodeClickHandler(node) {
      if (node.is_leaf) {
        this.curNode = node;
        await this.fetchTags();
        this.curTab = "tag";
      }
    },
    async fetchTags() {
      this.loading = true;
      const ret = await this.API.tag({ data: { keys: JSON.stringify({ node_id: { type: 1, value: this.curNode.node_id } }) } });
      if (ret.success) {
        this.tags = ret.data;
        await this.handleTagClick({ name: this.tags[0].tag_no });
      }
      this.loading = false;
    },
    reset() {
      this.cpntParams = {};
    },
    async handleTagClick({ name }) {
      this.reset();
      this.curTagTab = name;
      this.initializing = true;
      this.curTag = _.find(this.tags, { tag_no: name });

      if (this.curTag.tag_config) {
        const cfg = JSON.parse(this.curTag.tag_config);

        if (cfg.tag_source) {
          this.$set(this.cpntParams, "plug_code", cfg.tag_source);
          this.$set(this.cpntParams, "viewAuth", parseInt(this.curNode.leaf_auth || 0));

          const ret = await this.API.templates({ data: { tp_code: cfg.tag_source }, method: "get" });

          if (ret.success && ret.data.tp) {
            cfg.tag_set.forEach((item) => this.$set(this.cpntParams, item.field, item.value));
            this.tpCfg = ret.data.tp;
          }
          if (this.cpntParams.where) {
            this.cpntParams.defForm = { [this.cpntParams.where]: this.curTag.tag_no };
          }

          this.initializing = false;
        }
      }
    },
  },
};
</script>
